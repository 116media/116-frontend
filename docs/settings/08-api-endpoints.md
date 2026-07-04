# API Endpoints

All operations hit the **public** Identity API (`/api/v1/public/...`) — the frontend
is the visitor-facing app, so it uses the `public*` client methods, not the
dashboard's `admin*` ones. Auth is via the access-token cookie/header already handled
by the shared client; the refresh token for sign-out flows travels in the HttpOnly
cookie.

## Endpoint ↔ layer mapping

| Operation | Method & path | Client method | Repository method | Use case | Hook |
|-----------|---------------|---------------|-------------------|----------|------|
| Get own profile | `GET /public/me/profile` | `publicGetOwnProfile` | `settings.getOwnProfile()` | `GetProfileUseCase` | `useProfile` |
| Update own profile | `PATCH /public/me/profile` | `publicUpdateOwnProfile` | `settings.updateOwnProfile(data)` | `UpdateAccountUseCase` | `useUpdateProfile` |
| Update avatar | `PATCH /public/me/avatar` | `publicUpdateAvatar` | `settings.updateAvatar(file)` | `UpdateAvatarUseCase` | `useUpdateAvatar` |
| Change password | `PATCH /public/auth/change-password` | `publicChangePassword` | `settings.changePassword(data)` | `ChangePasswordUseCase` | `useChangePassword` |
| Get own roles *(not in UI)* | `GET /public/me/roles` | `publicGetOwnRoles` | `settings.getOwnRoles()` | `GetRolesUseCase` | — |
| List sessions | `GET /public/me/sessions?isActive=` | `publicGetOwnSessions` | `sessions.getSessions()` | `GetSessionsUseCase` | `useSessions` |
| Revoke a session | `POST /public/me/sessions/revoke/{id}` | `publicRevokeSession` | `sessions.revokeSession(id)` | `RevokeSessionUseCase` | `useRevokeSession` |
| Sign out (this device) | `POST /public/auth/sign-out` | `publicSignOut` | `auth.signOut()` | `SignOutUseCase` | `useLogout` |
| Sign out all devices | `POST /public/auth/sign-out-all` | `publicSignOutFromAllDevices` | `auth.signOutAll()` | `SignOutAllUseCase` | `useLogoutAll` |

> Verify the exact generated method names against
> `src/shared/infrastructure/api/generated/116.api.ts` — the `public*` prefixes
> above follow the existing `publicLogin` convention but should be confirmed.

## Payloads

### `PATCH /public/me/profile` — request

```jsonc
{
  "userName": "string?",
  "countryName": "string?",
  "partialPhoneNumber": "string?",
  "countryIsoCode": "string?",
  "countryDialCode": "string?"
  // NB: the public request also accepts "email", but the UI keeps email
  // display-only (dashboard parity) — do not send it unless email-change is scoped in.
}
```

Response: `{ user: UserResponseDto }` (same shape as GET profile).

### `PATCH /public/auth/change-password` — request

```jsonc
{ "oldPassword": "string", "newPassword": "string" }
```

Response: `{ isSuccess: boolean }`.

### `GET /public/me/sessions` — response

```jsonc
{
  "sessions": [
    {
      "id": "guid",
      "ipAddress": "string?",
      "userAgent": "string?",
      "browser": "Chrome | Firefox | Safari | Edge | Opera | IE | Other",
      "device": "Desktop | Mobile | Tablet | Watch | Tv | Console | Car | IoT | Unknown",
      "platform": "Windows | macOS | iOS | Android | Linux | Other",
      "client": "WebApp | MobileApp | Dashboard | CLI | Unknown",
      "expiresAt": "datetime",
      "isActive": true,
      "isCurrent": true,
      "createdAt": "datetime?"
    }
  ]
}
```

`isActive` = not revoked and not expired. `isCurrent` = the session behind this
request. The frontend never sees `refreshTokenHash`, `userId`, `deviceId`,
`isRevoked`, or `revokedAt`.

### `POST /public/me/sessions/revoke/{id}`

No body (id in the path). Response: `{ isSuccess: boolean }`.

### `POST /public/auth/sign-out` — request

```jsonc
{ "refreshToken": "string?" }  // web: omit — read from HttpOnly cookie; mobile: in body
```

Web clients send `{}`; the backend reads the refresh token from the cookie and
clears the token cookies in the response. Response: `{ isSuccess: boolean }`.

### `POST /public/auth/sign-out-all`

No body. Revokes **every** session for the user and clears token cookies. Response:
`{ isSuccess: boolean }`.

## Profile response (`UserResponseDto`) — fields the UI uses

`id`, `email`, `userName`, `avatar { storageUrl }`, `countryName`, `countryIsoCode`,
`countryDialCode`, `partialPhoneNumber`, `fullPhoneNumber`, `isVerified`, `isActive`,
`authProvider`. (`roles` / `permissions` are present but **not** displayed.)

## Rate-limit policies (informational)

`UserProfile` (profile/roles), `PasswordManagement` (change password),
`SessionManagement` (sessions, revoke, sign-out, sign-out-all). Surface a friendly
localized message if a `429` with `Retry-After` comes back — the shared client
already parses `retryAfter` into the `ServerFailure`.
