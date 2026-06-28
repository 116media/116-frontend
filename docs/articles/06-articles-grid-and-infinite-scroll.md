# Articles Grid & Infinite Scroll

The grid is the homepage **video feed** grid with the section chrome stripped, filled
with `ArticleCard.Feed`, and fed page-by-page by an intersection-observed sentinel.

---

## The grid layout (video feed, minus title & view-all)

`VideoFeedSection` renders a titled section:

The existing `VideoFeedSection.tsx`:

```tsx
<section className="flex flex-col gap-4">
    <div className="flex items-center justify-between gap-3">
        <h2 …>{title}</h2>
        <Link href={viewAllHref}>{t("general.viewAll")} →</Link>
    </div>
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {videos.map((v) => <VideoCard.Vertical key={v.id} video={v} />)}
    </div>
</section>
```

`ArticlesGrid` keeps **only the grid `<div>`** — no `<h2>`, no view-all `<Link>`:

```tsx
/**
 * ArticlesGrid
 *
 * @description
 * The responsive grid of article cards. Uses the homepage video-feed grid layout
 * (1 / 2 / 4 columns) without the section title or "view all" link. Purely
 * presentational — the container owns data, paging, and the scroll sentinel.
 *
 * @param articles - The accumulated article summaries to render.
 */
export function ArticlesGrid({ articles }: { articles: IArticleSummaryEntity[] }) {
    return (
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {articles.map((article) => (
                <ArticleCard.Feed key={article.id} article={article} />
            ))}
        </div>
    );
}
```

Same breakpoints as the video feed: 1 column (mobile), 2 (`sm`), 4 (`lg`);
`gap-x-4 gap-y-8`.

---

## Infinite scroll mechanics

Two pieces: a reusable **observer hook** and the **container** that wires it to
`fetchNextPage`.

### `useIntersectionObserver` (reusable shared hook)

```tsx
/**
 * useIntersectionObserver
 *
 * @description
 * Observes a target element and reports whether it is currently intersecting the
 * viewport (or a given root), for lazy-loading and infinite-scroll sentinels. Returns
 * a callback ref to attach to the sentinel and the latest intersection state. The
 * observer is recreated only when the options change.
 *
 * @param options - Standard IntersectionObserver options (rootMargin, threshold…).
 * @returns A tuple of `[ref, isIntersecting]`.
 */
export function useIntersectionObserver(
    options?: IntersectionObserverInit
): [ (node: Element | null) => void, boolean ] { /* … */ }
```

Lives in `src/shared/presentation/hooks/useIntersectionObserver.ts` — generic, reused
anywhere lazy loading is needed. A `rootMargin` of ~`200px 0px` pre-loads the next page
just before the sentinel is visible, so scrolling stays smooth.

### The container wiring

```tsx
"use client";

/**
 * ArticlesGridContainer
 *
 * @description
 * Drives the infinite article feed: reads {@link useArticlesFeed}, flattens its pages,
 * renders {@link ArticlesGrid}, and appends a sentinel observed by
 * {@link useIntersectionObserver}. When the sentinel enters the viewport and another
 * page exists, it calls `fetchNextPage`. Renders skeleton, empty, error, and
 * end-of-feed states around the grid.
 */
export function ArticlesGridContainer() {
    const { data, isLoading, isError, refetch,
            fetchNextPage, hasNextPage, isFetchingNextPage } = useArticlesFeed();

    const [sentinelRef, isSentinelVisible] = useIntersectionObserver({ rootMargin: "200px 0px" });

    const articles = data?.pages.flatMap((page) => page.items) ?? [];

    useEffect(() => {
        if (isSentinelVisible && hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, [isSentinelVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading) return <ArticlesGridLoading />;
    if (isError)  return <ArticlesGridError onRetry={refetch} />;
    if (articles.length === 0) return <ArticlesGridEmpty />;

    return (
        <div className="flex flex-col gap-8">
            <ArticlesGrid articles={articles} />
            {isFetchingNextPage && <ArticlesGridLoading rows={1} />}
            {hasNextPage
                ? <div ref={sentinelRef} aria-hidden className="h-px" />
                : <EndOfFeed />}
        </div>
    );
}
```

Notes:
- The **sentinel** is a 1px `aria-hidden` div rendered only while `hasNextPage`.
- While the next page loads, one skeleton row is shown under the grid.
- When there are no more pages, an `EndOfFeed` marker replaces the sentinel (see
  [13-loading-empty-error.md](13-loading-empty-error.md)).
- The effect guards on `hasNextPage && !isFetchingNextPage` so it never double-fetches.

The `useInfiniteQuery` configuration (query key, `getNextPageParam`, page mapping) is
in [09-state-management-and-hooks.md](09-state-management-and-hooks.md).

---

## Accessibility

- The sentinel is `aria-hidden` — it is a scroll mechanism, not content.
- Infinite scroll is **not** the only path: because the URL later gains
  category/tag/search params (deferred), the same feed can be linked to. The
  end-of-feed marker gives screen-reader users a clear terminus.
- Each card is an `<article>`; the title link is the primary tab stop; engagement
  buttons are focusable and labelled (see [10-interactions.md](10-interactions.md)).

## Performance

- Pages accumulate in the TanStack cache; re-visiting `/articles` within `staleTime`
  restores the scroll list without refetching.
- `Image` uses `fill` + `object-cover`; the grid cell owns dimensions, so no layout
  shift as cards stream in.
- `rootMargin` pre-fetching hides network latency behind the last visible row.
