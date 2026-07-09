# 06 — Naming & Imports

Rules in [01 §7–8](01-canonical-conventions.md). Ground truth: `tsconfig.json` alias
`@/* → ./src/*`; `biome.json` `organizeImports: on` (Biome owns import **ordering** — that
is already consistent; it does **not** govern import **path style**, which is where the
inconsistency lives).

---

## N1 — `@/` alias vs relative `../` import path split 🟡 L — the biggest scattered issue

Counts: **1344** `@/` alias import lines vs **258** relative (217 `./`, 41 `../`) across 119
files. The de-facto rule seems to be *"`./` within a folder, `@/` across"* — but it breaks
down: same-module `constants/`, `data/`, `notifications/`, and sibling components are
imported **both ways**, sometimes for the identical target.

| `path:line` | Import | vs |
|---|---|---|
| `articles/.../hooks/useArticleDetail.ts:8` | `"../constants/articleKeys"` (relative) | `articles/.../hooks/useArticleDetailPopular.ts:6` imports the **same** target via `@/modules/articles/presentation/constants/articleKeys` |
| `auth/.../hooks/useLogin.ts:6` (+8 auth hooks) | `@/modules/auth/presentation/constants/authKeys` | vs articles' `../constants/articleKeys` |
| `videos/.../hooks/useVideoDetail.ts:8` | `"../constants/videoKeys"` | vs settings/session aliasing |
| `articles/.../ArticlesGrid/ArticlesGrid.tsx:2` | `ArticleCard` via `@/modules/...` | vs `ArticlesPopularSidebar.tsx:10` `"../ArticleCard"` (**same target, relative**) |
| `ui/FloatingField/FloatingField.tsx:8`, `ui/Toaster/FlashToast.tsx:14` | `"../Button"` | vs 37 sites importing a sibling component via full `@/` |
| `ArticleDetail.ShareRail.tsx:9`, `VideoShareModal.tsx:18` | `"../../notifications/share.notification"` (`../../`) | clear alias candidates |

Split by tendency: the whole `articles` module leans **relative**; `auth`/`settings`/`session`
lean **alias**. No cross-module consensus.

**Rule:** relative `./` **only** for same-directory siblings and colocated
`types.ts`/`constants.ts`; `@/` for everything else. **No import should contain `../`.**
Enforce with a Biome/ESLint `noRestrictedImports` (or `noRestrictedImportPaths`) rule
banning `../`, then codemod the 41 `../` + the cross-folder `./` offenders. Landing the lint
rule first makes this an enforce-then-sweep, not a manual hunt.

---

## N2 — Notification export shape divergence 🟡 M

Same folder purpose (now `presentation/utils/notification/*.notification.ts`), two incompatible export
shapes:

| Modules | Shape | Example |
|---|---|---|
| `auth`, `settings` | **namespace object** | `export const AuthNotification = { … }` (PascalCase const) |
| `articles`, `videos` | **factory functions** | `export function shareLinkCopiedNotification(t) { … }` (camelCase, 8 fns) |

