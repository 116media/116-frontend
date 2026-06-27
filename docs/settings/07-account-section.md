# Account Section

`/settings/account` — the frontend rebuild of the dashboard's `AccountContainer`.
A single "Sign out" concern presented as two cards: leave **this device**, or leave
**all devices**.

**Component:** `settings/presentation/components/AccountSection/`.
**Data:** `useLogout()` (existing, `auth`), `useLogoutAll()` (new thin hook over the
existing `signoutall.usecase`).

## Header

`SettingsPageHeader` — icon `SettingsIcon`, title `settings.account.title`
("Account"), subtitle `settings.account.subtitle` ("Manage signing out of your
devices.").

## Card 1 — Sign out (this device)

```
Card (flex, items-center, gap-3, p-4)
├── Icon box (size-10, bg-muted)   LogOutIcon
├── Info (flex-1)
│   ├── <strong> settings.account.signOut.title      "Sign out"
│   └── <muted>  settings.account.signOut.description "Sign out of this device."
└── Button (variant="outline", destructive text, loading) settings.account.signOut.action
```

- Action → open the shared `ConfirmDialog` (reuse the exact copy already used by
  `UserAccountControl`: `auth.session.signOutConfirmTitle` /
  `...ConfirmDescription`), then `useLogout().mutate({})`.
- `useLogout` already re-seeds `me` as guest, broadcasts on the auth channel, and
  toasts. After success the `(authenticated)` guard bounces the now-guest user home.

## Card 2 — Sign out from all devices

```
Card (flex, items-center, gap-3, p-4)
├── Icon box (size-10, bg-destructive/10, text-destructive)  AlertCircleIcon
├── Info (flex-1)
│   ├── <strong> settings.account.signOutAll.title       "Sign out from all devices"
│   └── <muted>  settings.account.signOutAll.description  "You will be signed out everywhere."
└── Button (variant="destructive", loading) settings.account.signOutAll.action
```

- More aggressive, so use a **stronger** destructive `ConfirmDialog`:
  title `settings.account.signOutAll.confirmTitle`, description
  `settings.account.signOutAll.confirmDescription` ("This ends every active session,
  including this one. You'll need to sign in again everywhere.").
- Confirm → `useLogoutAll().mutate()` → `POST /public/auth/sign-out-all` (no body).
- On success: same teardown as normal sign-out (clear caches, re-seed guest,
  broadcast, toast `settings.notification.signOutAll*`), then the guard redirects
  home. Because it revokes the current session too, the local logout path is
  identical to `useLogout`'s `onSuccess` — factor that teardown into a shared helper
  so both hooks call it.

## `useLogoutAll` (new)

A thin mutation hook mirroring `useLogout`, over the existing
`auth/application/usecases/signoutall.usecase.ts`:

```ts
export function useLogoutAll() {
    return useMutation<ISignOutAllResponse, Failure, void>({
        mutationKey: authKeys.mutation,
        mutationFn: async () => {
            const result = await container.cradle.signOutAllUseCase.execute();
            if (!result.ok) throw result.error;
            return result.value;
        },
        onSuccess: () => resetToGuest()   // shared teardown (also used by useLogout)
    });
}
```

Where `resetToGuest()` = re-seed `authKeys.me` as guest, `removeQueries` for
non-auth caches, broadcast `logout` on the auth channel, and toast.

## Notes

- Both actions must show the button `loading` state while their mutation is pending
  (the confirm dialog's confirm button already supports `loading`).
- No "sign out" happens without confirmation — parity with the rest of the app.
- After either action the sessions list (Security tab) is moot for this device; no
  extra invalidation needed since the user is redirected out.
