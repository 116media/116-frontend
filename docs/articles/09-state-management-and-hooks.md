# State Management & Hooks

The feed is a **TanStack Query `useInfiniteQuery`** over the paginated use case. State
lives entirely in the query cache; the container derives everything it renders from it.

---

## Query keys

Add an `articleKeys` factory next to the existing key factories, so filters become part
of the cache identity (category/tag/search all reuse the same feed):

```ts
/**
 * Query keys for the articles feature.
 */
export const articleKeys = {
    all: ["articles"] as const,
    feed: (filters: IArticleFeedFilters = {}) =>
        [...articleKeys.all, "feed", filters] as const,
    categories: [...["articles"], "categories"] as const,
    popularTags: [...["articles"], "tags", "popular"] as const,
    allTags: (search: string) => [...["articles"], "tags", "all", search] as const
};

/** Filters that scope the feed (all optional; unset = the full feed). */
export interface IArticleFeedFilters {
    search?: string;
    categoryId?: string;
    tagSlug?: string;
}
```

Changing a filter changes the key → a fresh infinite cache, so paging never mixes
across filters.

---

## `useArticlesFeed`

```tsx
/**
 * useArticlesFeed
 *
 * @description
 * Infinite query for the public article feed. Each page calls
 * `getPublishedArticlesUseCase` with the next `pageIndex`; pages accumulate in the
 * TanStack cache. `getNextPageParam` returns the next index while the mapped
 * `hasNextPage` is true, and `undefined` at the end (which sets `hasNextPage` to false
 * on the query). Errors surface as the typed `Failure`.
 *
 * @param filters - Optional search / category / tag scoping (deferred UI).
 * @returns The `useInfiniteQuery` result: `data.pages`, `fetchNextPage`,
 *   `hasNextPage`, `isFetchingNextPage`, `isLoading`, `isError`, `refetch`.
 */
export function useArticlesFeed(filters: IArticleFeedFilters = {}) {
    return useInfiniteQuery<IArticlePage, Failure>({
        queryKey: articleKeys.feed(filters),
        initialPageParam: 0,
        queryFn: async ({ pageParam }) => {
            const result = await container.cradle.getPublishedArticlesUseCase.execute({
                pageIndex: pageParam as number,
                pageSize: ARTICLES_PAGE_SIZE,
                ...filters
            });
            if (!result.ok) throw result.error;
            return result.value;
        },
        getNextPageParam: (lastPage) =>
            lastPage.hasNextPage ? lastPage.pageIndex + 1 : undefined
    });
}
```

- **`initialPageParam: 0`** — the backend is zero-based.
- **`getNextPageParam`** reads the mapper-derived `hasNextPage`; returning `undefined`
  flips `hasNextPage` to `false` on the query, which the container uses to render the
  end-of-feed marker instead of the sentinel.
- **`ARTICLES_PAGE_SIZE`** (e.g. `12`, a multiple of the 4-column grid) is a module
  constant so the skeleton count matches.
- Errors throw the typed `Failure`; `isError` + `refetch` drive the error view.

The container flattens pages with `data.pages.flatMap((p) => p.items)` — see
[06-articles-grid-and-infinite-scroll.md](06-articles-grid-and-infinite-scroll.md).

---

## Filter hooks (categories, tags)

The toolbar's option lists are plain `useQuery` reads (they change rarely), each over an
existing or one new use case. Full code in
[specs/08-search-and-filters.md](specs/08-search-and-filters.md); the shape:

| Hook | Use case | Feeds |
| --- | --- | --- |
| `useArticleCategories()` | `getArticleCategoriesUseCase` (exists) | the category dropdown (active categories) |
| `useArticlePopularTags()` | `getArticlePopularTagsUseCase` (exists) | the inline tag pill strip |
| `useAllTags(search, enabled)` | **`getAllTagsUseCase`** (new) | the searchable "All tags" popover; `enabled` only while open |

- Categories and popular tags are cached under stable keys; the "all tags" query is
  keyed by its (debounced) search term and **disabled** until the popover opens, so the
  full tag list is never fetched eagerly.
- The **feed filters** (`search`, `categoryId`, `tagSlug`) are owned by
  `ArticlesFeedContainer` as component state and passed to `useArticlesFeed(filters)`.
  The raw search string keeps the input instant; a `useDebouncedValue(search, 300)`
  gate drives the query key so paging doesn't refire per keystroke. See
  [16-search-and-filters.md](16-search-and-filters.md).

---

## Dummy-data fallback

To match the promotion feed (which renders dummy data until the backend has content),
the fallback is **inside `useArticlesFeed`'s `queryFn`** and is **paged**, so infinite
scroll works over dummy data too (see [11-dummy-data.md](11-dummy-data.md)):

- If a page resolves empty (`count === 0`) **and no filters are active**, the `queryFn`
  returns `dummyArticlePage(pageIndex, ARTICLES_PAGE_SIZE)` — a real `IArticlePage` slice
  of the 48 dummy articles with a derived `hasNextPage`. The sentinel then pages through
  all 48 (4 pages of 12) and stops at the end, exactly like real data.
- If **filters are active** and the result is empty, **no** dummy is substituted — the
  grid shows the filtered-empty state ("no articles match").
- If the request **errors** (offline / 5xx), the query surfaces the `Failure`; the
  container shows the error state with retry — it does **not** show dummy data, so real
  failures stay visible.

> The empty-vs-error and filtered-vs-unfiltered distinctions matter: an empty unfiltered
> feed is a legitimate "no content yet" state (dummy is acceptable, as on the homepage);
> an empty filtered feed is a real "no matches"; an error must be surfaced. This keeps the
> dummy path from masking outages or hiding empty search results. Revisit once real
> content lands — see [15-open-questions.md](15-open-questions.md).

---

## Caching & lifecycle

- Runs under the app `QueryProvider` (`staleTime: 60_000`, `retry: false`,
  `refetchOnWindowFocus: false`).
- Returning to `/articles` within `staleTime` restores the accumulated pages and scroll
  position without refetching.
- Interaction mutations (like / bookmark) update **counts** on the cached items
  optimistically and, where relevant, invalidate `articleKeys.all`. See
  [10-interactions.md](10-interactions.md).
