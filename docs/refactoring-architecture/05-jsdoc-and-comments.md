# 05 — JSDoc & Comments

Rules in [01 §6](01-canonical-conventions.md). The discipline is strong — every export is
documented, multiline, neutral voice, zero decorative separators, zero name-restating
one-liners. The problems are **length**, **prop double-documentation**, and minor **style
drift**.

Measured over **541 hand-written files** (generated/test excluded), holding **549
`@description` blocks** (some files have > 1):

| Metric | Count |
|---|---|
| Hand-written `@description` blocks (across 541 files) | 549 |
| `@description` > 6 lines | **135** (25%) — a **lower bound** for the ≤ 3-line rule (blocks of 4–6 lines also violate it) |
| `@description` > 10 lines (egregious) | 34 |
| Files double-documenting props (`@property` **and** `@param`) | **42** |
| `@param {Type}` (typed) | 92 |
| `@param name` (untyped) | 524 |
| Trivial name-restating JSDoc | 0 |
| AI/reader-voice comments | ~0 |

---

## J1 — Over-long `@description` blocks 🟡 L

135 blocks exceed 6 lines; the worst narrate layout/animation/runtime behavior in prose
that belongs at the code or in a `docs/` note.

**Rule:** `@description` ≤ **3 lines** (matches `AGENTS.md`) — *what the symbol is and why it exists*.
No prose narration of layout/animation/step-by-step behavior. Don't attach multi-item
catalogs (routes, env vars, compound-component members) to a single const/export; use a
file-level comment.

**Top 20 offenders** (approx. lines):

| Lines | `path:line` | Symbol |
|---|---|---|
| 20 | `shared/presentation/i18n/I18nProvider.tsx:19` | `I18nProvider` |
| 16 | `shared/presentation/utils/youtube.ts:19` | `extractYoutubeId` |
| 16 | `shared/presentation/constants/paths.ts:4` | `HOME_PATH` (catalog on first const) |
| 16 | `modules/videos/presentation/hooks/useSimilarVideos.ts:24` | `useSimilarVideos` |
| 15 | `shared/presentation/components/ui/StarRating/index.tsx:17` | `StarRating` |
| 15 | `modules/articles/presentation/components/ArticlesMegaMenuCard/index.ts:8` | `ArticlesMegaMenuCard` |
| 14 | `shared/presentation/components/ui/Md3Carousel/Md3Carousel.tsx:64` | `Md3Carousel` |
| 14 | `shared/presentation/components/ui/Avatar/AvatarImage.tsx:12` | `AvatarImage` |
| 14 | `modules/videos/.../VideosMegaMenuCard/VideosMegaMenuCardImage.tsx:10` | `VideosMegaMenuCardImage` |
| 13 | `modules/videos/presentation/i18n/locales/en/video-detail.ts:4` | `videoDetail` (dictionary) |
| 13 | `modules/videos/.../VideosMegaMenuCard/index.ts:8` | `VideosMegaMenuCard` |
| 13 | `modules/videos/.../VideoDetail/videoJsonLd.ts:7` | `videoJsonLd` |
| 13 | `modules/videos/.../VideoDetail/VideoPlaylistModal.tsx:41` | `VideoPlaylistModal` |
| 12 | `shared/.../ui/ModalForm/ModalForm.tsx:44` | `ModalForm` |
| 12 | `shared/.../common/SocialShareGroup/index.tsx:87` | `SocialShareGroup` |
| 12 | `shared/infrastructure/api/server-client.ts:10` | `createServerApiClient` |
| 12 | `modules/videos/presentation/hooks/useYoutubeStats.ts:36` | `useYoutubeStats` |
| 12 | `modules/videos/.../VideoCard/index.ts:7` | `VideoCard` |
| 12 | `modules/articles/presentation/hooks/useArticlesFeed.ts:18` | `useArticlesFeed` |
| 12 | `modules/articles/.../ArticleDetail/ArticleDetail.tsx:49` | `ArticleDetail` |

The remaining 115 (rank 21–135, 7–11 lines) cluster in `VideoDetail/*`, `ArticleDetail/*`,
`ui/*`, compound-component barrels (`*/index.ts`), the `presentation/hooks/*` family, and
i18n locale dictionaries.

