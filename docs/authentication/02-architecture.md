# Architecture & Folder Structure

The auth module follows the same clean-architecture vertical slice used by
`videos` and `articles`: **domain → application → infrastructure →
presentation**, wired through the Awilix DI container, returning `Result<T>`
from every repository/use-case (no thrown errors crossing layers).

Session concerns that are cross-cutting (token refresh, the sessions list,
revoke) live under a platform-level `session` slice, mirroring mobile's
`platform/session`.

---

## Layer responsibilities

- **domain/** — framework-free entities and value objects. No axios, no React,
  no DTOs. `IAuthUserEntity`, `ISessionEntity`, `AuthStatus`, `OtpPurpose`.
- **application/** — repository **ports** (interfaces) and **use cases**. Use
  cases are thin orchestrators that call a port and return `Result<T>`.
- **infrastructure/** — repository **implementations** (call the generated API
  client), **mappers** (DTO → domain entity), and **DI registration**.
- **presentation/** — React: the `AuthProvider` context, the modal + forms,
  hooks (`useAuth`, the TanStack mutation/query hooks), validation schemas, and
  the `auth` i18n namespace.

The repository impl depends only on the generated `Api` client injected through
the Awilix cradle (`{ client }`), exactly like `ArticlesRepositoryImpl`.

---

## Folder structure

```text
src/modules/auth/
├── domain/
│   ├── entities/
│   │   ├── IAuthUserEntity.ts          # logged-in user (id, email, roles, perms, flags, avatar…)
│   │   ├── IFileEntity.ts              # whole avatar file (≈ dashboard IUser.avatar: IFile) + colors
│   │   ├── IAuthResponse.ts        # { user } (web: tokens are in cookies, not here)
│   │   └── ISessionEntity.ts           # a device session row (browser/device/platform/client…)
│   └── valueobjects/
│       ├── AuthStatus.ts               # "guest" | "unverified" | "authenticated" (+ helpers)
│       ├── OtpPurpose.ts               # "EmailVerification" | "AccountRecovery"
│       └── AuthProvider.ts             # "Local" | "Google" | "Facebook"
├── application/
│   ├── repositories/
│   │   └── auth.repository.port.ts     # IAuthRepositoryPort
│   └── usecases/
│       ├── login.usecase.ts
│       ├── signup.usecase.ts
│       ├── verifyotp.usecase.ts
│       ├── resendotp.usecase.ts
│       ├── forgotpassword.usecase.ts
│       ├── resetpassword.usecase.ts
│       ├── changepassword.usecase.ts
│       ├── signout.usecase.ts
│       ├── signoutall.usecase.ts
│       ├── getownprofile.usecase.ts
│       └── updateownprofile.usecase.ts
├── infrastructure/
│   ├── dependencies/
│   │   └── auth.dependencies.ts        # registerAuthDependencies(container)
│   ├── repositories/
│   │   └── auth.repository.impl.ts
│   └── mappers/
│       └── auth.mapper.ts              # userFromDto, sessionFromDto, authResponseFromDto
└── presentation/
    ├── context/
    │   ├── AuthProvider.tsx            # wraps the `me` query, exposes useAuth()
    │   └── useAuth.ts
    ├── modal/
    │   ├── AuthModalProvider.tsx       # open/close + which view is showing
    │   ├── AuthModal.tsx               # the Dialog shell + view router
    │   └── useAuthModal.ts
    ├── hooks/
    │   ├── useLogin.ts                 # TanStack mutation wrappers (one per action)
    │   ├── useSignup.ts
    │   ├── useVerifyOtp.ts
    │   ├── useResendOtp.ts
    │   ├── useForgotPassword.ts
    │   ├── useResetPassword.ts
    │   └── useLogout.ts
    ├── components/
    │   ├── LoginForm/
    │   ├── SignupForm/
    │   ├── VerifyOtpForm/
    │   ├── ForgotPasswordForm/
    │   └── ResetPasswordForm/
    ├── validation/                     # one schema per file (no barrel)
    │   ├── login.schema.ts
    │   ├── signup.schema.ts
    │   ├── verifyotp.schema.ts
    │   ├── forgotpassword.schema.ts
    │   ├── resetpassword.schema.ts
    │   └── changepassword.schema.ts
    └── i18n/
        ├── index.ts
        └── locales/{fr,en}/{login,signup,otp,password,session,errors}.ts

src/modules/session/                    # platform-level session concern
├── application/
│   ├── repositories/session.repository.port.ts
│   └── usecases/
│       ├── refreshtoken.usecase.ts
│       ├── getownsessions.usecase.ts
│       └── revokesession.usecase.ts
└── infrastructure/
    ├── repositories/session.repository.impl.ts   # uses a BARE axios client (no interceptors)
    └── dependencies/session.dependencies.ts
```

> Mobile keeps `session` under `platform/`. On web we keep it under
> `src/modules/session` for symmetry with the existing module layout, but it is
> conceptually a platform concern (it backs the interceptors, not a feature
> screen). See [12-session-management.md](12-session-management.md).

---

## Shared infrastructure that already exists (reused, not rebuilt)

| Piece | File | Reuse |
|---|---|---|
| API client + `withCredentials` + `Client-App` | `src/shared/infrastructure/api/client.ts` | Add the refresh/error interceptors here |
| Server API client (forwards cookies) | `src/shared/infrastructure/api/server-client.ts` | Server-side `me` prefetch |
| DI container + Cradle | `src/shared/infrastructure/service.locator.ts` | Add auth + session registrations |
| Server DI scope | `src/shared/infrastructure/server.cradle.ts` | Server-side use cases |
| Result / Failure / ProblemMapper | `src/shared/domain/results`, `src/shared/infrastructure/mappers/problem.mapper.ts` | Error mapping |
| API error code constants | `src/shared/infrastructure/constants/api.ts` | `apiErrors.*` already lists auth codes |
| Cookie utils | `src/shared/presentation/utils/*Language*` | Pattern reference (we do not store tokens) |

## New shared pieces to add

- `QueryClientProvider` + a configured `QueryClient`
  (`src/shared/presentation/providers/QueryProvider.tsx`).
- A `Dialog` UI primitive (`src/shared/presentation/components/ui/Dialog/`)
  built on `@radix-ui/react-dialog`.
- Form input primitives (`Input`, `Label`, `FormField`, `PasswordInput`,
  `OtpInput`) under `src/shared/presentation/components/ui/`.
- An `Alert` UI primitive (`src/shared/presentation/components/ui/Alert/`) that
  renders a `Failure` (title + detail) at the top of a form — the frontend
  equivalent of the dashboard's `ErrorAlert`. Backend errors surface here, not on
  fields. See [09-forms-and-validation.md](09-forms-and-validation.md).
- A **shadcn/ui `Toast`** (`@radix-ui/react-toast`) + `Toaster` provider and
  `useToast`, for success notices (password updated, signed out, code sent).
  Not `sonner`.
- A **shared validation module** (`src/shared/presentation/validation/`):
  reusable zod builders + a react-i18next error map, so validation is shared
  app-wide and bilingual. Inspired by the dashboard's `ValidatorUtils`. See
  [09-forms-and-validation.md](09-forms-and-validation.md).

See [16-implementation-plan.md](16-implementation-plan.md) for the build order.
