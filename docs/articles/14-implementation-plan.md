# Implementation Plan

Phased build order. Each phase is independently verifiable (`tsc` + biome clean,
behavior confirmed) before the next. Specs with the actual code are in
[specs/](specs/00-index.md).

---

## Dependencies

- `@radix-ui/react-separator` for the `Separator` primitive (verify latest with
  `npm show @radix-ui/react-separator dist-tags.latest` before pinning). Optional — a
  bare `role="separator"` span works without it.
- No other new runtime deps; `useInfiniteQuery` ships with the installed TanStack
  Query v5.

## Phases

### Phase 1 — Shared primitives
- Add the **`Separator`** UI primitive (`ui/Separator/`).
- Add **`Bookmark` / `BookmarkPlus as BookmarkPlusIcon`** to `Icon/lucide.ts`.
- Add **`useIntersectionObserver`** (`shared/presentation/hooks/`).
- Verify: renders in isolation; tsc + biome clean.
- Spec: [specs/03-infinite-query-hook.md](specs/03-infinite-query-hook.md),
  [specs/04-article-card.md](specs/04-article-card.md).

### Phase 2 — Domain + mappers
- Add `IArticlePage`, `IArticleAuthor`; extend `IArticleSummaryEntity`
  (`readTimeInMinutes?`, `author?`, `bookmarkCount?`).
- Add `ArticlesMapper.articlePageFromDto`; extend `articleSummaryFromDto`.
- Spec: [specs/01-domain-and-mappers.md](specs/01-domain-and-mappers.md).

### Phase 3 — Repository + use case + DI
- Add `IPublishedArticlesQuery`, the port method, the impl, the use case, DI
  registration, and the `Cradle` type entry.
- Verify: a throwaway call returns a mapped `IArticlePage`.
- Spec: [specs/02-repository-and-usecase.md](specs/02-repository-and-usecase.md).

### Phase 4 — Feed hook
- Add `articleKeys`, `IArticleFeedFilters`, `ARTICLES_PAGE_SIZE`, and
  `useArticlesFeed` (`useInfiniteQuery`).
- Spec: [specs/03-infinite-query-hook.md](specs/03-infinite-query-hook.md).

### Phase 5 — Dummy data
- Add `generateDummyArticles` (deterministic, fully populated).
- Spec: [specs/06-interactions-and-dummy-data.md](specs/06-interactions-and-dummy-data.md).

### Phase 6 — The card
- Add the `ArticleCard` compound (`Feed` + sub-composers: media, author, meta,
  engagement) and the barrel. Badge overlay removed; meta row added.
- Verify: renders from a dummy article in light/dark; hover overlay works.
- Spec: [specs/04-article-card.md](specs/04-article-card.md).

### Phase 7 — Grid + states + container
- Add `ArticlesGrid`, `ArticlesGridLoading`, `ArticlesGridEmpty`,
  `ArticlesGridError`, `EndOfFeed`, and `ArticlesGridContainer` (wires the sentinel).
- Spec: [specs/05-grid-and-page.md](specs/05-grid-and-page.md).

### Phase 8 — Interactions
- Add the like / bookmark / share use cases + mutation hooks; wire the engagement bar
  with optimistic state + `useRequireAuth`.
- Spec: [specs/06-interactions-and-dummy-data.md](specs/06-interactions-and-dummy-data.md).

### Phase 9 — Search & filters
- Add `getAllTags` (repo + use case + DI) and the `useArticleCategories` /
  `useArticlePopularTags` / `useAllTags` hooks + `useDebouncedValue`.
- Add `ArticlesToolbar` (category select + debounced search, row 1; tag strip +
  searchable all-tags popover, row 2; clear filters).
- Lift filter state into `ArticlesFeedContainer`; feed `useArticlesFeed(filters)`; add
  the filtered-empty state.
- Spec: [specs/08-search-and-filters.md](specs/08-search-and-filters.md).

### Phase 10 — Page + i18n
- Add `app/(public)/articles/page.tsx` composing the promotion feed + feed container.
- Add the `articles.card` / `articles.grid` / `articles.filters` i18n keys (en/fr).
- Verify: `/articles` shows the promoted strip, the filter toolbar, then the infinite
  grid; search/category/tag filter and reset the feed; scroll loads more; language
  toggle translates all copy.
- Spec: [specs/05-grid-and-page.md](specs/05-grid-and-page.md),
  [specs/07-i18n.md](specs/07-i18n.md), [specs/08-search-and-filters.md](specs/08-search-and-filters.md).

---

## Verification checklist

- [ ] `Separator`, `BookmarkPlusIcon`, `useIntersectionObserver` land and lint clean.
- [ ] `IArticlePage` + mapper derive `hasNextPage` correctly (unit-check the boundary).
- [ ] `getPublishedArticles` returns a mapped page; DI resolves the use case.
- [ ] `useArticlesFeed` accumulates pages; `getNextPageParam` stops at the end.
- [ ] Dummy generator is deterministic (no SSR hydration warning).
- [ ] `ArticleCard.Feed` matches the brief **minus** the image badge, **plus** the meta
      row (category `Tag` · date · reading time); no hardcoded colors.
- [ ] Grid is the video-feed layout with **no** title and **no** view-all link.
- [ ] Infinite scroll fetches the next page via the observer; end-of-feed shows at the
      end; skeleton shows while fetching.
- [ ] Like / bookmark toggle optimistically; guest is gated to the auth modal.
- [ ] Comment button links to the article with the `?comments=1` intent (drawer deferred).
- [ ] `getAllTags` returns tags; category dropdown lists active categories.
- [ ] Search (debounced), category, and tag each reset the feed to page 0 and combine.
- [ ] Tag strip: popular pills scroll, active pinned + highlighted; "All tags" popover
      searches the full list; single-select.
- [ ] Filtered-empty shows "no results + clear filters"; clear resets all filters.
- [ ] `/articles` composes the promoted strip + toolbar + grid; en/fr both clean.
- [ ] `npx tsc --noEmit` and `yarn lint:code` clean across the module.
