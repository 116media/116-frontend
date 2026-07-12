# 07 — Target Structure: articles

Full target tree. Same legend as [06](06-target-videos.md).

```
modules/articles/presentation/
├── containers/
│   ├── ArticleDetailContainer/          { ArticleDetailContainer.tsx · index.ts }
│   ├── ArticlesFeedContainer/           { ArticlesFeedContainer.tsx · index.ts }
│   └── ArticlePromotionFeedContainer/   { ArticlePromotionFeedContainer.tsx · index.ts }
├── components/
│   ├── pages/
│   │   └── ArticleDetail/
│   │       ├── ArticleDetail.tsx
│   │       ├── ArticleDetail.Loading.tsx
│   │       ├── ArticleDetail.Error.tsx
│   │       ├── ArticleDetail.NotFound.tsx
│   │       └── index.ts
│   ├── sections/
│   │   ├── ArticleDetailHero/            { ArticleDetailHero.tsx · index.ts }
│   │   ├── ArticleDetailHeroCover/       { ArticleDetailHeroCover.tsx · index.ts }
│   │   ├── ArticleDetailBody/            { ArticleDetailBody.tsx · index.ts }
│   │   ├── ArticleDetailMetaBar/         { ArticleDetailMetaBar.tsx · index.ts }
│   │   ├── ArticleDetailEngagement/      { ArticleDetailEngagement.tsx · index.ts }
│   │   ├── ArticleDetailTags/            { ArticleDetailTags.tsx · index.ts }
│   │   ├── ArticleDetailReadingProgress/ { ArticleDetailReadingProgress.tsx · index.ts }
│   │   ├── ArticleDetailShareRail/       { ArticleDetailShareRail.tsx · index.ts }
│   │   ├── ArticleDetailComments/        { ArticleDetailComments.tsx · ArticleDetailComments.Loading.tsx · index.ts }  ★ island
│   │   ├── ArticleDetailComment/         { ArticleDetailComment.tsx · index.ts }
│   │   ├── ArticleDetailCommentComposer/ { ArticleDetailCommentComposer.tsx · index.ts }
│   │   ├── ArticlesGrid/                 { ArticlesGrid.tsx · ArticlesGrid.Loading.tsx · ArticlesGrid.Empty.tsx · ArticlesGrid.Error.tsx · ArticlesGrid.EndOfFeed.tsx · index.ts }
│   │   ├── ArticlePromotionFeed/         { ArticlePromotionFeed.tsx · ArticlePromotionFeed.Loading.tsx · types.ts · index.ts }
│   │   ├── GossipStrip/                  { GossipStrip.tsx · index.ts }
│   │   └── ArticlesPopularSidebar/       { ArticlesPopularSidebar.tsx · ArticlesPopularSidebar.Loading.tsx · index.ts }  ★ island
│   ├── cards/
│   │   ├── ArticleCard/                                  ← COMPOUND
│   │   │   ├── ArticleCard.Feed.tsx
│   │   │   ├── ArticleCard.Horizontal.tsx
│   │   │   ├── ArticleCard.Media.tsx
│   │   │   ├── ArticleCard.Author.tsx
│   │   │   ├── ArticleCard.Date.tsx
│   │   │   ├── ArticleCard.Meta.tsx
│   │   │   ├── ArticleCard.Engagement.tsx
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── ArticlePromotionCard/                         ← COMPOUND
│   │   │   ├── ArticlePromotionCard.Hero.tsx
│   │   │   ├── ArticlePromotionCard.Side.tsx
│   │   │   ├── ArticlePromotionCard.Pair.tsx
│   │   │   ├── ArticlePromotionCard.Strip.tsx
│   │   │   ├── ArticlePromotionCard.Stats.tsx            (extracted triplicated stat row)
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── ArticlesMegaMenuCard/                         ← COMPOUND
│   │       ├── ArticlesMegaMenuCard.FeaturedOverlay.tsx
│   │       ├── ArticlesMegaMenuCard.FeaturedGradient.tsx
│   │       ├── ArticlesMegaMenuCard.Compact.tsx
│   │       ├── ArticlesMegaMenuCard.Stats.tsx
│   │       ├── types.ts
│   │       └── index.ts                                  (✗ Body/Image orphans deleted)
│   ├── carousels/
│   │   ├── HeroCarousel/                 { HeroCarousel.tsx · index.ts }
│   │   ├── SideCarousel/                 { SideCarousel.tsx · index.ts }
│   │   └── PairCarousel/                 { PairCarousel.tsx · index.ts }   (private PairColumnCarousel inline)
│   └── navigation/
│       ├── ArticlesMegaMenu/                             ← COMPOUND
│       │   ├── ArticlesMegaMenu.tsx
│       │   ├── ArticlesMegaMenu.CategoryList.tsx
│       │   ├── types.ts
│       │   └── index.ts
│       └── ArticlesToolbar/                              ← COMPOUND
│           ├── ArticlesToolbar.tsx
│           ├── ArticlesToolbar.CategorySelect.tsx
│           ├── ArticlesToolbar.SearchInput.tsx
│           ├── ArticlesToolbar.TagStrip.tsx
│           ├── ArticlesToolbar.AllTagsPopover.tsx
│           ├── ArticlesToolbar.ClearFilters.tsx
│           ├── types.ts
│           └── index.ts
├── hooks/          (useArticleDetail, useArticlesFeed, useArticleComments, useAddArticleComment,
│                    useReadingProgress, useArticleDetailPopular, useArticleCategories,
│                    useArticlePopularTags, useAllTags, useToggleArticleLike/Bookmark, useShareArticle)
├── constants/      (articleKeys.ts, articleBodyId.ts)   ← SENTINEL_OPTIONS moved to shared/ (DUP6)
├── data/           (articles.dummy.ts, article-detail.dummy.ts, promotion-feed.dummy.ts)
├── utils/          (json-ld/article-json-ld.utils.ts, tags/tags.utils.ts)   ← concern folders (root 04)
├── i18n/  utils/notification/  (articles.comment / articles.share)
```

Notes:
- The comments cluster (`Comments` island + `Comment` + `CommentComposer`) becomes three
  sibling section folders — normalizing the dotted naming (`ArticleDetailComment*`).
- `Hero` + `HeroCover` are two independent sections (cover is reusable-candidate), not a
  compound — separate folders.
- `articleJsonLd` and `orderTags` move out of component folders into concern-folder utils
  (`utils/json-ld/article-json-ld.utils.ts`, `utils/tags/tags.utils.ts` — see [../04-utils-and-helpers.md](../04-utils-and-helpers.md)).
- Dedup opportunities (`ArticleCard.Horizontal` ≡ `ArticlePromotionCard.Strip`; the three
  overlapping article-card families) are in [10-cleanups-and-debt.md](10-cleanups-and-debt.md).
