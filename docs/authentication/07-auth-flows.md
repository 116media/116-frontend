# Auth Flows (step by step)

Every flow mirrors the mobile app. On web they all happen inside the **auth
modal** (see [08-modal-forms-ux.md](08-modal-forms-ux.md)); the modal switches
*views* rather than navigating routes.

Legend: **F** = form view in the modal, **API** = backend call, **Q** = TanStack
cache effect.

---

## 1. Sign up → verify email

```text
F: Signup (email, userName, password)
  → API POST /auth/signup
      ← { user, verificationRequired: true }   (cookies set: user is logged in but unverified)
  → Q: set ['auth','me'] = user                (status → "unverified")
  → backend emails an EmailVerification OTP
F: Verify OTP (code)  [email + purpose carried in modal state]
  → API POST /auth/verify-otp { email, code, purpose:"EmailVerification" }
      ← { isSuccess: true }
  → Q: invalidate ['auth','me']                (status → "authenticated")
  → modal closes; success toast
```

Resend: `POST /auth/resend-otp { email, purpose }`, gated by a **60-second
cooldown** (mobile parity).

---

## 2. Login

```text
F: Login (credentials = email|username, password)
  → API POST /auth/login
      ← { user }                               (cookies set)
  → Q: set ['auth','me'] = user
  → status → "authenticated" (or "unverified" if !isVerified)
  → modal closes
```

Failure branches (see [15-error-handling.md](15-error-handling.md)):

- `401 AuthenticationException` → inline "invalid credentials", clear password.
- `403 AccountNotVerifiedException` → switch modal to **Verify OTP** (resend a
  code first), because the account exists but is unverified.
- `403/423 AccountInactiveException` → blocking message; cannot proceed.

---

## 3. Forgot → reset password

```text
F: Forgot Password (email)
  → API POST /auth/forgot-password { email }
      ← { isSuccess: true, email }             (always success — no enumeration)
  → backend emails an AccountRecovery OTP
F: Reset Password (code, newPassword, confirmPassword)
  → API POST /auth/reset-password { email, code, newPassword }
      ← { isSuccess: true }
  → modal switches to Login view; "password updated" toast
```

Optional pre-check (mobile does this): call `verify-otp` with
`purpose:"AccountRecovery"` when the user finishes typing the code, to validate
it before asking for the new password.

---

## 4. Change password (authenticated)

```text
F: Change Password (oldPassword, newPassword, confirm)   [from profile, not the auth modal]
  → API PATCH /auth/change-password { oldPassword, newPassword }
      ← { isSuccess: true }
  → toast; no state change (session stays valid)
```

---

## 5. Logout

```text
action: Sign out
  → API POST /auth/sign-out                    (refresh cookie used; backend revokes session + expires cookies)
  → Q: queryClient.clear()                     (status → "guest")
  → BroadcastChannel('auth') ping → other tabs refetch me
```

Sign out **all devices**: `POST /auth/sign-out-all` → same client effect, but
every session for the user is revoked server-side.

---

## 6. Silent token refresh (no UI)

```text
any authed request → 401 AccessTokenExpiryException
  → POST /sessions/refresh-token (queued, single-flight, bare client)
      success → cookies rotated → original request retried → user never notices
      failure → dispatch auth:session-expired → status "guest" (+ optional login modal)
```

Detailed in [06-api-client-interceptors.md](06-api-client-interceptors.md).

---

## 7. App start / reload rehydration

```text
mount AuthProvider
  → useQuery ['auth','me'] → GET /me/profile (cookie auth)
      200 → user → "authenticated" / "unverified"
      401 → (refresh tried; if it fails) → "guest"
  (SSR: the server already prefetched me via the cookie-forwarding client and
   hydrated the cache → no guest flash)
```

---

## 8. Social login (Google / Facebook) — phase 2

Mobile uses native SDKs then posts to `POST /auth/social-login
{ email, userName, avatarUrl, provider }`. On web this becomes an OAuth
popup/redirect that ends in the same backend call and the same web response
(`{ user }` + cookies). **Deferred**; the entities already carry `authProvider`
so adding it later is additive. Tracked in
[17-open-questions.md](17-open-questions.md).

---

## Flow → endpoint → use case map

| Flow | Endpoint | Use case | Hook |
|---|---|---|---|
| Sign up | POST `/auth/signup` | `SignupUseCase` | `useSignup` |
| Verify OTP | POST `/auth/verify-otp` | `VerifyOtpUseCase` | `useVerifyOtp` |
| Resend OTP | POST `/auth/resend-otp` | `ResendOtpUseCase` | `useResendOtp` |
| Login | POST `/auth/login` | `LoginUseCase` | `useLogin` |
| Forgot password | POST `/auth/forgot-password` | `ForgotPasswordUseCase` | `useForgotPassword` |
| Reset password | POST `/auth/reset-password` | `ResetPasswordUseCase` | `useResetPassword` |
| Change password | PATCH `/auth/change-password` | `ChangePasswordUseCase` | `useChangePassword` |
| Sign out | POST `/auth/sign-out` | `SignOutUseCase` | `useLogout` |
| Sign out all | POST `/auth/sign-out-all` | `SignOutAllUseCase` | `useLogout` |
| Refresh | POST `/sessions/refresh-token` | `RefreshTokenUseCase` | interceptor only |
| Get profile | GET `/me/profile` | `GetOwnProfileUseCase` | `useMeQuery` |
| Update profile | PATCH `/me/profile` | `UpdateOwnProfileUseCase` | `useUpdateProfile` |
| Sessions list | GET `/me/sessions` | `GetOwnSessionsUseCase` | `useSessions` |
| Revoke session | POST `/me/sessions/revoke/{id}` | `RevokeSessionUseCase` | `useRevokeSession` |
