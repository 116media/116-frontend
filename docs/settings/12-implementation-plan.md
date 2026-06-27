# Implementation Plan

Phased so each phase is independently shippable and reviewable. Phases are ordered
by dependency; within a phase, tasks can be parallelized.

## Phase 0 — Foundations (icons, i18n, module skeletons)

- [ ] Add the new icons to `components/ui/Icon/lucide.ts` (see [11-components.md](11-components.md)).
- [ ] Create the `settings` i18n namespace (en/fr files) and register it in
      `shared/presentation/i18n/resources.ts`; add French words to cspell.
- [ ] Scaffold the `sessions` module folders (domain/application/infrastructure/
      presentation) per [02-architecture.md](02-architecture.md).
- [ ] Move `ISession` + `IRevokeSessionResponse` from `auth/domain/entities` to
      `sessions/domain/entities`; re-point `auth` imports.

**DoD:** app compiles (`tsc`), lint clean, new icons/keys resolve.

## Phase 1 — Data layer

- [ ] `sessions` enums (`EBrowser/EDevice/EPlatform/EClient`) + `SessionsMapper`.
- [ ] `sessions.repository.port.ts` + impl (`getSessions`, `revokeSession`).
- [ ] `GetSessionsUseCase`, `RevokeSessionUseCase`.
- [ ] Extend `settings` repo/use cases: add `UpdateAvatarUseCase` (+ `updateAvatar`
      on the port/impl); confirm `getOwnProfile`/`updateOwnProfile`/`changePassword`
      call the **public** client methods.
- [ ] `registerSessionsDependencies` + extend `registerSettingsDependencies`; wire
      both into `service.locator.ts` and the server cradle; extend `Cradle`.
- [ ] Hooks: `useProfile`, `useUpdateProfile` (exists), `useUpdateAvatar`,
      `useChangePassword`, `useSessions`, `useRevokeSession`, `useLogoutAll`.
- [ ] Query keys (`settingsKeys`, `sessionsKeys`); align `useProfile` with `authKeys.me`.

**DoD:** each hook fetches/mutates against a running backend; `Result` folds into the
error channel; unit-level sanity via a throwaway page or story.

## Phase 2 — Account control dropdown

- [ ] Extend `UserAccountControl`: avatar + username + email header (no role),
      "Account" group with *My profile* + *Change password*, destructive *Sign out*
      with the existing `ConfirmDialog`. `modal={false}` on the dropdown.
- [ ] Route the two menu items to `/settings/profile` and `/settings/security`.

**DoD:** dropdown matches [03-account-control.md](03-account-control.md); navigation
works; sign-out still confirms + toasts.

## Phase 3 — Settings shell & routing

- [ ] `(authenticated)/layout.tsx` guard (server redirect + client `useRequireAuth`).
- [ ] `settings/layout.tsx` → `SettingsShell` + `SettingsSidebar`.
- [ ] `settings/page.tsx` → redirect to `/settings/profile`.
- [ ] `SettingsPageHeader`, `SettingsCard`, `DetailField` primitives.

**DoD:** `/settings` redirects; the three tabs render with sidebar + header; guests
are bounced.

## Phase 4 — Profile tab

- [ ] `ProfileSection` (photo card + account-info card with `DetailField`s).
- [ ] `ProfileEditModal` (Dialog + FloatingField + `profile.schema.ts` + RHF/zod).
- [ ] `CountrySelect` dependency (port a light picker).
- [ ] Avatar upload wired to `useUpdateAvatar` (or ship read-only if the endpoint
      isn't ready — flagged in [05-profile-section.md](05-profile-section.md)).

**DoD:** matches the dashboard profile UI; edit persists via `PATCH /me/profile`;
errors + toasts behave; loading skeletons present.

## Phase 5 — Security tab

- [ ] `ChangePasswordForm` (3 fields, zod, `useChangePassword`).
- [ ] `SessionsList` + `SessionCard` (device icons, current/expired states,
      relative time), prefetched in `security/page.tsx`.
- [ ] Revoke flow with `ConfirmDialog` + `useRevokeSession` + list invalidation.

**DoD:** matches the dashboard security UI (minus roles); password change + revoke
work end-to-end; current session's revoke is disabled.

## Phase 6 — Account tab

- [ ] `AccountSection` — sign-out card (`useLogout`) + sign-out-all card
      (`useLogoutAll`) with a stronger destructive confirm.
- [ ] Shared `resetToGuest()` teardown used by both `useLogout` and `useLogoutAll`.

**DoD:** both actions confirm, show `loading`, tear down auth state, and redirect
home.

## Phase 7 — Polish & verification

- [ ] Light/dark pass on every new surface (theme tokens only).
- [ ] Mobile layout for the sidebar + cards.
- [ ] Empty/loading/error states audited across tabs.
- [ ] `tsc --noEmit` + `biome` clean; manual pass of the parity checklist below.

## Parity checklist (vs. dashboard)

| Item | Dashboard | Frontend target |
|------|-----------|-----------------|
| Dropdown header | avatar + name + email + **role** | avatar + name + email (**no role**) |
| Dropdown menu | Profile · Notifications · Password · Logout | My profile · Change password · Sign out |
| Tabs | Profile · Security · Notifications · Account | Profile · Security · Account |
| Profile | photo + account info + edit modal | ✅ same |
| Security | password + **roles** + sessions | password + sessions (**no roles**) |
| Account | sign out + sign out all | ✅ same |
| Session card | device·browser·platform, IP, relative time, current, revoke | ✅ same |
| Confirm on logout | none (immediate) | **ConfirmDialog** (kept) |

## Open questions

1. **Avatar upload** — is `PATCH /public/me/avatar` (dedicated single-file endpoint)
   available in the generated client? If not, Card 1 ships read-only first.
2. **Email change** — the public update request accepts `email`, but the dashboard
   keeps it read-only. Confirm whether visitors may change their email here.
3. **Country picker** — port the dashboard's `CountrySelect`, or is there an existing
   frontend list util to build on?
4. **Session labels** — translate device/browser/platform enums, or render raw?
5. **Current-session revoke** — disable in the list (recommended) vs. treat as
   sign-out.
