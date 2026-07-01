# Backend API Reference (Public Auth & Session)

The contract the web frontend consumes. All routes are under
`/api/v1/public`. The generated client (`116.api.ts`) already exposes typed
methods for these; regenerate with `yarn api:generate` if anything below is
missing from the client.

> **Token delivery is client-aware.** The backend inspects the `Client-App`
> header. For `WebApp` / `Dashboard` it sets **httpOnly cookies** and returns
> only the `user` in the body. For mobile it returns tokens in the body. The web
> frontend therefore always uses the **web response shapes** (user-only). See
> [04-token-and-cookie-model.md](04-token-and-cookie-model.md).

---

## Endpoints

### Authentication — `/api/v1/public/auth`

| Action | Method | Path | Auth | Rate policy |
|---|---|---|---|---|
| Login | POST | `/auth/login` | none | Authentication |
| Sign up | POST | `/auth/signup` | none | Authentication |
| Verify OTP | POST | `/auth/verify-otp` | none | Otp |
| Resend OTP | POST | `/auth/resend-otp` | none | Otp |
| Forgot password | POST | `/auth/forgot-password` | none | PasswordManagement |
| Reset password | POST | `/auth/reset-password` | none | PasswordManagement |
| Change password | PATCH | `/auth/change-password` | visitor | PasswordManagement |
| Sign out | POST | `/auth/sign-out` | visitor | SessionManagement |
| Sign out all devices | POST | `/auth/sign-out-all` | visitor | SessionManagement |
| Social login (phase 2) | POST | `/auth/social-login` | none | Authentication |

### Sessions — `/api/v1/public/sessions` and `/api/v1/public/me/sessions`

| Action | Method | Path | Auth |
|---|---|---|---|
| Refresh token | POST | `/sessions/refresh-token` | none (uses refresh cookie) |
| List my sessions | GET | `/me/sessions?isActive=` | visitor |
| Get session by id | GET | `/me/sessions/{id}` | visitor |
| Revoke session | POST | `/me/sessions/revoke/{id}` | visitor |

### Profile — `/api/v1/public/me`

| Action | Method | Path | Auth |
|---|---|---|---|
| Get own profile | GET | `/me/profile` | visitor |
| Update own profile | PATCH | `/me/profile` | visitor |

---

## Request bodies

```ts
// POST /auth/login
{ credentials: string;  // email OR username
  password: string }

// POST /auth/signup
{ email: string; userName: string; password: string }

// POST /auth/verify-otp
{ email: string; code: string;  // 6 digits
  purpose: "EmailVerification" | "AccountRecovery" }

// POST /auth/resend-otp
{ email: string; purpose: "EmailVerification" | "AccountRecovery" }

// POST /auth/forgot-password
{ email: string }

// POST /auth/reset-password
{ email: string; code: string; newPassword: string }

// PATCH /auth/change-password   (authenticated)
{ oldPassword: string; newPassword: string }

// POST /auth/sign-out
{ refreshToken?: string }        // web omits it; cookie is used

// POST /sessions/refresh-token
{ refreshToken?: string }        // web omits it; cookie is used

// PATCH /me/profile  (all optional)
{ email?; userName?; countryName?; partialPhoneNumber?;
  countryIsoCode?; countryDialCode? }
```

## Response bodies (WEB shapes — what the frontend receives)

```ts
// Login / Refresh (web): user only — tokens are in cookies
{ user: UserResponseDto }

// Sign up (web)
{ user: UserResponseDto; verificationRequired: boolean }

// Boolean-style operation responses
VerifyOtp        → { isSuccess: boolean }
ResendOtp        → { isSuccess: boolean }
ForgotPassword   → { isSuccess: boolean; email: string }
ResetPassword    → { isSuccess: boolean }
ChangePassword   → { isSuccess: boolean }
SignOut          → { isSuccess: boolean }
SignOutAll       → { isSuccess: boolean }
RevokeSession    → { isSuccess: boolean }

// Profile
GetOwnProfile    → { user: UserResponseDto }
UpdateOwnProfile → { user: UserResponseDto }

// Sessions
GetOwnSessions   → { sessions: SessionDto[] }
GetOwnSessionById→ { session: SessionDto }
```

## Core DTOs

```ts
UserResponseDto {
  id: string;
  email: string | null;
  userName: string;
  roles: RoleDto[];           // { id, name, description }
  permissions: PermissionDto[]; // { id, resource, action }
  authProvider: "Local" | "Google" | "Facebook" | ...;
  isVerified: boolean;
  isActive: boolean;
  avatar: FileDto | null;     // includes storageUrl + (now) colors
  countryName: string | null;
  countryIsoCode: string | null;
  countryDialCode: string | null;
  partialPhoneNumber: string | null;
  fullPhoneNumber: string | null;
  // auditable
  createdAt: string; updatedAt: string | null; ...
}

SessionDto {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  browser: EnumBrowser;       // Chrome | Safari | Firefox | Edge | Opera | Unknown…
  device: EnumDevice;         // Desktop | Tablet | Mobile | …
  platform: EnumPlatform;     // Windows | iOS | Android | macOS | Linux | …
  client: EnumClient;         // MobileApp | WebApp | Dashboard | Unknown
  expiresAt: string;
  isActive: boolean;          // not expired AND not revoked
  isCurrent: boolean;         // the requesting session
  createdAt: string; ...
}
```

---

## Error format (ProblemDetails)

```ts
{
  type: string;
  title: string;     // exception name, e.g. "AuthenticationException"
  status: number;
  detail: string;    // human message
  extensions?: { traceId?: string; timestamp?: string };
  // validation errors are surfaced per-field by the existing client interceptor
}
```

Auth-relevant exception titles (already mapped in
`src/shared/infrastructure/constants/api.ts` → `apiErrors`):

| Scenario | Status | `title` |
|---|---|---|
| Invalid credentials | 401 | `AuthenticationException` |
| Account not verified | 403 | `AccountNotVerifiedException` |
| Account inactive | 403 / 423 | `AccountInactiveException` |
| Access token expired | 401 | `AccessTokenExpiryException` |
| Refresh token expired | 401 / 403 | `RefreshTokenExpiryException` |
| Email already in use | 409 | `ConflictException` |
| OTP expired | 401 | `OtpExpirationException` |
| OTP attempts exceeded | 429 | `OtpAttemptsLimitException` |
| Rate limited | 429 | `RateLimitExceededException` (+ `Retry-After`) |
| Validation | 400 | `ValidationException` |

How each is handled on the client is in
[15-error-handling.md](15-error-handling.md).

## Verification & OTP

- Sign up sends an `EmailVerification` OTP and returns
  `verificationRequired: true`.
- `forgot-password` always returns `isSuccess: true` (no account enumeration);
  it emails an `AccountRecovery` OTP.
- Reset uses the `AccountRecovery` code directly in `reset-password`
  (a separate `verify-otp` call is optional pre-validation, as mobile does).
