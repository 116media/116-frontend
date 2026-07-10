# Spec — articles migration

Target: [../07-target-articles.md](../07-target-articles.md).

## Containers

- [x] `ArticleDetail/index.tsx` → `containers/ArticleDetailContainer/…`
- [x] `ArticlesGrid/index.tsx` (`ArticlesFeedContainer`) → `containers/ArticlesFeedContainer/…`
- [x] `ArticlePromotionFeed/index.tsx` → `containers/ArticlePromotionFeedContainer/…`

## pages/ArticleDetail (decompose)

- [x] `ArticleDetail.tsx` → `components/pages/ArticleDetail/ArticleDetail.tsx` + `index.ts`
- [x] `ArticleDetail.Loading/.Error/.NotFound.tsx` → same folder (flat)
- [x] `articleJsonLd.ts` → `utils/json-ld/article-json-ld.utils.ts` (X4)

## sections (each its own folder)

- [x] `ArticleDetail.Hero.tsx` → `sections/ArticleDetailHero/`
- [x] `ArticleDetailHeroCover.tsx` → `sections/ArticleDetailHeroCover/` (dotted-rename; independent section)
- [x] `ArticleDetail.Body.tsx` → `sections/ArticleDetailBody/` (use shared `sanitizeHtml` — DUP1; `ARTICLE_BODY_ID` → `constants/articleBodyId.ts`)
- [x] `ArticleDetail.MetaBar.tsx` → `sections/ArticleDetailMetaBar/`
- [x] `ArticleDetail.Engagement.tsx` → `sections/ArticleDetailEngagement/`
- [x] `ArticleDetail.Tags.tsx` → `sections/ArticleDetailTags/`
- [x] `ArticleDetail.ReadingProgress.tsx` → `sections/ArticleDetailReadingProgress/`
- [x] `ArticleDetail.ShareRail.tsx` → `sections/ArticleDetailShareRail/` (use shared `resolveShareUrl` — DUP2)
- [x] `ArticleDetail.Comments.tsx` → `sections/ArticleDetailComments/` (+ `.Loading.tsx` from inline `CommentSkeleton` — X6) ★ island
- [x] `ArticleDetailComment.tsx` → `sections/ArticleDetailComment/` (normalize name)
- [x] `ArticleDetailCommentComposer.tsx` → `sections/ArticleDetailCommentComposer/` (normalize name)
- [x] `ArticlesGrid/*` → `sections/ArticlesGrid/` (`.tsx` + 4 state files + `index.ts`)
- [x] `ArticlePromotionFeed/*` → `sections/ArticlePromotionFeed/` (`.tsx`, `.Loading.tsx`, `types.ts`); `dummy-feed.ts` → `data/promotion-feed.dummy.ts`
- [x] `GossipStrip/*` → `sections/GossipStrip/`
- [x] `ArticlesPopularSidebar/*` → `sections/ArticlesPopularSidebar/` ★ island

## cards (compound folders)

- [x] `ArticleCard/*` → `cards/ArticleCard/` (keep dotted parts + `types.ts` + `index.ts`)
- [x] `ArticlePromotionCard/*` → `cards/ArticlePromotionCard/`; extract `ArticlePromotionCard.Stats.tsx` (DUP4)
- [x] `ArticlesMegaMenuCard/*` → `cards/ArticlesMegaMenuCard/`; rename `…CardStats.tsx` → `ArticlesMegaMenuCard.Stats.tsx`; **delete** `…CardImage.tsx` + `…CardBody.tsx` (D2) + their types

## carousels / navigation

- [x] `HeroCarousel/`, `SideCarousel/`, `PairCarousel/` → `carousels/` (each own folder; `PairColumnCarousel` inline — X3)
- [x] `ArticlesMegaMenu/*` → `navigation/ArticlesMegaMenu/`; `ArticlesMegaCategoryList.tsx` → `ArticlesMegaMenu.CategoryList.tsx` (compound)
- [x] `ArticlesToolbar/*` → `navigation/ArticlesToolbar/` (compound; keep the 5 dotted controls); `orderTags.ts` → `utils/tags/tags.utils.ts` (X5)

## finish

- [x] `yarn lint:types` + `biome` + `yarn build` clean
