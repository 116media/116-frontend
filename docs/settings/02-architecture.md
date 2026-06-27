# Settings & Sessions — Architecture

The dashboard splits this surface across three modules — `platform/settings`
(profile + password + roles), `platform/session` (list + revoke), and `auth`
(sign out / sign out all). The frontend mirrors that separation so each module
owns one bounded concern.

## Module map

| Concern | Frontend module | Status |
|---------|-----------------|--------|
| Get/update profile, change password | `src/modules/settings` | **Partially exists** — extend |
| List / revoke active sessions | `src/modules/sessions` | **New** |
| Sign out / sign out all | `src/modules/auth` | **Exists** — reuse |
| The `/settings` pages that compose them | `app/(authenticated)/settings/**` + `src/modules/settings/presentation` | **New** |

> Why a separate `sessions` module rather than folding sessions into `settings`?
> To match the dashboard's boundaries and keep session concerns (which also relate
> to token refresh in `auth`) from bloating the settings repository. The Security
> *page* composes both modules; the *modules* stay single-purpose.

## Clean-architecture layers (mirrors `auth`)

Each module follows the exact layout documented for `auth` in
[the authentication docs](../authentication/02-architecture.md):

```
src/modules/<module>/
├── domain/
│   ├── entities/            # I<Name>.ts — post-mapping domain types
│   └── enums/               # E<Name>.ts
├── application/
│   ├── repositories/        # <module>.repository.port.ts  (interface only)
│   └── usecases/            # <action>.usecase.ts → Result<Input, Output>
├── infrastructure/
│   ├── dependencies/        # register<Module>Dependencies(container)
│   ├── mappers/             # <Module>Mapper: DTO → entity
│   └── repositories/        # <module>.repository.impl.ts (calls the API client)
└── presentation/
    ├── components/          # folder-per-component (index.tsx)
    ├── hooks/               # use<Action>.ts — fold Result → throw
    ├── i18n/locales/{en,fr} # module-owned namespace
    ├── model/               # I<Action>Credentials.ts (presentation input)
    ├── validation/          # <action>.schema.ts (zod)
    └── notifications/       # <module>.notification.ts
```

## Target `settings` module (extend)

```
src/modules/settings/
├── domain/entities/
│   ├── IProfile.ts                 # = IAuthUser (exists)
│   └── IChangePasswordResponse.ts  # (exists)
├── application/
│   ├── repositories/settings.repository.port.ts   # getOwnProfile, updateOwnProfile, updateAvatar, changePassword
│   └── usecases/
│       ├── getprofile.usecase.ts         # (exists)
│       ├── updateaccount.usecase.ts      # (exists)
│       ├── updateavatar.usecase.ts       # NEW
│       └── changepassword.usecase.ts     # (exists)
├── infrastructure/{dependencies,mappers,repositories}/
└── presentation/
    ├── components/
    │   ├── SettingsShell/              # sidebar + content layout
    │   ├── SettingsSidebar/
    │   ├── SettingsPageHeader/
    │   ├── SettingsCard/
    │   ├── ProfileSection/             # avatar + account-info card
    │   ├── ProfileEditModal/           # edit account info
    │   ├── ChangePasswordForm/
    │   └── AccountSection/             # the two logout cards
    ├── hooks/
    │   ├── useProfile.ts               # query (GET /me/profile)
    │   ├── useUpdateProfile.ts         # (exists) mutation (PATCH /me/profile)
    │   ├── useUpdateAvatar.ts          # NEW mutation
    │   └── useChangePassword.ts        # NEW mutation
    ├── i18n/locales/{en,fr}/           # settings namespace
    ├── model/
    ├── validation/
    │   ├── changepassword.schema.ts    # (exists in auth/validation — reuse or move)
    │   └── profile.schema.ts           # NEW
    └── notifications/settings.notification.ts
```

## Target `sessions` module (new)

```
src/modules/sessions/
├── domain/
│   ├── entities/
│   │   ├── ISession.ts               # move/reuse from auth/domain/entities
│   │   └── IRevokeSessionResponse.ts # move/reuse from auth/domain/entities
│   └── enums/
│       ├── EBrowser.ts   EDevice.ts   EPlatform.ts   EClient.ts
├── application/
│   ├── repositories/sessions.repository.port.ts   # getSessions, revokeSession
│   └── usecases/
│       ├── getsessions.usecase.ts
│       └── revokesession.usecase.ts
├── infrastructure/{dependencies,mappers,repositories}/
└── presentation/
    ├── components/
    │   ├── SessionsList/
    │   └── SessionCard/
    ├── hooks/
    │   ├── useSessions.ts            # query (GET /me/sessions)
    │   └── useRevokeSession.ts       # mutation (POST /me/sessions/revoke/{id})
    ├── i18n/locales/{en,fr}/         # sessions namespace
    └── notifications/sessions.notification.ts
```

## Reuse from `auth`

- `signout.usecase.ts` + `useLogout` → *Sign out (this device)*.
- `signoutall.usecase.ts` → *Sign out from all devices* (add a `useLogoutAll`
  hook if one doesn't exist).
- `ISession` / `IRevokeSessionResponse` live in `auth/domain/entities` today; move
  them to `sessions/domain/entities` (or re-export) so the sessions module owns
  its types. Keep `auth` importing from the new home to avoid duplication.

## Cross-cutting conventions

- **DI:** each module exposes `register<Module>Dependencies(container)` and is wired
  once at bootstrap (`shared/infrastructure/service.locator.ts`). Repositories are
  `singleton`, use cases `transient`.
- **Errors:** use cases return `Result<T>`; hooks fold `Result` → throw so the
  mutation/query `error` channel carries a typed `Failure`.
- **API:** repository impls call the generated client (`apiClient.api.public*`) and
  map DTOs via a `Mapper`; no DTO leaks past infrastructure.
- **Query keys:** `settingsKeys` / `sessionsKeys` as `const` arrays (see
  [09-data-layer.md](09-data-layer.md)).
- **i18n:** each module registers its own namespace (`settings`, `sessions`) into
  `shared/presentation/i18n/resources.ts`.
