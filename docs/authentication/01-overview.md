# Authentication & Session — Overview

This documents the web frontend's **authentication & session** module: how a
visitor signs up, verifies, logs in, recovers a password, stays logged in
across pages, and signs out — and how the logged-in user is shared across the
whole application.

The behavior mirrors the **mobile app** (`apps/mobile`) feature-for-feature.
Where the web platform differs (cookies vs. secure device storage, modals vs.
full screens), this set of documents explains the web-appropriate equivalent
and why it diverges.

---

## Goals

- **Parity with mobile.** Same flows, same fields, same validation rules, same
  account states (guest / unverified / authenticated), same endpoints.
- **Cookie-based sessions.** The web uses the backend's **httpOnly cookie**
  token delivery — no access/refresh tokens ever touch JavaScript. See
  [04-token-and-cookie-model.md](04-token-and-cookie-model.md).
- **TanStack Query v5** owns server state (the current user, sessions) and all
  auth mutations. See [05-state-management.md](05-state-management.md).
- **React Context** exposes the resolved auth state (`user`, `status`, and the
  auth actions) to the entire component tree via a single `useAuth()` hook.
- **Modal forms, not pages.** Every auth form (login, signup, OTP, forgot /
  reset password) is rendered in a **modal dialog** layered over the current
  page — the user is never navigated away. See
  [08-modal-forms-ux.md](08-modal-forms-ux.md).
- **Clean architecture.** The module mirrors the existing `videos` / `articles`
  vertical slices: domain entities, repository port + impl, use cases, mappers,
  DI registration, presentation. See [02-architecture.md](02-architecture.md).

## Non-goals (for the first phase)

- **Social login (Google / Facebook).** The backend exposes
  `POST /api/v1/public/auth/social-login` and mobile supports it, but the web
  OAuth flow is deferred to a later phase. It is documented in
  [07-auth-flows.md](07-auth-flows.md) so the data model leaves room for it.
- **Admin / dashboard concerns.** This module is the public visitor experience
  only. The dashboard has its own auth module.

---

## The core decisions at a glance

| Concern | Decision | Why |
|---|---|---|
| Token transport | Backend-set **httpOnly cookies** (`accessToken`, `refreshToken`) | Immune to XSS; the browser attaches them automatically with `withCredentials` |
| Client identity | `Client-App: WebApp` header (`NEXT_PUBLIC_CLIENT_APP=WebApp`) | The backend switches to cookie delivery for `WebApp`/`Dashboard` |
| User persistence between pages | Re-fetch `GET /api/v1/public/me/profile` via a cached TanStack query, hydrated from the session cookie | No user object in `localStorage`; the cookie is the durable session |
| App-wide access to user | `AuthProvider` + `useAuth()` wrapping the `me` query | One source of truth, derived `status` |
| Server state & mutations | TanStack Query v5 | Caching, dedup, invalidation, retries |
| Forms | Modal dialogs (Radix Dialog) | Keep the user in context; no route change |
| Form state & validation | `react-hook-form` + `zod` | Typed schemas mirroring the mobile validators |
| Refresh-on-expiry | Response interceptor → `POST /sessions/refresh-token`, queue in-flight requests | Silent renewal, exactly like mobile/dashboard |

## Account states (mirrors mobile)

The module models three states, derived from the user object returned by the
backend (`isVerified`, `isActive`) — see
[10-domain-entities-and-mappers.md](10-domain-entities-and-mappers.md):

- **guest** — no valid session. Can read public content; gated actions open the
  login modal.
- **unverified** — logged in but email not verified. Can browse; verification is
  prompted; some actions are blocked by the backend.
- **authenticated** — logged in and verified. Full visitor access.

## What ships in this module

- A new `src/modules/auth` vertical slice (domain → application → infrastructure
  → presentation).
- A platform-level `session` concern (refresh, sessions list, revoke) — mirrors
  mobile's `platform/session`.
- App-wide providers: `QueryClientProvider` + `AuthProvider`.
- API-client interceptors for silent refresh and session-expiry handling.
- A modal auth experience with all forms.
- An `auth` i18n namespace (en/fr).

## Reading order

1. [02-architecture.md](02-architecture.md) — layering & folder structure
2. [03-backend-api-reference.md](03-backend-api-reference.md) — the API contract
3. [04-token-and-cookie-model.md](04-token-and-cookie-model.md) — cookies & persistence
4. [05-state-management.md](05-state-management.md) — TanStack Query + Context
5. [06-api-client-interceptors.md](06-api-client-interceptors.md) — refresh & errors
6. [07-auth-flows.md](07-auth-flows.md) — every flow, step by step
7. [08-modal-forms-ux.md](08-modal-forms-ux.md) — the modal experience
8. Then the remaining reference docs (09–18).
