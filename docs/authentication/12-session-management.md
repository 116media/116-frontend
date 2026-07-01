# Session Management (devices, refresh, revoke)

Beyond login/logout, the backend exposes per-device **sessions** the user can
review and revoke — the same capability mobile has. On web this surfaces as an
"Active sessions" / "Security" area (a modal or a profile sub-section).

---

## What a session is

Each login on a device creates a `SessionEntity` server-side, keyed by a device
id, holding a hashed refresh token and metadata (browser, device, platform,
client, ip, user-agent, `expiresAt`). The cookies on this browser correspond to
**one** such session. See `SessionDto` in
[03-backend-api-reference.md](03-backend-api-reference.md).

---

## Capabilities

| Capability | Endpoint | Use case / hook |
|---|---|---|
| List my sessions | `GET /me/sessions?isActive=` | `getOwnSessionsUseCase` / `useSessions` |
| Inspect one | `GET /me/sessions/{id}` | `getOwnSessionByIdUseCase` |
| Revoke one | `POST /me/sessions/revoke/{id}` | `revokeSessionUseCase` / `useRevokeSession` |
| Sign out (this device) | `POST /auth/sign-out` | `signOutUseCase` |
| Sign out all devices | `POST /auth/sign-out-all` | `signOutAllUseCase` |
| Silent refresh | `POST /sessions/refresh-token` | interceptor only |

---

## UI

A list of session cards, the current one badged "This device" (`isCurrent`):

```text
🖥  Chrome · macOS · WebApp            This device
    Kigali, RW · last active just now
    [ Active ]

📱  Safari · iOS · MobileApp
    197.x.x.x · expires in 21 days
    [ Active ]      [ Revoke ]

🖥  Edge · Windows · WebApp
    expired                            [ Active: no ]
```

- Render via `useSessions()` (TanStack query, key `['auth','sessions']`).
- **Revoke** calls `useRevokeSession(id)`; on success invalidate
  `['auth','sessions']`. Revoking the **current** session is effectively a
  logout → also `queryClient.clear()` and `status → guest`.
- **Sign out all** confirms, then `signOutAll` → clear cache → guest, and a
  `BroadcastChannel('auth')` ping logs out other tabs.

---

## Where it lives — the Settings page (later)

The sessions UI is part of a dedicated **Settings page**, implemented in a
**later phase**, modeled **exactly on the dashboard**: URL-driven tabs
**Profile · Security · Notifications · Account** (`/settings/:tab` with a
sidebar). The **sessions list + revoke live in the Security tab** (alongside
change-password), mirroring the dashboard's `SecurityContainer`.

What ships **now** vs **later**:

- **Now:** the session **refresh** use case (the interceptor needs it) and the
  `getOwnSessions` / `revokeSession` repository + use cases. These are data-layer
  only — no screen.
- **Later:** the Settings page and its Security tab that render the sessions list
  and revoke controls (this section's UI), plus profile editing and
  notifications.

So the session *capabilities* exist from day one; their *UI* arrives with the
Settings page.

---

## Refresh vs. revoke — don't confuse them

- **Refresh** is automatic and invisible (interceptor) — it renews the access
  cookie from the refresh cookie. It is *not* a user action.
- **Revoke** is a deliberate user action that kills a session server-side.
  Revoking another device does not affect this one; revoking this device logs
  you out here.

---

## Mobile parity notes

Mobile surfaces the same list and revoke behavior via its `platform/session`
slice. The web differs only in transport (cookies) and that the "current
session" is whichever browser holds the cookies. The `EnumClient` value lets the
UI label each row (`WebApp`, `MobileApp`, `Dashboard`).
