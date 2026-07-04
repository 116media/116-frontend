# Routing & Layout

The dashboard serves settings at `/settings/:tab` (profile · security · notification
· account) behind a sidebar. The frontend reproduces the same shell with the App
Router, minus the notification tab, and adds an authenticated guard (public
visitors must be logged in to reach `/settings`).

## Route tree

```
app/
└── (authenticated)/
    ├── layout.tsx                    # auth guard — redirect/opens login if guest
    └── settings/
        ├── layout.tsx               # SettingsShell: sidebar + <content>
        ├── page.tsx                 # redirect → /settings/profile
        ├── profile/page.tsx         # ProfileSection
        ├── security/page.tsx        # ChangePasswordForm + SessionsList
        └── account/page.tsx         # AccountSection (the two logout cards)
```

- `(authenticated)` is a **route group** (parentheses → not in the URL), the
  mirror of the existing `(public)` group.
- Each tab is its own segment/`page.tsx` (cleaner in the App Router than a single
  `[tab]` param), so `/settings/security` is a real, linkable, refresh-safe URL —
  matching the dashboard's deep links.

## The authenticated guard — `(authenticated)/layout.tsx`

Settings requires a signed-in user. Two layers:

1. **Server (preferred):** in the layout (a Server Component), read the hydrated
   `me` via the server DI scope (`createServerCradle().getProfileUseCase`). If the
   result is a guest/failure, `redirect("/")` (Next.js `redirect`) so unauthenticated
   users never see the shell or trigger client fetches.
2. **Client fallback:** a small client boundary using the existing `useRequireAuth`
   hook, which opens the auth modal and bounces home if the user logs out while on
   the page.

> Keep the guard in `(authenticated)/layout.tsx`, not in each page, so every future
> authenticated route inherits it.

## The settings shell — `settings/layout.tsx`

Holds the sidebar and renders the active tab as `{children}`:

```
<div className="mx-auto flex w-full max-w-5xl gap-6 py-8">
  <SettingsSidebar />           {/* sticky, ~240px, hidden→collapsible on mobile */}
  <div className="min-w-0 flex-1">{children}</div>
</div>
```

### `SettingsSidebar`

Vertical nav; the frontend equivalent of the dashboard's Ant `Menu`. Each item is a
`<Link>` styled as an active/inactive row (`usePathname()` decides active).

| Order | Key | Label (`settings.nav.*`) | Icon | Route |
|-------|-----|--------------------------|------|-------|
| 1 | profile | `profile` → "Profile" / "Profil" | `UserRoundIcon` | `/settings/profile` |
| 2 | security | `security` → "Security" / "Sécurité" | `LockIcon` | `/settings/security` |
| 3 | account | `account` → "Account" / "Compte" | `SettingsIcon` | `/settings/account` |

Styling: rounded rows, `hover:bg-accent`, active row `bg-accent text-accent-foreground`
(theme tokens only). On mobile (`max-md`) collapse into a horizontal scroll strip or
a top `Select`/segmented control — a UX call for implementation, but keep all three
reachable.

## Per-tab header — `SettingsPageHeader`

Each tab opens with a header row (dashboard `PageHeader` analogue):

```
<SettingsPageHeader
  icon={<UserRoundIcon />}
  title={t("settings.profile.title")}
  subtitle={t("settings.profile.subtitle")}
/>
```

| Tab | Icon | Title key | Subtitle key |
|-----|------|-----------|--------------|
| Profile | `UserRoundIcon` | `settings.profile.title` | `settings.profile.subtitle` |
| Security | `LockIcon` | `settings.security.title` | `settings.security.subtitle` |
| Account | `SettingsIcon` | `settings.account.title` | `settings.account.subtitle` |

## Data loading per tab

- **Profile / Security** need the current user; it is already hydrated at the root
  (`me` query). `useProfile()` reads it; the Security tab additionally calls
  `useSessions()`.
- Prefer prefetching `sessions` in `security/page.tsx` (Server Component) via the
  server DI scope + `HydrationBoundary`, same pattern as navigation prefetch, so the
  list is present on first paint.

## Metadata

Give each page a title via the App Router `metadata` export
(`export const metadata = { title: "Settings · Profile" }`), localized where the
project's metadata strategy allows.