**Rule:** one shape everywhere. Recommend the **`XxxNotification` namespace object**
(groups a module's copy, one import, discoverable) — migrate articles/videos — *or*
uniformly the factory-function form. Pick one in the spec and convert the two dissenting
modules.

---

## N3 / N4 — File-name casing/word-separator drift 🟢 S

| ID | `path` | Problem | Fix |
|---|---|---|---|
| **N4** | `shared/presentation/hooks/UseLanguageDropdown.ts` | Only hook of 42 starting capital `U` (peers: `useDetectedCountry.ts`, `useDismiss.ts`) | rename → `useLanguageDropdown.ts` |
| **N3** | `modules/session/application/usecases/refresh-token.usecase.ts` | Only kebab-cased usecase of 47 (sibling `revokesession.usecase.ts` is all-lowercase) | rename → `refreshtoken.usecase.ts`, **or** migrate all 47 to kebab and document that as the rule |

> Note on the usecase convention: the current tree is all-lowercase-no-separator
> (`getpopularvideos.usecase.ts`), which is hard to read. The spec should decide: keep
> all-lowercase (rename the one kebab straggler) **or** adopt kebab project-wide
> (`get-popular-videos.usecase.ts`) and rename all 47. Recommend the latter for readability,
> but it is the higher-churn option — call it explicitly.

---

## N5 — Dummy-data scheme split 🟢 M

Two schemes and two locations coexist:

| Scheme | Files |
|---|---|
| `dummy-<x>.ts` (prefix, colocated in a component folder) | `ArticlePromotionFeed/dummy-feed.ts`, `ShowsSection/dummy-shows.ts`, `VideoExclusiveShow/dummy-feed.ts`, `VideoFeedSection/dummy-feed.ts` |
| `<x>.dummy.ts` (suffix, in `presentation/data/`) | `data/articles.dummy.ts`, `data/article-detail.dummy.ts`, `data/video-detail.dummy.ts` |

**Rule:** one scheme — `*.dummy.ts` suffix, all under `modules/<m>/presentation/data/`.
Move the 4 colocated `dummy-*.ts` into their module `data/` dir and rename.

---

## N8 — Icon alias mismatch 🟢 S

| `path:line` | Problem | Fix |
|---|---|---|
| `shared/presentation/components/ui/Icon/lucide.ts:29` | `CircleHelp as HelpCircleIcon` — alias name doesn't match the source symbol; every other alias is `<Same> as <Same>Icon` | `CircleHelp as CircleHelpIcon` (update the ~1 consumer) |

The icon barrel is otherwise exemplary: all lucide icons re-exported through one
`Icon` barrel (77 consumers); only `lucide.ts` imports `lucide-react` directly. Keep that.

---

## N9 — Domain `Entity` suffix ✅ resolved

**Rule (applied):** *`Entity` suffix for domain aggregates/root entities; bare `I` for
response, pagination, value, and support types.* The two bare aggregates were renamed —
`IAuthUser` → `IAuthUserEntity`, `ISession` → `ISessionEntity`. Correctly bare and unchanged:
the `I*Response` family, `IArticlePage`/`IArticleCommentPage` (pagination), `IArticleImage`/
`IShowColors` (value objects), `IYoutubeVideoStats` (stats projection), `IFile`/`IRole`/
`IPermission` (user support types), and the `IProfile` alias. See also
[07](07-module-and-layer-parity.md).

---

## Already consistent — do not touch

- **Import ordering** — Biome-enforced (external → `@/` → relative, blank lines). Sole
  authority; never hand-order.
- **Barrels** — `index.ts` for non-JSX re-exports (48), `index.tsx` when the barrel itself
  renders (50). Intentional split; keep.
- **Named exports** — the rule; the 5 default exports are all principled (`next/dynamic`
  target, Awilix container singleton, i18n config/locale defaults).
- **Symbols** — `XxxProps` (243, zero `IXxxProps`), `IXxx` entities, `EXxx` enums,
  `XxxUseCase`/`IXxxUseCase` (2 `Share*` exceptions live in [07](07-module-and-layer-parity.md)),
  centralized icon barrel. All consistent.
- **File-name schemes** — `*.repository.port.ts`, `.repository.impl.ts`, `.mapper.ts`,
  `.dependencies.ts`, `*.notification.ts`, `*.schema.ts`, `IXxx.ts`, `EXxx.ts` are all
  uniform except the drifts named above.

---

## Constants-file naming (K6, cross-ref [03](03-constants.md))

`articleKeys.ts`/`authKeys.ts`/`videoKeys.ts` (camelCase `xxxKeys`) vs
`storage.constants.ts` (`.constants` suffix) vs bare `api.ts`/`colors.ts`/`paths.ts`.
**Rule:** query-key factories `<feature>Keys.ts`; everything else `<topic>.ts`. Rename
`storage.constants.ts` → `storage.ts` (drop the `.constants` suffix).
