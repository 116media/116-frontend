# Components & Icons

What to build and what to reuse. Prefer existing shared primitives; only the
settings-specific composites below are new.

## Reused shared primitives

| Primitive | Path | Used by |
|-----------|------|---------|
| `Button` (with `loading`) | `components/ui/Button` | every action/submit |
| `FloatingField` | `components/ui/FloatingField` | profile edit + password fields |
| `Dialog` (+ parts) | `components/ui/Dialog` | profile edit modal |
| `ConfirmDialog` | `components/ui/ConfirmDialog` | revoke + sign-out confirmations |
| `Card` (+ Header/Content) | `components/ui/Card` | section cards |
| `Avatar` / `UserAvatar` | `components/ui/Avatar`, `common/UserAvatar` | dropdown + profile photo |
| `DropdownMenu` (+ parts) | `components/ui/DropdownMenu` | account control |
| `Badge` / `Tag` | `components/ui/Badge`, `Tag` | session "current"/"expired", counts |
| `Alert` | `components/ui/Alert` | form-level backend errors |
| `RelativeDate` | `components/ui/RelativeDate` | session `createdAt` |
| `Toaster` / `showNotification` | `components/ui/Toaster`, `utils/notification` | success/error toasts |

## New components

Settings-specific, under `modules/settings/presentation/components` (or `sessions`):

| Component | Module | Responsibility |
|-----------|--------|----------------|
| `SettingsShell` | settings | Two-column layout: `SettingsSidebar` + content slot (used by `settings/layout.tsx`) |
| `SettingsSidebar` | settings | Vertical nav (Profile/Security/Account) with active state from `usePathname()` |
| `SettingsPageHeader` | settings | Icon + title + subtitle row atop each tab |
| `SettingsCard` | settings | Titled/subtitled surface with optional header `extra` and `onEdit` action |
| `DetailField` | settings | Labeled read-only value with a leading icon + empty `—` fallback |
| `ProfileSection` | settings | Composes the photo card + account-info card |
| `ProfileEditModal` | settings | Edit-profile form in a `Dialog` |
| `ChangePasswordForm` | settings | Three-field password form |
| `AccountSection` | settings | The two sign-out cards |
| `SessionsList` | sessions | Fetches + renders `SessionCard`s, loading/empty states |
| `SessionCard` | sessions | One session row: device icon, meta, revoke/expired |
| `CountrySelect` *(dependency)* | shared/settings | Country picker for the edit modal — **does not exist yet**; port a light version |

These are the frontend analogues of the dashboard's `SettingsSidebar`, `PageHeader`,
`SettingsCard`, `DetailField`, `ProfileContainer`, `AccountInfoModal`,
`ChangePasswordForm`, `AccountContainer`, and `SessionCard`.

## Icons to add to the Icon barrel

The settings surface needs icons not yet re-exported in
`components/ui/Icon/lucide.ts`. Add these (lucide → `<Name>Icon` alias), keeping the
file alphabetical:

| Purpose | Lucide | Barrel alias |
|---------|--------|--------------|
| Password / security | `Lock` | `LockIcon` |
| Account tab | `Settings` | `SettingsIcon` |
| Avatar upload | `Camera` | `CameraIcon` |
| Email field | `Mail` | `MailIcon` |
| Phone field / mobile device | `Smartphone` | `SmartphoneIcon` |
| Country field | `MapPin` | `MapPinIcon` |
| Sign out | `LogOut` | `LogOutIcon` |
| Edit action | `SquarePen` | `EditIcon` |
| Desktop device | `Monitor` | `MonitorIcon` |
| Tablet device | `Tablet` | `TabletIcon` |
| Car device | `Car` | `CarIcon` |
| IoT device | `Cpu` | `CpuIcon` |
| Unknown device | `CircleHelp` | `HelpCircleIcon` |

Already present and reused: `UserRoundIcon`, `AlertCircleIcon`, `ClockIcon`,
`SpinnerIcon`. (Confirm exact lucide names against the installed version before
adding — see the icon-barrel seam in `components/ui/Icon/lucide.ts`.)

## Styling rules

- Theme tokens only (`bg-card`, `text-muted-foreground`, `border`, `bg-accent`,
  `text-destructive`, …) — no hardcoded colors, so light/dark are automatic.
- Match the dashboard's spatial rhythm: cards with `p-4`/`p-6`, `gap-3`/`gap-4`
  rows, `size-10` icon boxes (`bg-muted rounded-md`), `rounded-lg` cards.
- Reuse the app's `loading` button spinner for every async action.
