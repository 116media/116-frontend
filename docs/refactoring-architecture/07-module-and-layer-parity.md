# 07 — Module & Layer Parity

Rules in [01 §1–2](01-canonical-conventions.md). The port/impl/usecase/DI spine is uniform;
the divergence is in **which folders each module has**, a few **cross-module couplings**, and
a **documented layer that doesn't exist**.

---

## M6 — The `presentation/containers/` layer (adopted) 🟡 M

Both `docs/brainstorming/architecture/01-project-structure.md` and the article-detail specs
describe a `presentation/containers/` layer (smart, data-fetching components) distinct from
`presentation/components/` (dumb UI). **Zero `containers/` directories exist** — the
"container" role was folded into `components/` as the `index.tsx`/`XxxContainer` file (e.g.
`VideoDetailContainer`, `ArticleDetailContainer` live under `components/`).

**Decision made — (b) introduce `presentation/containers/`.** The
[component-folder-structure/](component-folder-structure/README.md) spec adopts an explicit
`containers/` bucket for the route/section smart shells, with *island containers* allowed to
own their query in place (R3). The `*Container` shells move out of `components/` into
`containers/`. This supersedes the earlier "recommend (a)"; docs and code now follow (b).

---

## Layer-folder parity matrix

`✅` present, `❌` absent.

### Domain
| Sub-folder | articles | auth | session | settings | videos |
|---|:-:|:-:|:-:|:-:|:-:|
| `domain/entities` | ✅ (9) | ✅ (13) | ❌ | ✅ (2) | ✅ (10) |
| `domain/enums` | ❌ | ✅ (2) | ❌ | ❌ | ❌ |
| `domain/valueobjects` | ❌ | ✅ (1) | ❌ | ❌ | ❌ |

### Application — **fully uniform** (every module: 1 port + N usecases).

### Infrastructure
| Sub-folder | articles | auth | session | settings | videos |
|---|:-:|:-:|:-:|:-:|:-:|
| `dependencies` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `repositories` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `mappers` | ✅ | ✅ | ❌ | ❌ | ✅ |
| `constants` | ❌ | ❌ | ✅ | ❌ | ❌ |
| `storage` | ❌ | ❌ | ✅ | ❌ | ❌ |

### Presentation
| Sub-folder | articles | auth | session | settings | videos |
|---|:-:|:-:|:-:|:-:|:-:|
| `components` | ✅ | ✅ | ❌ | ✅ | ✅ |
| `hooks` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `constants` | ✅ | ✅ | ❌ | ❌ | ✅ |
| `data` (dummy) | ✅ | ❌ | ❌ | ❌ | ✅ |
| `i18n` | ✅ | ✅ | ❌ | ✅ | ✅ |
| `utils/notification` | ✅ | ✅ | ❌ | ✅ | ✅ |
| `validation` | ❌ | ✅ | ❌ | ✅ | ❌ |
| `model` | ❌ | ✅ | ❌ | ✅ | ❌ |
| `context` / `modal` / `utils` | ❌ | ✅ | ❌ | ❌ | ❌ |

**Reading the matrix:** `application` is perfect. `session` is a thin, half-a-module outlier.
`settings` lacks `mappers` and `constants`. `data`/`validation`/`model` legitimately appear
only where the feature needs them (dummy data, forms, credential DTOs) — those are
*need-driven*, not gaps. The real gaps are M1–M5 below.

---

## M1 — `session` has no `domain/` layer 🟡 M

`session` defines no domain entities; `session.repository.port.ts` imports `ISession` /
`IRevokeSessionResponse` from **`auth/domain/entities`**. `session` is really a cross-cutting
infra concern (token refresh, device-id, session listing) modeled as a feature module but
missing `domain`, `components`, `i18n`.

**Options:** (a) give `session` its own `domain/entities` (move the session types out of
`auth`); or (b) formally reclassify `session` as shared infrastructure. Pick one in the spec.

---

## M2 — `settings` reuses `AuthMapper` 🟡 S

`settings.repository.impl.ts` imports `AuthMapper.userFromDto` from `auth`. Also
`settings/domain/entities/IProfile.ts` is `export type IProfile = IAuthUser` (re-export of an
auth entity). Two settings→auth couplings.

**Fix:** hoist the shared user shape + `userFromDto` to `shared/{domain,infrastructure/mappers}`
(the user identity is genuinely cross-cutting), or give `settings` its own mapper. Then
`settings` and `session` stop reaching into `auth`.

---

## M3 — Two `Share*UseCase` break the `IResultUseCase` contract 🟡 S

47 use cases follow `interface IXxxUseCase extends IResultUseCase<Req,Res>` +
`class XxxUseCase implements IXxxUseCase`. **Exceptions:**

| `path` | Problem |
|---|---|
| `modules/articles/application/usecases/sharearticle.usecase.ts` | `export class ShareArticleUseCase` — no interface, no `implements`; positional `execute(id, platform)` |
| `modules/videos/application/usecases/sharevideo.usecase.ts` | same |

Both use a two-arg `execute(id, platform)` which is why they can't implement the
single-request-object generic. **Fix:** define `IShareArticleUseCase`/`IShareVideoUseCase`
over a request object (`{ id, platform }`) and `implements` it. Also fold shared use cases
(`DetectCountryUseCase`, `PrefetchNavigationUseCase`) into the same interface convention.

---

## M4 — Generic `useToggle` trapped in `articles` 🟡 S

`modules/articles/presentation/hooks/useToggle.ts` is a generic optimistic-toggle hook (its
own JSDoc calls it "Shared") sitting inside `articles`. **Fix:** move to
`src/shared/presentation/hooks/` and update imports. (Same class of issue as `useToggle`
being reused by videos interactions.)

---

## M5 — Fill the need-driven folder gaps 🟡 M

Create where inline config/helpers already exist and have nowhere to go:
- `settings/presentation/constants/` — home for `SETTINGS_TABS`, `DEVICE_ICONS`, OTP consts
  ([03 K5](03-constants.md)).
- `articles/presentation/utils/`, `videos/presentation/utils/` — home for `orderTags`,
  `*JsonLd` ([04 U5](04-utils-and-helpers.md)).

Do **not** manufacture empty folders for their own sake — only create a folder when [03]/[04]
work needs it.

---

## Entity naming (N9, cross-ref [06](06-naming-and-imports.md)) ✅ resolved

Rule applied: aggregate → `Entity`; response/pagination/value/support → bare. Renamed
`IAuthUser` → `IAuthUserEntity` and `ISession` → `ISessionEntity`; all other bare types are
correctly non-aggregates. The M1/M2 placement outliers are also resolved (session owns its
entities; the user shape lives in `shared/domain`).

---

## Canonical module skeleton (the target)

```
modules/<m>/
  domain/entities/IXxx*.ts            (+ enums/, valueobjects/ only if needed)
  application/
    repositories/<m>.repository.port.ts        (IXxxRepositoryPort)
    usecases/<verb-noun>.usecase.ts            (interface IXxxUseCase + class implements)
  infrastructure/
    dependencies/<m>.dependencies.ts           (registerXxxDependencies)
    mappers/<m>.mapper.ts
    repositories/<m>.repository.impl.ts
  presentation/
    components/  hooks/  i18n/  constants/  utils/notification/
    data/  validation/  model/  utils/         (only where the feature needs them)
```

Every module should match the **required** rows (domain/entities, application, infra
deps+repo+mapper, presentation components+hooks+i18n+utils/notification+constants). The
**need-driven** rows (data/validation/model/utils/enums/valueobjects) appear only where
warranted.
