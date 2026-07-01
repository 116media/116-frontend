# Authentication — Implementation Specs

Implementation-ready specs for the web frontend authentication & session module.
Each spec contains **full, JSDoc'd code snippets** and a **task checklist** whose
boxes are ticked `- [x]` only **after the work is implemented and verified**
(tsc + biome clean, behavior confirmed).

Read the design docs first ([../README.md](../README.md)) for the *why*; these
specs are the *how*. Decisions are locked in [../17-open-questions.md](../17-open-questions.md).

---

## Specs

| File | What it covers |
|---|---|
| [01-foundations.md](01-foundations.md) | Deps, `QueryProvider`, `Dialog`/`Alert`/`Toast`+`Toaster`/form primitives, shared validation (`validators.ts`, `zod.errormap.ts`), env |
| [02-domain-entities-and-mappers.md](02-domain-entities-and-mappers.md) | `IAuthUser`, `IFile`, `IAuthResponse`, `ISession`, value objects, `AuthMapper` |
| [03-repositories-and-usecases.md](03-repositories-and-usecases.md) | `IAuthRepositoryPort`/impl, `ISessionRepositoryPort`/impl (bare client), all use cases, DI + `Cradle` |
| [04-api-client-interceptors.md](04-api-client-interceptors.md) | Three interceptors in `infrastructure/interceptors/` (`device-id`, `access-token-expiry` single-flight refresh, `refresh-token-expiry`), `X-Device-Id` |
| [05-providers-and-context.md](05-providers-and-context.md) | `QueryProvider`, `AuthProvider` + `useAuth`, query keys, the `me` query, SSR hydration, cross-tab sync |
| [06-mutation-hooks.md](06-mutation-hooks.md) | `useLogin`/`useSignup`/`useVerifyOtp`/`useResendOtp`/`useForgotPassword`/`useResetPassword`/`useLogout`/`useUpdateProfile` |
| [07-auth-modal-and-forms.md](07-auth-modal-and-forms.md) | `AuthModalProvider`, `AuthModal` view machine, the five forms, per-file schemas, `Alert` placement |
| [08-gating-and-route-protection.md](08-gating-and-route-protection.md) | `useRequireAuth` + resume-after-login, verification gate, `middleware.ts`, the `(user)` route group |
| [09-i18n.md](09-i18n.md) | `auth` namespace (en/fr), shared `validator` namespace, resources registration |

> Out of initial scope (later phase): the Settings page (Profile / Security /
> Notifications / Account), the sessions list/revoke UI, profile editing, and
> social login. See [../17-open-questions.md](../17-open-questions.md).

---

## Implementation order

1. **Foundations** (01) — deps, providers, primitives, validation.
2. **Domain + mappers** (02).
3. **Repositories + use cases + DI** (03).
4. **Interceptors** (04) — device-id, silent refresh, refresh-expiry event.
5. **Providers + context** (05).
6. **Mutation hooks** (06).
7. **Modal + forms** (07).
8. **Gating + route protection** (08).
9. **i18n** (09).

Each step is independently verifiable (tsc + biome). Tick a spec's tasks as they
land.

---

## Conventions for all snippets

- **JSDoc on every exported function, component, hook, interface and constant** —
  matching the dashboard and current frontend (`@description`, `@param`,
  `@returns`, `@property`). Multi-line block form only.
- **Theme tokens** in `className` — never hardcoded colors (except the
  data-driven inline cases already documented).
- **`Result<T>`** out of every repository/use case; `ProblemMapper.toFailure`
  in catches; no thrown errors across layers.
- **No tokens or user data in `localStorage`** — cookies + TanStack cache only.

---

## Global progress

- [ ] 01 — Foundations
- [ ] 02 — Domain entities & mappers
- [ ] 03 — Repositories & use cases
- [ ] 04 — API client & interceptors
- [ ] 05 — Providers & context
- [ ] 06 — Mutation hooks
- [ ] 07 — Auth modal & forms
- [ ] 08 — Gating & route protection
- [ ] 09 — i18n

Mark a box `- [x]` only when that spec's own task list is fully verified.
