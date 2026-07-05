# Page Composition

The `/articles` route is a thin composition: the **existing** promotion feed on top,
then the **new** infinite grid. It mirrors the homepage's compose-of-containers style
(`app/(public)/page.tsx`), where each section is a self-contained container that
resolves its own data.

---

## Route

```
app/(public)/articles/page.tsx
```

Lives in the `(public)` route group (same as the homepage), so it inherits the public
header/footer shell and the providers (`QueryProvider`, `AuthProvider`).

```tsx
/**
 * ArticlesPage
 *
 * @description
 * The public articles listing. Opens with the promoted-articles feed (the same
 * server-rendered feed used on the homepage) and continues into an infinite-scrolling
 * grid of every published article. The two sections resolve their own data
 * independently — the promoted feed on the server, the grid on the client.
 */
export default function ArticlesPage() {
    return (
        <div className="flex flex-col gap-8 lg:gap-12">
            {/* Promoted articles — reused from the homepage, above the fold */}
            <Suspense fallback={<ArticlePromotionFeedLoading />}>
                <ArticlePromotionFeedContainer />
            </Suspense>

            {/* Filter toolbar + all published articles — infinite-scrolling grid */}
            <ArticlesFeedContainer />
        </div>
    );
}
```

The outer spacing (`flex flex-col gap-8 lg:gap-12`) is copied from the homepage so the
two pages feel identical.

`ArticlesFeedContainer` is the client container that owns the **filter state**
(`search` / `categoryId` / `tagSlug`), renders the **`ArticlesToolbar`** (search +
category dropdown + tag strip) directly below the promoted feed, and renders the
**infinite grid** filtered by those filters. See
[16-search-and-filters.md](16-search-and-filters.md).

---

## Section 1 — Promoted feed (reuse, zero new code)

`ArticlePromotionFeedContainer` is an **RSC** already used on the homepage. It resolves
the server cradle, runs `getArticlePromotionFeedUseCase`, and (today) falls back to a
dummy feed. The articles page imports it as-is:

```tsx
import { ArticlePromotionFeedContainer }
    from "@/modules/articles/presentation/components/ArticlePromotionFeed";
import { ArticlePromotionFeedLoading }
    from "@/modules/articles/presentation/components/ArticlePromotionFeed/ArticlePromotionFeedLoading";
```

Nothing about the promotion feed changes. If the homepage promotion changes, the
articles page inherits it for free. See the promotion-feed layout in
`ArticlePromotionFeed.tsx` (hero + pair on the left, side + gossip strip on the right).

> Rationale for "the same promoted articles as the homepage": the brief asks for the
> promoted articles "like we have in the homepage." Reusing the container guarantees
> byte-for-byte parity rather than a second, drifting implementation.

---

## Section 2 — Toolbar + infinite grid (the new work)

`ArticlesFeedContainer` is a **client component** (filters + infinite scroll need
`useState`, `useInfiniteQuery`, and `IntersectionObserver`, all client-only). It:

1. Owns the **filter state** — `search` (debounced), `categoryId`, `tagSlug` — and
   renders `ArticlesToolbar` (search, category dropdown, tag strip). See
   [16-search-and-filters.md](16-search-and-filters.md).
2. Calls `useArticlesFeed(filters)` (the infinite query — see
   [09-state-management-and-hooks.md](09-state-management-and-hooks.md)); changing any
   filter changes the query key → the feed resets to page 0.
3. Flattens the pages into a single `IArticleSummaryEntity[]`.
4. Renders `ArticlesGrid` with the articles + an end-of-list **sentinel** that calls
   `fetchNextPage` when it scrolls into view.
5. Shows the skeleton grid on first load, a **filtered** empty state when a filter
   matches nothing, and an error state with retry. See
   [13-loading-empty-error.md](13-loading-empty-error.md).

```tsx
"use client";

/**
 * ArticlesFeedContainer
 *
 * @description
 * Client container for the article feed. Owns the filter state (search / category /
 * tag), renders {@link ArticlesToolbar} above the grid, drives
 * {@link useArticlesFeed} with those filters, flattens its pages, and renders
 * {@link ArticlesGrid} with a sentinel that requests the next page as it enters the
 * viewport. Falls back to dummy articles when the unfiltered feed resolves empty.
 */
export function ArticlesFeedContainer() {
    return null;
}
```

(Body omitted here — it holds the filter state, wires the toolbar and the sentinel, and
selects the loading / empty / error / data view; full implementation in
[specs/05-grid-and-page.md](specs/05-grid-and-page.md) and
[specs/08-search-and-filters.md](specs/08-search-and-filters.md).)

Why client-side (not RSC): filters and infinite scroll are interactive and stateful. The
**first** unfiltered page could later be prefetched on the server and hydrated into the
infinite cache for faster first paint — noted as a future optimization in
[15-open-questions.md](15-open-questions.md); the first cut is client-fetched, matching
`ShowsSectionContainer`'s client pattern.

---

## Composition diagram

```text
ArticlesPage (RSC)
├── <Suspense>
│   └── ArticlePromotionFeedContainer (RSC, reused)      ← promoted articles
│         └── ArticlePromotionFeed (hero / side / pair / gossip)
└── ArticlesFeedContainer ("use client")                 ← filters + all articles
      ├── filter state: { search, categoryId, tagSlug }
      ├── ArticlesToolbar
      │     ├── ArticlesCategorySelect   (left)           ← active categories
      │     ├── ArticlesSearchInput      (right, debounced)
      │     └── ArticlesTagStrip + AllTagsPopover (row 2) ← popular pills + full list
      ├── useArticlesFeed(filters)  → useInfiniteQuery
      ├── ArticlesGrid
      │     └── ArticleCard.Feed × N                      ← the compound card
      └── <sentinel ref>  → useIntersectionObserver → fetchNextPage()
```

See [05-article-card.md](05-article-card.md) for the card and
[06-articles-grid-and-infinite-scroll.md](06-articles-grid-and-infinite-scroll.md) for
the grid + scroll mechanics.
