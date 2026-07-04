# Account Control — Header Dropdown

The avatar menu in the app header. Today it shows the username and a lone *Sign
out* item; this upgrades it to the dashboard's richer layout (avatar + username +
email + a grouped menu) while keeping the frontend's confirm-on-logout behavior.

**Component:** `src/shared/presentation/components/common/UserAccountControl/index.tsx`
(extend the existing one — do not fork).

## Guest vs. authenticated

Unchanged from today:

- **Guest** (`!user`): an outlined button `t("navigation.login")` that calls
  `openAuthModal("login")`.
- **Authenticated**: the avatar trigger + dropdown described below.

## Layout (authenticated)

```
DropdownMenu (align="end", min-w-64)
├── Header (not clickable)
│   ├── Avatar (size-10)            ← UserAvatar: image | initials + getAvatarColor
│   ├── <username> (font-medium, truncate)
│   └── <email>    (text-sm text-muted-foreground, truncate)
│                    ⟵ NO role badge (deliberate — see 01-overview)
├── DropdownMenuSeparator
├── DropdownMenuLabel  "Account"    ← group subtitle
├── DropdownMenuItem  [UserRoundIcon]  "My profile"       → /settings/profile
├── DropdownMenuItem  [LockIcon]       "Change password"  → /settings/security
├── DropdownMenuSeparator
└── DropdownMenuItem  [LogOutIcon]     "Sign out"  (text-destructive) → confirm
```

### Header

- Avatar uses the existing `UserAvatar` (`image={user.avatar?.storageUrl}`,
  `initials={getInitials(user.userName)}`, fallback color from
  `getAvatarColor(user.userName)`).
- Username: `user.userName`. Email: `user.email` (hide the line if null).
- **No role.** Do not render any role/permission chip here.

### Menu group — "Account"

A `DropdownMenuLabel` with the localized text `t("settings.account.menuGroup")`
("Account" / "Compte"), followed by exactly two navigation items:

| Icon | Label key | Route |
|------|-----------|-------|
| `UserRoundIcon` | `settings.menu.myProfile` | `/settings/profile` |
| `LockIcon` | `settings.menu.changePassword` | `/settings/security` |

Navigation uses the App Router (`useRouter().push(...)` or a `<Link>` wrapped item).
The dropdown must use `modal={false}` (the known Radix dropdown+dialog pointer-lock
race — see the auth work) so the confirm dialog opens cleanly.

### Sign out

A destructive `DropdownMenuItem` (`text-destructive`) that sets `confirmOpen=true`
rather than logging out immediately. The existing `ConfirmDialog` wiring stays:

```tsx
<ConfirmDialog
    open={confirmOpen}
    onOpenChange={setConfirmOpen}
    destructive
    loading={logout.isPending}
    title={t("auth.session.signOutConfirmTitle")}
    description={t("auth.session.signOutConfirmDescription")}
    cancelLabel={t("auth.common.cancel")}
    confirmLabel={t("auth.session.signOut")}
    onConfirm={() => logout.mutate({}, { onSuccess: () => setConfirmOpen(false) })}
/>
```

`useLogout` already re-seeds `me` as guest, broadcasts on the auth channel, and
toasts — no change needed there.

## Behavior notes

- **Active-item highlight** is not required (the dropdown is transient), but the
  target tab should reflect the current route once open.
- **Keyboard**: Radix `DropdownMenuItem`s are focusable/roved by default; keep
  `onSelect` handlers so Enter/Space work.
- **Accessibility**: the trigger keeps its `aria-label={t(... "account of {name}")}`.

## i18n keys touched

`settings.account.menuGroup`, `settings.menu.myProfile`,
`settings.menu.changePassword`, and the existing `auth.session.*` /
`auth.common.cancel` / `navigation.login`. Full list in [10-i18n.md](10-i18n.md).
