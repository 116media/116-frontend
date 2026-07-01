# Why Not next-auth (Auth.js)

next-auth / Auth.js is the default reach for Next.js auth. We deliberately do
**not** use it. The 116 backend (.NET 9) is already a complete, production-grade
auth system; next-auth would duplicate most of it, fail to support the rest, and
introduce a second session system that conflicts with ours.

---

## The backend already owns auth

| Capability | Backend endpoint | next-auth |
|---|---|---|
| Email + password login | `POST /auth/login` | Credentials provider (intentionally limited) |
| Signup + OTP verification | `POST /auth/signup` + `verify-otp` | not supported |
| Social login | `POST /auth/social-login` | built-in OAuth (different flow) |
| Password reset / change | `forgot-password` / `reset-password` / `change-password` | not supported |
| Access + refresh tokens (httpOnly cookies) | login + `sessions/refresh-token` | own JWT session; no refresh for Credentials |
| Session list / revoke / sign-out-all | `me/sessions*`, `auth/sign-out-all` | not supported |
| Account status (`isVerified`, `isActive`) | on `UserResponseDto` | not supported |
| Roles + permissions | on `UserResponseDto` | manual via callbacks |

The backend handles everything; next-auth would re-implement a worse subset.

---

## The conflicts

- **Two session systems.** next-auth issues its own `next-auth.session-token`
  cookie; the backend issues `accessToken` / `refreshToken`. They drift —
  `useSession()` can say "authenticated" while the API returns 401.
- **Credentials provider is limited by design** (no refresh, no session
  management, no multi-step OTP) — you'd bypass next-auth for most of the flow.
- **Social-login collision.** Our flow posts the provider token to
  `POST /auth/social-login` so the **backend** creates/links the user (and
  assigns roles/permissions). next-auth's redirect flow creates a user in *its*
  session that the backend never sees. Bridging needs a custom adapter that calls
  the backend on every sign-in — more glue than calling the backend directly.
- **Permission model.** The backend's resource+action permissions have no
  next-auth equivalent; you'd hand-sync them into session callbacks.

---

## What we do instead

The backend is the single source of truth; the frontend is a thin client:

```text
Auth modal (login)      → POST /auth/login → httpOnly cookies + { user }
                        → TanStack ['auth','me'] set, modal closes
Reload / SSR            → getCurrentUser() reads cookie → GET /me/profile → hydrate
401 (token expired)     → interceptor → POST /sessions/refresh-token → retry
Protected (user) routes → middleware reads cookie → redirect home + ?authRequired
```

No second session system, no adapter glue. See
[04-token-and-cookie-model.md](04-token-and-cookie-model.md),
[05-state-management.md](05-state-management.md),
[06-api-client-interceptors.md](06-api-client-interceptors.md),
[13-authorization-and-guards.md](13-authorization-and-guards.md).

---

## Dependencies saved

We avoid `next-auth` / `@auth/core` (150KB+), database adapters, and the
adapter/callback glue. The entire client auth layer is small and explicit:
`AuthProvider` + `AuthModalProvider` (contexts), `getCurrentUser()` (server),
`middleware.ts` (route protection), the refresh interceptor, and the modal
forms — a few hundred lines of straightforward code instead of a library plus
adapters fighting our backend.

## When next-auth *would* fit

A simple CRUD backend with no auth logic, OAuth-only, no refresh/session/device
needs, frontend owning auth. None of that is 116 — the backend is already the
auth system.
