# Dummy Data

Until the backend has published, promotable content, the grid renders realistic dummy
articles — the same approach the promotion feed uses today
(`ArticlePromotionFeedContainer` → `generateDummyFeed()`). The dummy generator produces
**full `IArticleSummaryEntity`** objects, so components never branch on "is this real."

---

## Where it lives

```
src/modules/articles/presentation/data/articles.dummy.ts
```

Exports **48** deterministic dummy articles and a **paging** helper that slices them
into `IArticlePage`s, so the dummy feed drives infinite scroll through the exact same
path as the real feed — 48 articles ÷ `ARTICLES_PAGE_SIZE` (12) = **4 pages**, and the
sentinel loads them one page at a time until the end.

```ts
/**
 * generateDummyArticles
 *
 * @description
 * Builds a deterministic list of dummy article summaries for the feed grid while the
 * backend has no published content. Every field the card reads is populated —
 * including the card-only additions (`readTimeInMinutes`, `author`) — so no component
 * needs a fallback. Deterministic (index-seeded), so SSR and client render identically.
 *
 * @param count - How many articles to generate (default 48).
 * @returns An array of fully-populated article summaries.
 */
export function generateDummyArticles(count = 48): IArticleSummaryEntity[] { /* … */ }

/**
 * dummyArticlePage
 *
 * @description
 * Returns one page of the dummy articles as an `IArticlePage`, so the infinite feed can
 * page through the 48 dummy items exactly like the real backend. `hasNextPage` is derived
 * from the slice against the total count, so the scroll sentinel keeps loading until the
 * last page.
 *
 * @param pageIndex - Zero-based page to slice.
 * @param pageSize - Items per page.
 * @returns The dummy page for that index.
 */
export function dummyArticlePage(pageIndex: number, pageSize: number): IArticlePage {
    const all = generateDummyArticles();
    const start = pageIndex * pageSize;
    const items = all.slice(start, start + pageSize);
    return {
        items,
        pageIndex,
        pageSize,
        count: all.length,
        hasNextPage: start + pageSize < all.length
    };
}
```

---

## What each dummy article carries

Every field the `ArticleCard` reads, so the card is exercised fully:

| Field | Dummy source |
|---|---|
| `id`, `slug` | index-seeded (`dummy-article-{i}`) |
| `title`, `headline` | rotated from a small realistic pool |
| `categoryName` | rotated (Music, Arts & Culture, Interviews…) → the meta-row `Tag` |
| `coverImageUrl` | curated Unsplash URLs (same host the brief used) |
| `publishedAt` | staggered recent ISO dates → the meta-row date |
| `readTimeInMinutes` | 3–12 → the meta-row "N min read" |
| `author` | rotated `{ userName, avatarUrl }` → the byline |
| `likeCount`, `commentCount`, `shareCount`, `bookmarkCount` | plausible counts → engagement bar |
| `isPromoted` | `false` (promotion is the top strip's concern) |

---

## Determinism (SSR-safe)

The generator is **index-seeded** — no `Math.random()`, no `Date.now()`. Two reasons:

1. The workflow/runtime and Next SSR both forbid non-deterministic values that differ
   between server and client render (hydration mismatch).
2. Deterministic dummy data makes the grid and card visually stable across reloads
   while iterating on styles.

Dates are computed as offsets from a **fixed base timestamp** passed in or defined as a
constant, not `new Date()`.

---

## Where the dummy fallback happens (so infinite scroll works)

The fallback lives in **`useArticlesFeed`'s `queryFn`**, not in the container — so dummy
pages travel the same infinite-query path as real pages and the sentinel drives them.
Per page:

- **Real, non-empty** page → return it.
- **Real page 0 is empty _and_ no filters are active** → return `dummyArticlePage(pageIndex, pageSize)`
  for every page. The feed then pages through all 48 dummy articles via the sentinel,
  ending after page 3 (`hasNextPage` goes false). This is the "no content yet" state and
  matches the homepage's dummy behavior.
- **Filters active and the (real) result is empty** → **no** dummy; the grid shows the
  filtered-empty state ("no articles match"). Dummy only stands in for an empty
  _unfiltered_ feed.
- **Error** → the error view with retry (never dummy — don't mask outages).

Because the fallback is per-page and returns a proper `IArticlePage` with a derived
`hasNextPage`, **infinite scroll behaves identically for dummy and real data** — the
container has no special dummy branch.

When real content lands, deleting the dummy import + the one `queryFn` fallback line is
the only change; the entity contract does not move. Tracked in
[15-open-questions.md](15-open-questions.md).
