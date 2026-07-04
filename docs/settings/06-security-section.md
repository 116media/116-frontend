# Security Section

`/settings/security` — the frontend rebuild of the dashboard's `SecurityContainer`,
scoped to **change password** + **active sessions**. The dashboard's *Roles &
Permissions* block is intentionally omitted (see [01-overview.md](01-overview.md)).

**Components:** `settings/.../ChangePasswordForm/`, `sessions/.../SessionsList/`,
`sessions/.../SessionCard/`. **Data:** `useChangePassword()`, `useSessions()`,
`useRevokeSession()`.

## Header

`SettingsPageHeader` — icon `LockIcon`, title `settings.security.title`
("Security"), subtitle `settings.security.subtitle` ("Manage your password and your
active sessions.").

## Block 1 — Change password

`SettingsCard` titled `settings.security.password.title` ("Change password"),
subtitle `settings.security.password.subtitle`. Responsive width (full on mobile,
~60% on lg per the dashboard).

Vertical form (`react-hook-form` + zod), three password fields using the shared
`FloatingField` (type `password`, built-in show/hide toggle):

| Field | Label key | Rules |
|-------|-----------|-------|
| Current password | `settings.security.password.current` | required |
| New password | `settings.security.password.new` | required, ≥ 6, ≥1 upper, ≥1 lower, ≥1 digit |
| Confirm password | `settings.security.password.confirm` | required, must equal new password |

- Schema `changepassword.schema.ts` (one already exists under
  `auth/presentation/validation` — reuse or move into `settings`). Match the
  dashboard regex: `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\s\S]{6,}$`.
- Submit → `useChangePassword().mutate({ oldPassword, newPassword })` →
  `PATCH /public/auth/change-password` (send only `oldPassword` + `newPassword`;
  `confirmPassword` is client-side only).
- Backend failure → top `<Alert error={error} />`. Success → reset the form + toast
  (`settings.notification.passwordChanged*`).
- Submit `Button` uses `loading={isPending}`.

## Block 2 — Active sessions

`SettingsCard` titled `settings.security.sessions.title` ("Active sessions"),
subtitle `settings.security.sessions.subtitle` ("Devices currently connected to your
account"), with a header `extra` count badge `settings.security.sessions.count`
(`{{count}} session(s)`) when sessions exist.

`useSessions()` → `GET /public/me/sessions` → list of `ISession`, one `SessionCard`
each (vertical stack, gap-4).

### `SessionCard`

```
Row (flex, items-center, gap-3, bordered, rounded, p-3)
├── Device icon box (size-10, bg-muted, rounded)   ← by ISession.device
├── Info (flex-1, min-w-0)
│   ├── "<device> · <browser> · <platform>"   + [current] badge if isCurrent
│   └── meta: "IP: <ipAddress ?? —>"   ·   ClockIcon <relative(createdAt)>
└── Action:
     isActive → Button (destructive, loading) "Revoke"
     else     → Tag "Expired"
```

- **Current session** (`isCurrent`): a `Badge`/`Tag`
  `settings.security.sessions.current` ("This device"). Its revoke button may be
  hidden or disabled — revoking the current session is effectively a sign-out; keep
  it disabled here and steer users to the Account tab.
- **Relative time**: use the shared `RelativeDate` (dayjs `fromNow()`) on
  `createdAt`.
- **Device icon** mapping (`ISession.device` → Icon barrel):

  | Device | Icon |
  |--------|------|
  | Desktop / Tv / Console | `MonitorIcon` |
  | Mobile | `SmartphoneIcon` |
  | Tablet | `TabletIcon` |
  | Watch | `ClockIcon` |
  | Car | `CarIcon` |
  | IoT | `CpuIcon` |
  | Unknown | `HelpCircleIcon` |

### Revoke flow

- Clicking **Revoke** opens a `ConfirmDialog` (destructive):
  title `settings.security.sessions.revokeTitle`, description
  `settings.security.sessions.revokeDescription` ("The device will be signed out
  immediately."), confirm `settings.security.sessions.revoke`.
- Confirm → `useRevokeSession().mutate(sessionId)` →
  `POST /public/me/sessions/revoke/{id}`.
- On success: invalidate `sessionsKeys.list` so the list refetches; toast
  `settings.notification.sessionRevoked*`. The card's button shows `loading` while
  in flight.
- On failure: toast the error (list unchanged).

### Loading & empty

- Loading: 2 `SessionCard` skeletons (icon circle + two text lines), dashboard-style.
- Empty: a short muted line `settings.security.sessions.empty` (rare — the current
  session always exists).
