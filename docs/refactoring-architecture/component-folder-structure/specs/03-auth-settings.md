# Spec — auth & settings migration

Targets: [../08-target-auth-settings-session.md](../08-target-auth-settings-session.md).

## auth

- [x] `LoginForm/`, `SignupForm/`, `ForgotPasswordForm/`, `ResetPasswordForm/`, `VerifyOtpForm/` → `components/forms/` (rename `index.tsx` → `<Form>.tsx` + add `index.ts`)
- [x] `SocialLogin/*` → `components/social/SocialLogin/` (compound): `GoogleLoginButton.tsx` → `SocialLogin.GoogleButton.tsx`, `FacebookLoginButton.tsx` → `SocialLogin.FacebookButton.tsx`
- [x] `AuthModal.tsx` → `modal/AuthModal/AuthModal.tsx` + `index.ts`
- [x] `AuthProvider.tsx`, `AuthModalProvider.tsx` stay in `context/` (no move)
- [x] `yarn lint:types` + `biome` + `yarn build` clean

## settings

- [x] `ProfileSection/index.tsx` → `components/sections/ProfileSection/` — kept as **one island section** (R2: it owns no query, only `useAuth()` context + an avatar mutation, so a container split isn't worth it)
- [x] `AccountSection/index.tsx` → `containers/AccountSectionContainer/` (owns `useLogout`) + presentational `components/sections/AccountSection/`
- [x] `SecuritySection/index.tsx` → `components/sections/SecuritySection/` (pure assembler; no container needed)
- [x] `SettingsGuard/index.tsx` → `containers/SettingsGuard/`
- [x] `SettingsCard/`, `AccountActionCard/`, `SessionCard/` → `components/cards/` (`SessionCard` stays an island)
- [x] `DetailField/` → `components/fields/`
- [x] `SessionsList/index.tsx` → `components/lists/SessionsList/` (+ `SessionsList.Loading.tsx` from inline `SessionsListSkeleton` — X8/C4) ★ island
- [x] `ChangePasswordForm/` → `components/forms/`
- [x] `ProfileEditModal/` → `components/modals/`
- [x] `SettingsSidebar/` → `components/navigation/`
- [x] **new** `settings/presentation/constants/` — move `SETTINGS_TABS`, `DEVICE_ICONS` (and OTP consts if any) out of components (K4/K5)
- [x] `yarn lint:types` + `biome` + `yarn build` clean

## notes

- Each form keeps its own mutation — no container split needed for forms (they own an action,
  not a read; R2).
- `SettingsCard`/`AccountActionCard`/`DetailField` are generic — leave in the settings bucket
  until a 2nd module imports them (R10), then promote to `shared/` per [../09](../09-target-shared.md).
