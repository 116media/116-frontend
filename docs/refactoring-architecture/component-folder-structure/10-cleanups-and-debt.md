# 10 — Cleanups & Debt (surfaced by the audit)

The file-by-file read that produced this structure also surfaced dead code, duplication, and
stale data wiring. These are folded into the target trees where structural, and listed here
so nothing is lost. Each has an ID for the specs.

## Dead code — delete (D)

| ID | File(s) | Evidence |
|---|---|---|
| D1 | `videos/.../VideosMegaMenuCard/VideosMegaMenuCardBody.tsx` + `…CardImage.tsx` | Exported + documented as "shared parts," but **no variant imports them** — each card inlines its own image/body. Stale from an earlier 2-variant design. |
| D2 | `articles/.../ArticlesMegaMenuCard/ArticlesMegaMenuCardImage.tsx` + `…CardBody.tsx` | Same — exported/typed but imported by no variant (each card inlines its own image/body). Stale scaffolding; delete + drop their prop types. |

Also drop their prop types from the respective `types.ts`.

## Duplication — dedupe (DUP)

| ID | What | Locations | Fix |
|---|---|---|---|
| DUP1 | `SANITIZE_CONFIG` (DOMPurify allow-list) — byte-identical, **security-relevant** | `ArticleDetailBody`, `VideoDetailDescription` | one `shared/presentation/utils/sanitize/sanitize.utils.ts` (config + `sanitizeHtml`) |
| DUP2 | Share-URL resolver | `VideoShareModal` (`resolveVideoUrl`), `ArticleDetailShareRail` (`resolveArticleUrl`) | `resolveShareUrl(path)` in `shared/presentation/utils/share/share.utils.ts` |
| DUP4 | Engagement-stat row triplicated | `ArticlePromotionCard.{Hero,Side,Pair}` | extract `ArticlePromotionCard.Stats.tsx` (already in the target tree) |
| DUP6 | `SENTINEL_OPTIONS` (infinite-scroll observer) ×3 | ArticlesGrid, ArticleDetailComments, VideoDetailSimilar | one shared `INFINITE_SCROLL_SENTINEL_OPTIONS` |
| DUP7 | `STAR_POSITIONS = [1..5]` ×2 | VideoDetailScoreboard, VideoRatingModal | one shared `STAR_POSITIONS` |
| DUP8 | YouTube embed-URL string hand-built | `videoJsonLd` | `buildYoutubeEmbedUrl(id)` in `shared/presentation/utils/youtube/youtube.utils.ts` |

DUP1/DUP2/DUP6/DUP7/DUP8 overlap the wider audit
([../03-constants.md](../03-constants.md),
[../04-utils-and-helpers.md](../04-utils-and-helpers.md)). **ID crosswalk** (the two audits
number the same defects differently — note DUP1↔U2 and DUP2↔U1 are **crossed**):
**DUP1 = U2** (sanitize), **DUP2 = U1** (share URL), **DUP8 = U3** (embed URL),
**DUP6 = K1** (sentinel), **DUP7 = K3** (star positions).

## Extract inline sub-components / helpers (X)

| ID | Item | Where | Target |
|---|---|---|---|
| X1 | `ScoreboardColumn` | inline in `VideoDetailScoreboard.tsx` | **stays inline** (private, single-use — R7a) |
| X2 | `RevealOnHover` | inline in `ShowCard.tsx` | stays inline (R7a) |
| X3 | `PairColumnCarousel` | inline in `PairCarousel.tsx` | stays inline (R7a) |
| X4 | `videoJsonLd` / `articleJsonLd` | in `VideoDetail/` / `ArticleDetail/` | move to module `utils/` |
| X5 | `orderTags` | in `ArticlesToolbar/` | move to module `utils/` |
| X6 | `CommentSkeleton` | inline in `ArticleDetailComments` | move to `ArticleDetailComments.Loading.tsx` |
| X7 | `PopularRowSkeleton` | exported in `VideosPopularSidebar.Loading.tsx` | un-export → **private** in that `.Loading.tsx` (also C1 in the wider audit) |
| X8 | `SessionsListSkeleton` | inline in `SessionsList` | move to `SessionsList.Loading.tsx` (also C4 in the wider audit) |
| X9 | `SimilarCardSkeleton` | inline in `VideoDetailSimilar` | keep **private** in `VideoDetailSimilar.Loading.tsx` (R7a) |

> Note the reconciliation with the earlier audit: the wider audit (C6) suggested extracting
> `ScoreboardColumn`/`RevealOnHover`/`PairColumnCarousel` to files. Under **this** structure's
> R7a, private single-use sub-components stay **inline** (extracting them to their own folder
> would violate the flat-folder rule and add noise). R7a supersedes C6 for *private,
> single-use* sub-components; C6 still holds for *reusable* ones.

## Stale dummy wiring — behavior TODOs (T) — not structural

| ID | Component | Issue |
|---|---|---|
| T1 | `VideoExclusiveShowContainer` | awaits `getVideoExclusiveShowUseCase.execute()`, **discards** the result, always renders `generateDummyExclusiveShow()` |
| T2 | `ArticlePromotionFeedContainer` | calls the use case, discards it, always renders `generateDummyFeed()` |
| T3 | `ArticlesMegaMenu` | falls back to `DUMMY_ARTICLES` |

These are wiring TODOs (restore the real feed), not folder-structure work — flagged so they're
addressed before production, tracked outside this migration.

