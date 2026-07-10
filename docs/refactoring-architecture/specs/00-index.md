# Architecture Remediation — Implementation Specs

Checkbox-driven specs for making `apps/frontend` conform to
[../01-canonical-conventions.md](../01-canonical-conventions.md). Read the design docs
([../00-index.md](../00-index.md)) first for the *why*; these specs are the *how*.

Boxes are ticked `- [x]` **only after** the change is implemented and verified (`tsc` +
Biome clean, behavior identical). Each issue ID (C1, K2, …) traces back to its evidence in
docs 02–07.

> **Status:** scaffold. The per-phase spec files below (01–05) are to be authored with the
> exact per-file before/after. This index already carries the full task checklist so work
> can start against it immediately.

## Spec files (to author)

| File | Phase | Covers |
|---|---|---|
| `01-quick-wins.md` *(to author)* | 1 | C1, C8, N3, N4, N8, K6 |
| `02-deduplicate.md` *(to author)* | 2 | K1, K2/U2, K3, U1, U3 |
| `03-structure-and-placement.md` *(to author)* | 3 | K4, K5, C4, C5, C6, C7, U4, U5, U6, M5 |
| `04-module-parity.md` *(to author)* | 4 | M1, M2, M3, M4, N2, M6 |
| `05-enforce-and-sweep.md` *(to author)* | 5 | N1, N5, C2, C3, J1, J2, J3, N9 |

## Conventions for all spec snippets

Same contract as the rest of `docs/*/specs`:
- **JSDoc only — no inline `//` comments, no per-field annotations, no decorative separators.**
- JSDoc on every export, multi-line, neutral voice, `@description` ≤ 3 lines, props documented once.
- Theme tokens in `className`; `Result<T>` from repos/use cases; icons from the barrel.
- Every step independently verifiable (`tsc` + Biome). Behavior must not change.

---

## Master checklist

### Phase 1 — Quick wins
- [x] **C1** un-export `PopularRowSkeleton` in `VideosPopularSidebar.Loading.tsx`
- [x] **C8** `Prose` → anonymous forwardRef + `Prose.displayName = "Prose"`
- [x] **N4** rename `UseLanguageDropdown.ts` → `useLanguageDropdown.ts` (+ update imports)
- [x] **N3** decided: all-lowercase-no-separator (matches the other 46); renamed `refresh-token.usecase.ts` → `refreshtoken.usecase.ts`
- [x] **N8** `CircleHelp as CircleHelpIcon` (+ update consumer)
- [x] **K6** rename `storage.constants.ts` → `storage.ts`

### Phase 2 — De-duplicate
- [x] **K2/U2** new `shared/presentation/utils/sanitize/sanitize.utils.ts`; both bodies use it 🔴
- [x] **U1** `resolveShareUrl(path)` in `utils/share/share.utils.ts`; replace `resolveVideoUrl`/`resolveArticleUrl`
- [x] **U3** `buildYoutubeEmbedUrl(id)` in `utils/youtube/youtube.utils.ts`; use in `videoJsonLd`
- [x] **K1** `INFINITE_SCROLL_SENTINEL_OPTIONS` shared const; replace 3 `SENTINEL_OPTIONS`
- [x] **K3** shared `STAR_POSITIONS`; replace 2 copies

### Phase 3 — Structure & placement
- [x] **K5** create `settings/presentation/constants/` (`settingsTabs.ts`, `deviceIcons.ts`)
- [x] **M5** create `articles|videos/presentation/utils/` (concern folders: `json-ld/`, `tags/`)
- [x] **K4** move config constants into `constants/` files (`VIEW_TITLES`, OTP consts, `SETTINGS_TABS`, `DEVICE_ICONS`, `USER_MENU_ITEMS`, `PROMOTED_LIMIT`, tag limits; `PLYR_OPTIONS` stays inline in the shared `VideoPlayer.Plyr.tsx` since the player left the videos module)
- [x] **U4** relocate `dedupeById` (shared `collection/`), `isAllNull` -> mapper-derived `hasStats` entity property, `deriveAuthStatus` (auth `utils/status/`)
- [x] **U5** relocate `orderTags`, `articleJsonLd`, `videoJsonLd`
- [x] **U6** fix layer leaks — `isAllNull` became a `hasStats` boolean on `IYoutubeVideoStats`, derived in `VideosMapper.youtubeStatsFromJson` (dashboard pattern: no functions in domain; derived booleans are computed in mappers)
- [x] **C4** split inline loading into `X.Loading.tsx` (SessionsList, ArticleDetailComments, VideoDetailLyrics, VideoDetailSimilar; Scoreboard/PlaylistModal keep private inline skeletons per the CFS target trees)
- [x] **C5** extract Tabs/Carousel contexts + hooks + variants (`tabsContext.ts`, `tabsVariants.ts`, `useCarousel.ts`)
- [x] **C6** no-op — `ScoreboardColumn`/`PairColumnCarousel`/`RevealOnHover` stay **inline** (R7a; no reusable ones)
- [x] **C7** `export` the file-local `XxxProps` interfaces (incl. layouts; SocialLogin buttons share `SocialLoginButtonProps` via `types.ts`)

### Phase 4 — Module parity
- [x] **M2** hoist user shape (`IAuthUser`+`IFile`+`IRole`+`IPermission`+`EAuthProvider`) to `shared/domain`; `UserMapper` in `shared/infrastructure/mappers`; settings/session no longer reach into auth
- [x] **M3** `IShareArticleUseCase`/`IShareVideoUseCase` + request-object `execute`
- [x] **M4** move `useToggle` → `shared/presentation/hooks`
- [x] **M1** decided (a): `session/domain/entities/` owns `ISession` + `IRevokeSessionResponse`; own `session.mapper.ts` added
- [x] **M6** `containers/` layer — adopted; docs reconciled (see component-folder-structure)
- [x] **N2** unify notification export shape — namespace objects everywhere (`PlaylistNotification`, `RatingNotification`, `VideoShareNotification`, `ArticleShareNotification`, `ArticleCommentNotification`)

### Phase 5 — Enforce-then-sweep
- [x] **N1** Biome `noRestrictedImports` bans `../` (error); all `../` imports codemodded to `@/`
- [x] **N5** unify dummy scheme to `*.dummy.ts` under `data/`; moved the 4 colocated files
- [x] **C2** converge folder style (`Foo/Foo.tsx` + `index.ts`), module-by-module
- [x] **C3** rename concatenated sub-components to dotted form (card `.Stats`, `MegaMenu.CategoryList`, `SocialLogin.*Button`, `LanguageDropdown.Menu`)
- [x] **J1** trim over-long `@description` blocks to ≤ 3 lines
- [x] **J2** remove prop double-documentation (component `@param` blocks dropped; interface `@property` kept)
- [x] **J3** convert `@param {Type}` → untyped `@param` (`@property {Type}` kept)
- [x] **N9** apply the `Entity`-suffix rule — aggregates suffixed (`IAuthUser` → `IAuthUserEntity`, `ISession` → `ISessionEntity`); responses/pages/value/support types stay bare

### Tooling
- [x] `noRestrictedImports` lint rule (N1)
- [x] AGENTS.md carries the component-structure + JSDoc rule blocks pointing at the docs
