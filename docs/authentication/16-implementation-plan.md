# Implementation Plan

Build order, dependencies, and a parity checklist against mobile. Each phase is
independently verifiable. **No code is written until this design is approved.**

---

## Dependencies to add

```bash
yarn add @tanstack/react-query react-hook-form zod @hookform/resolvers \
  @radix-ui/react-dialog @radix-ui/react-toast
```

Env: ensure `NEXT_PUBLIC_CLIENT_APP=WebApp` (so the backend uses cookie
delivery — see [04-token-and-cookie-model.md](04-token-and-cookie-model.md)).

---

## Phases

### Phase 0 — Foundations
- Add deps above.
- `QueryProvider` (QueryClient + provider) and mount in `app/layout.tsx`.
- `Dialog` UI primitive (`@radix-ui/react-dialog`, theme tokens).
- Form primitives: `Input`, `Label`, `FormField`, `PasswordInput`, `OtpInput`.
- `Alert` primitive (renders a `Failure` at the top of forms; ≈ dashboard
  `ErrorAlert`).
- shadcn/ui `Toast` + `Toaster` provider + `useToast` (`@radix-ui/react-toast`),
  mounted in `app/layout.tsx`.
- Shared validation: `validators.ts` + `zod.errormap.ts`
  (`z.setErrorMap` at bootstrap).

### Phase 1 — Domain & data layer
- Entities + value objects ([10](10-domain-entities-and-mappers.md)).
- `auth.mapper.ts`.
- `IAuthRepositoryPort` + `AuthRepositoryImpl`; `ISessionRepositoryPort` +
  `SessionRepositoryImpl` (bare refresh client).
- Use cases ([11](11-repositories-and-usecases.md)).
- DI: `registerAuthDependencies` + `registerSessionDependencies`; extend
  `Cradle` and the server cradle.

### Phase 2 — Interceptors
- Silent refresh on `401 AccessTokenExpiryException` (single-flight + queue).
- `auth:session-expired` on refresh-token expiry.
- Confirm error normalization covers the auth `title`s
  ([06](06-api-client-interceptors.md), [15](15-error-handling.md)).

### Phase 3 — Auth state
- `AuthProvider` + `useAuth` (the `me` query, derived `status`,
  BroadcastChannel sync, session-expired listener).
- SSR prefetch + `HydrationBoundary` in `app/(public)/layout.tsx`.
- Mutation hooks (`useLogin`, `useSignup`, …) ([05](05-state-management.md)).

### Phase 4 — Modal & forms
- `AuthModalProvider` + `AuthModal` (view machine) ([08](08-modal-forms-ux.md)).
- `LoginForm`, `SignupForm`, `VerifyOtpForm`, `ForgotPasswordForm`,
  `ResetPasswordForm` with zod schemas ([09](09-forms-and-validation.md)).
- Header "Log in / Sign up" + user menu (avatar, logout).
- `?auth=` deep-link handling.

### Phase 5 — Gating & logout
- `useRequireAuth` + resume-after-login; wire gated actions (auth **and**
  verification, like the backend) ([13](13-authorization-and-guards.md)).
- User menu: "Sign out" (this device) + "Sign out everywhere".
- The session **refresh/revoke use cases** ship here (data layer); their **UI**
  is deferred to the Settings page (below).

### Phase 6 — i18n & polish
- `auth` namespace en/fr ([14](14-i18n.md)); register in resources.
- shadcn toasts, loading/disabled states, reduced-motion, focus management.

---

## Out of scope now — a later phase

Per the decisions ([17-open-questions.md](17-open-questions.md)), these ship in a
**later phase**, modeled exactly on the dashboard:

- **Settings page** with URL-driven tabs **Profile · Security · Notifications ·
  Account** (`/settings/:tab` + sidebar).
- **Sessions list / revoke UI** (Security tab).
- **Profile editing** + change-password (Profile/Security tabs).
- **Social login** (Google / Facebook).

---

## Parity checklist vs. mobile

| Capability | Mobile | Web (this plan) |
|---|---|---|
| Sign in (email/username + password) | ✅ | ✅ |
| Sign up | ✅ | ✅ |
| Verify OTP (6-digit, purpose) | ✅ | ✅ |
| Resend OTP (60s cooldown) | ✅ | ✅ |
| Forgot password | ✅ | ✅ |
| Reset password (code + confirm) | ✅ | ✅ |
| Change password | ✅ | ✅ |
| Sign out | ✅ | ✅ |
| Sign out all devices | ✅ | ✅ |
| Sessions list + revoke | ✅ | ✅ |
| Silent refresh on 401 | ✅ | ✅ (cookie) |
| Session-expiry handling | ✅ | ✅ |
| Account states guest/unverified/authenticated | ✅ | ✅ |
| Validation rules | ✅ | ✅ (zod mirror) |
| Social login (Google/Facebook) | ✅ | ⏳ phase 2 |
| Token storage | secure storage | httpOnly cookies |
| State container | BLoC | TanStack Query + Context |
| Forms | full screens | modals |

---

## Definition of done (phase 1 of the feature)

- A guest can sign up, verify, log in, recover a password, and log out — all via
  modals.
- The user persists across navigation and hard reload via the cookie + `me`
  query (no token in JS).
- Gated actions open the login modal and resume after success.
- `useAuth()` is the single app-wide source of user/status.
- en/fr complete; tsc + biome clean.
