# 08 — Target Structure: auth, settings, session

## auth

```
modules/auth/presentation/
├── components/
│   ├── forms/
│   │   ├── LoginForm/           { LoginForm.tsx · index.ts }
│   │   ├── SignupForm/          { SignupForm.tsx · index.ts }
│   │   ├── ForgotPasswordForm/  { ForgotPasswordForm.tsx · index.ts }
│   │   ├── ResetPasswordForm/   { ResetPasswordForm.tsx · index.ts }
│   │   └── VerifyOtpForm/       { VerifyOtpForm.tsx · index.ts }
│   └── social/
│       └── SocialLogin/                                  ← COMPOUND
│           ├── SocialLogin.tsx
│           ├── SocialLogin.GoogleButton.tsx
│           ├── SocialLogin.FacebookButton.tsx
│           ├── types.ts
│           └── index.ts
├── modal/
│   └── AuthModal/               { AuthModal.tsx · index.ts }
├── context/
│   ├── AuthProvider.tsx
│   └── AuthModalProvider.tsx
├── hooks/  constants/  utils/ (incl. notification/)  i18n/  validation/  model/
```

- Each auth form owns its own mutation (self-contained).
- `SocialLogin` is compound: its Google/Facebook buttons are intrinsic parts.
- `AuthProvider` / `AuthModalProvider` stay in `context/` (providers, not components).

## settings

```
modules/settings/presentation/
├── containers/
│   ├── ProfileSectionContainer/   { ProfileSectionContainer.tsx · index.ts }   (owns useAuth + useUpdateAvatar)
│   ├── AccountSectionContainer/    { AccountSectionContainer.tsx · index.ts }   (owns useLogout)
│   └── SettingsGuard/              { SettingsGuard.tsx · index.ts }             (auth gate)
├── components/
│   ├── sections/
│   │   ├── ProfileSection/    { ProfileSection.tsx · index.ts }
│   │   ├── SecuritySection/   { SecuritySection.tsx · index.ts }    (pure assembler)
│   │   └── AccountSection/    { AccountSection.tsx · index.ts }
│   ├── cards/
│   │   ├── SettingsCard/      { SettingsCard.tsx · index.ts }        ⇧ generic → shared candidate
│   │   ├── AccountActionCard/ { AccountActionCard.tsx · index.ts }   ⇧ generic → shared candidate
│   │   └── SessionCard/       { SessionCard.tsx · index.ts }         ★ island (useRevokeSession)
│   ├── fields/
│   │   └── DetailField/       { DetailField.tsx · index.ts }         ⇧ generic → shared candidate
│   ├── lists/
│   │   └── SessionsList/      { SessionsList.tsx · SessionsList.Loading.tsx · index.ts }   ★ island (useSessions)
│   ├── forms/
│   │   └── ChangePasswordForm/{ ChangePasswordForm.tsx · index.ts }
│   ├── modals/
│   │   └── ProfileEditModal/  { ProfileEditModal.tsx · index.ts }    (modal + form)
│   └── navigation/
│       └── SettingsSidebar/   { SettingsSidebar.tsx · index.ts }
├── hooks/  constants/(NEW: settingsTabs.ts, deviceIcons.ts)  i18n/  utils/notification/  validation/  model/
```

- `SettingsCard`, `AccountActionCard`, `DetailField` are pure/generic — module bucket now,
  promote to `shared/` when a second module imports them (R10).
- `SessionCard`/`SessionsList` are settings-specific islands (own their session
  query/mutation).
- `settings/presentation/constants/` is **new** — home for `SETTINGS_TABS`, `DEVICE_ICONS`,
  OTP consts (closes a parity gap; see [../07-module-and-layer-parity.md](../07-module-and-layer-parity.md)).

## session

```
modules/session/presentation/
└── hooks/          (no components — thin module)
```

- `session` has no presentation components. Its domain placement (it currently borrows
  `auth`'s entities) is tracked in
  [../07-module-and-layer-parity.md](../07-module-and-layer-parity.md) (M1).
