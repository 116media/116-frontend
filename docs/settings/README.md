# Settings & Sessions

The account, profile, security, and session-management surface of the public web
app — the frontend counterpart of the dashboard's Settings module, rebuilt on the
frontend stack (Next.js App Router, TanStack Query, Radix + shadcn primitives,
clean architecture) instead of the dashboard's Ant Design + Redux stack.

Read the guides in order:

| #  | Doc | What it covers |
|----|-----|----------------|
| 01 | [01-overview.md](01-overview.md) | Goals, scope, dashboard parity, and the deliberate deltas |
| 02 | [02-architecture.md](02-architecture.md) | Module layout across `settings` / `sessions` / `auth`, clean-architecture layers |
| 03 | [03-account-control.md](03-account-control.md) | The header account dropdown (avatar/username/email + menu) |
| 04 | [04-routing-and-layout.md](04-routing-and-layout.md) | App-Router routes, the authenticated guard, the settings shell + sidebar |
| 05 | [05-profile-section.md](05-profile-section.md) | Profile tab — avatar, account info, edit modal |
| 06 | [06-security-section.md](06-security-section.md) | Security tab — change password + active sessions |
| 07 | [07-account-section.md](07-account-section.md) | Account tab — sign out + sign out from all devices |
| 08 | [08-api-endpoints.md](08-api-endpoints.md) | Endpoint ↔ use case ↔ repository ↔ hook mapping |
| 09 | [09-data-layer.md](09-data-layer.md) | Domain entities, use cases, repositories, mappers, query keys |
| 10 | [10-i18n.md](10-i18n.md) | Required `settings` locale keys (en/fr) |
| 11 | [11-components.md](11-components.md) | New UI components + icons to add |
| 12 | [12-implementation-plan.md](12-implementation-plan.md) | Phased tasks, dependencies, definition of done |

## TL;DR

- Three route tabs under `/settings`: **Profile**, **Security**, **Account** —
  guarded so only authenticated users reach them.
- The header **account dropdown** shows avatar + username + email (**no role**)
  and a single **Account** group: *My profile*, *Change password*, *Sign out*.
- **Profile** and **Security** mirror the dashboard 1:1 in UI/UX; **Account**
  holds the two logout actions (this device / all devices).
- Data flows through the existing clean-architecture stack: `Result<T>` use cases
  → repository (public API endpoints) → TanStack Query hooks folding `Result`
  into the mutation/query error channel.