**Two recurring anti-patterns to name explicitly:**
1. **Catalog-on-first-const** — `paths.ts:4` / `common.ts:4` attach a 16-line route/env
   catalog to the *first* constant so tooling reads it as that const's description. Convert
   to a short file-level comment.
2. **Barrel prose** — compound-component `index.ts` files describe each member's visual
   style. List member names in one line; describe members at their own files.

---

## J2 — Props double-documented 🟡 L

**42 files** document every prop twice: once as `@property` on the Props interface, then
again as `@param` in the component block, restating the same names.

**Rule:** document props **once** — keep `@property` on the exported `XxxProps` interface;
the component block gets `@description` only. `@param` remains correct for **non-prop**
function arguments.

Canonical example — `ui/ModalForm/ModalForm.tsx`: `@property {boolean} open …` (line 19)
then `@param open …` (line 56), 9 props twice.

**All 42 files:** `ui/Toaster/FlashToast.tsx`, `ui/SectionHeader/index.tsx`,
`ui/CountrySelect/{index,CountrySelectTrigger,CountryOption,CountrySelectMenu}.tsx`,
`ui/OtpInput/OtpInput.tsx`, `ui/EmptyState/index.tsx`, `ui/ModalForm/ModalForm.tsx`,
`common/SocialShareGroup/index.tsx`,
`settings/.../{ProfileEditModal,SettingsCard,DetailField,AccountActionCard}/index.tsx`,
`articles/.../ArticleDetail/{index,ArticleDetail.Hero,ArticleDetailCommentComposer,ArticleDetail.Body,ArticleDetail.ShareRail,ArticleDetail.MetaBar,ArticleDetail.Comments,ArticleDetail.Engagement,ArticleDetailHeroCover}.tsx`,
`articles/.../ArticleCard/{ArticleCard.Media,ArticleCard.Engagement}.tsx`,
`articles/.../ArticlesToolbar/{AllTagsPopover,SearchInput,CategorySelect,TagStrip}.tsx`,
`videos/.../VideoDetail/{index,VideoPlaylistModal,VideoDetailPlayer,VideoDetail.Lyrics,VideoDetailPlayer.Poster,VideoRatingModal,VideoShareModal,VideoDetail.Similar,VideoDetail.Scoreboard,VideoDetail.Header,VideoDetail.Tabs}.tsx`,
`videos/.../VideoCard/{VideoCard.Media,VideoCard.Rating}.tsx`.

---

## J3 — `@param {Type}` typed minority 🟢 M

92 typed vs 524 untyped. Dominant and correct is **untyped** (`@param name - desc`) since
TypeScript owns types. The typed minority appears mostly inside `@interface`/`@property`
blocks and a few components — and sometimes both styles sit in the same file (e.g.
`ModalForm.tsx` uses `@property {boolean} open` at 19 and untyped `@param open` at 56).

**Rule:** ban `@param {Type}`; use `@param name - desc`. Keep `@property {Type}` on
interfaces (that's the one place a type annotation is idiomatic and matches the majority).

---

## J4 — Minor style drift 🟢

- **Header pattern:** 416 blocks use `SymbolName\n\n@description\n…`; a minority lead with a
  plain sentence. The `SymbolName` line merely echoes the identifier — harmless. **Pick one
  and apply wholesale** (keeping it is fine; just be consistent).
- **`@returns`:** 263 uses, inconsistently applied — present on most hooks/utils, absent on
  some non-trivial helpers. **Rule:** required on hooks/pure fns with a non-obvious return;
  omit on React components (they return JSX).

---

## Voice — clean, keep it

A scan for reader-narration / AI phrasings returned 6 hits, all legitimate prose. No JSDoc
narrates to the reader. The neutral team-to-team voice holds — this is the standard to
preserve while trimming length.

---

## Highest-leverage work

The **135 over-long descriptions** (esp. top 20) and the **42 double-doc files** account for
nearly all the noise, and both cluster in the same families (`VideoDetail/*`,
`ArticleDetail/*`, `ui/*`, `presentation/hooks/*`). Trimming these two is 90% of the value.
This is an **L** sweep — best done file-by-file alongside whatever other change touches each
file (e.g. during the C2/C3 folder pass), not as a standalone mass edit.
