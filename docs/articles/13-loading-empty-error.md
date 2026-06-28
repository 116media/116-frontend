# Loading, Empty, Error & End-of-Feed

Four non-happy states around the grid, each a small presentational component the
container selects between (see
[06-articles-grid-and-infinite-scroll.md](06-articles-grid-and-infinite-scroll.md)).

---

## First-load skeleton

`ArticlesGridLoading` renders the **same grid** filled with card-shaped skeletons, so
there is no layout shift when real cards replace them.

```tsx
/**
 * ArticlesGridLoading
 *
 * @description
 * Skeleton placeholder for the article grid: the same 1/2/4-column layout filled with
 * card-shaped shimmer blocks (image + meta + title lines). Used on first load and, with
 * `rows={1}`, as the "loading next page" indicator under the grid.
 *
 * @param rows - How many grid rows of skeletons to render (default fills the viewport).
 */
export function ArticlesGridLoading({ rows }: { rows?: number }) { /* … */ }
```

- Count of skeleton cards defaults to `ARTICLES_PAGE_SIZE` so first paint matches the
  first real page.
- Reused as the **next-page** loader (`rows={1}`) beneath the grid while
  `isFetchingNextPage`.
- Skeleton blocks use the app's shimmer/`animate-pulse` + `bg-muted` tokens.

## Empty state (two variants)

`ArticlesGridEmpty` handles two cases via a `filtered` prop:

```tsx
/**
 * ArticlesGridEmpty
 *
 * @description
 * Empty state for the article grid. With `filtered`, it means the current
 * search/category/tag matched nothing and offers a "Clear filters" action; without it,
 * the feed itself has no content ("no articles yet").
 *
 * @param filtered - Whether the emptiness is due to active filters.
 * @param onClear - Clears all filters (shown only when `filtered`).
 */
export function ArticlesGridEmpty({ filtered, onClear }: {
    filtered?: boolean;
    onClear?: () => void;
}) { /* … */ }
```

- **Unfiltered empty** (`filtered` false) — "No articles yet" (`articles.grid.empty.*`).
  During the dummy-data phase this is not reached: `useArticlesFeed` serves **paged dummy
  articles** for an empty unfiltered feed (48 items via `dummyArticlePage`), so the grid
  fills and infinite-scrolls instead. See [11-dummy-data.md](11-dummy-data.md). This
  state appears only once dummy is removed and the real feed is genuinely empty.
- **Filtered empty** (`filtered` true) — "No articles match your filters"
  (`articles.grid.noResults.*`) with a **Clear filters** button calling `onClear`. This
  is shown even during the dummy-data phase (an active filter is a real query, so the
  dummy fallback does not apply).

Both are centered with a muted illustration/icon and use `text-muted-foreground` tokens.

## Error state

`ArticlesGridError` — shown when the query errors (offline / 5xx / mapped `Failure`).
Message + a **Try again** button calling `refetch()`.

```tsx
/**
 * ArticlesGridError
 *
 * @description
 * Retryable error state for the article feed. Renders a short message and a button that
 * re-runs the query. Never falls back to dummy data — a real failure stays visible.
 *
 * @param onRetry - Re-runs the feed query (`refetch`).
 */
export function ArticlesGridError({ onRetry }: { onRetry: () => void }) { /* … */ }
```

The error text can reflect a rate-limit (`429`) specifically (see
[03-backend-api-reference.md](03-backend-api-reference.md)); otherwise a generic
"couldn't load" from i18n.

## End-of-feed

`EndOfFeed` replaces the scroll sentinel when `hasNextPage` is `false` — a small,
centered, muted line (`articles.grid.end`) giving a clear terminus (important for
screen-reader users, who otherwise can't tell an infinite list has ended).

---

## State selection (container)

```text
isLoading                        → ArticlesGridLoading            (full skeleton)
isError                          → ArticlesGridError (retry)
empty & hasActiveFilters         → ArticlesGridEmpty filtered onClear
empty & no filters               → ArticlesGridEmpty              (or dummy during phase 1)
else                             → ArticlesGrid
    + isFetchingNextPage         → ArticlesGridLoading rows={1}   (under the grid)
    + hasNextPage                → <sentinel>                     (triggers fetchNextPage)
    + !hasNextPage               → EndOfFeed
```

All four states live in `ArticlesGrid/` next to the grid, exported for the container.
