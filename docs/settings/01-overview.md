# Settings & Sessions — Overview

## Goal

Give an authenticated visitor a place to manage their account, exactly like the
dashboard's Settings module — same information architecture, same section order,
same interactions — but built on the frontend's own stack and design system so it
looks and behaves like the rest of the public app.

## Scope

Three tabs under a `/settings` shell, plus the header account dropdown that links
into them.

| Area | Contents | Dashboard parity |
|------|----------|------------------|
| **Account dropdown** | Avatar, username, email, and a menu: *My profile*, *Change password*, *Sign out* | Same shape, minus the role badge and the *Notifications* item |
| **Profile tab** | Avatar upload + read-only account-info card with an edit modal | 1:1 |
| **Security tab** | Change-password form + active-sessions list (revoke) | 1:1, minus the Roles & Permissions block |
| **Account tab** | *Sign out* (this device) + *Sign out from all devices* | 1:1 |

## Deliberate deltas from the dashboard

These are intentional, per product direction — not oversights:

1. **No role anywhere in this surface.** The dashboard shows a `RoleBadge` in the
   dropdown header and a full *Roles & Permissions* section under Security. Public
   visitors have no meaningful roles to display, so:
   - the account dropdown shows **avatar + username + email only**;
   - the Security tab is **change password + active sessions only** (no roles block).
   - The `GET /me/roles` endpoint still exists and is documented for completeness,
     but is **not** wired into the UI.
2. **No *Notifications* tab.** The dashboard has a `notification` tab (currently a
   "coming soon" placeholder). We omit it entirely until there is real content.
3. **Confirmation on sign-out.** The frontend already gates sign-out behind a
   `ConfirmDialog` (see the current `UserAccountControl`); we keep that, and add a
   stronger confirmation for *sign out from all devices*.

## What already exists (do not rebuild)

The frontend is not starting from zero — see [02-architecture.md](02-architecture.md)
for the full inventory. Highlights:

- `src/modules/settings/` already has `getProfile`, `updateAccount`, and
  `changePassword` use cases + repository + a `useUpdateProfile` hook.
- `src/modules/auth/` already has `signout.usecase.ts`, `signoutall.usecase.ts`,
  and the `ISession` / `IRevokeSessionResponse` domain entities.
- The current `UserAccountControl` already wires `useLogout` + `ConfirmDialog`.

The work is mostly **presentation** (pages, tabs, forms, cards, the richer
dropdown) plus a new **sessions** read/revoke slice.

## Non-goals

- Avatar cropping / image editing (upload replaces, as in the dashboard).
- Managing *other* users' accounts (this is self-service only — the `me` surface).
- Role/permission management (out of scope for the public app).

## Success criteria

- A signed-in user can open the dropdown, jump to any tab, edit their profile,
  change their password, see and revoke their active sessions, and sign out of one
  or all devices — all localized (en/fr) and theme-aware (light/dark).
- Every network action reports success/failure through the app's standard channels
  (top `Alert` + inline field errors + toast), never an unhandled throw.
- The module follows the same clean-architecture conventions as `auth`
  (see [09-data-layer.md](09-data-layer.md)).
