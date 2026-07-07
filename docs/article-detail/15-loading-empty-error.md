# 15 — Loading, Empty, Error & Not-Found

The detail page has more non-happy states than the feed: a whole page can be loading, an
article can be **missing** (404), the detail query can **fail**, and two sub-sections
(comments, popular sidebar) each load, empty, and error on their own. Each state is a
small presentational piece the container or a sub-composer selects between (see
[04-page-composition.md](04-page-composition.md) and
[14-state-management-and-hooks.md](14-state-management-and-hooks.md)).

The shared **`EmptyState`**
(`shared/presentation/components/ui/EmptyState`) backs every error/empty surface — its
props are `context`, `icon`, `title`, `subtitle?`, and `action?`. Skeletons reuse the
feed idiom: `animate-pulse` on `bg-muted` blocks so shimmer, radius, and spacing match the
rest of the app.

---

## Full-page skeleton

`ArticleDetailLoading` renders a full-height placeholder shaped like the real article, so
real content drops in with no layout shift. It mirrors the two-column shell from
[04-page-composition.md](04-page-composition.md): a wide main column and, on `lg`, the
popular/share rail.

```tsx
/**
 * ArticleDetailLoading
 *
 * @description
 * Full-page skeleton for the article detail route. Reproduces the hero block (a large
 * cover rectangle, a category-chip pill, a two-line title, a headline line, and a meta
 * row), a stack of body paragraph lines, and — on wide screens — the popular-sidebar
 * skeleton. Every block is an `animate-pulse` `bg-muted` shape, so shimmer, radius, and
 * spacing match the feed skeletons and no layout shift occurs when the article resolves.
 */
export function ArticleDetailLoading() { /* … */ }
```

- **Hero block** — a `aspect-video` (or `aspect-[16/9]`) `bg-muted` rectangle for the
  cover; a small rounded pill for the category chip; two `h-8`/`h-6` bars for the title;
  one `h-4` bar for the headline; a short meta row of two `h-3` bars (date · read time).
- **Body block** — six-to-ten paragraph lines (`h-4 bg-muted rounded`), the last of each
  group shortened (`w-2/3`) to read like prose.
- **Sidebar block** (`hidden lg:block`) — a heading bar plus three
  `ArticleCard.Horizontal`-shaped rows (thumbnail square + two text lines), matching
  [11-popular-articles-sidebar.md](11-popular-articles-sidebar.md).

Because the route is an async RSC that awaits the article server-side (see
[04-page-composition.md](04-page-composition.md)), this skeleton is primarily the Next
`app/(public)/articles/[slug]/loading.tsx` shown while the RSC streams; the client
container also renders it if it ever holds the query in a pending state.

## Not-found (404)

An unknown or unpublished slug returns **404** from `getArticleBySlug` (see
[03-backend-api-reference.md](03-backend-api-reference.md)). The route treats this as a
first-class Next.js not-found rather than an error:

- The RSC awaits the article; when the mapped result is a `Failure` with a not-found
  problem (or the article is absent), it calls Next's **`notFound()`**, which halts
  rendering and renders the nearest **`not-found`** boundary.
- The page provides `app/(public)/articles/[slug]/not-found.tsx` — a centered
  `EmptyState` (`context="article-detail"`) with a "back to articles" action so the reader
  is never stranded:

```tsx
/**
 * ArticleNotFound
 *
 * @description
 * The not-found boundary for the article detail route, rendered when `getArticleBySlug`
 * reports the slug is missing or unpublished and the page calls Next's `notFound()`.
 * Shows the shared `EmptyState` with the not-found copy and a link back to the article
 * feed, so a dead link resolves to a clear dead-end rather than a stack trace.
 */
export default function ArticleNotFound() { /* … EmptyState + backToArticles link … */ }
```

Copy comes from i18n (see [16-i18n.md](16-i18n.md)); the "back to articles" label reuses
`articles.detail.backToArticles`. This path also sets a proper 404 status for crawlers,
complementing the metadata story in [17-seo-and-metadata.md](17-seo-and-metadata.md).

## Client error state

Distinct from a missing article: a **transient** failure of `useArticleDetail` (offline,
5xx, `429`, or a mapped `Failure` that is not "not found"). Here the article might exist,
so we do **not** call `notFound()` — we show a retryable error:

```tsx
/**
 * ArticleDetailError
 *
 * @description
 * Retryable error state for the article detail query. Renders the shared `EmptyState`
 * with the error copy and a "Try again" button that re-runs `useArticleDetail`. Used for
 * transient failures (offline, 5xx, rate limit) — a genuinely missing article takes the
 * `notFound()` path instead.
 *
 * @param onRetry - Re-runs the detail query (`refetch`).
 */
export function ArticleDetailError({ onRetry }: { onRetry: () => void }) { /* … */ }
```

- `context="article-detail"`, an alert/warning icon from the barrel, title +
  subtitle from `articles.detail.*` error copy, and an `action` of a `Button` calling
  `refetch()`. A `429` can surface a rate-limit-specific subtitle (see
  [03-backend-api-reference.md](03-backend-api-reference.md)); everything else uses the
  generic message.

## Comments loading / empty / error

The comments section owns its own three states, driven by `useArticleComments` (see
[12-comments.md](12-comments.md), the authoritative source for the comment states):

- **Loading** — a small stack of comment-row skeletons (`animate-pulse bg-muted`): an
  avatar circle + two text lines each, count `≈ ARTICLE_COMMENTS_PAGE_SIZE`. Reused, with
  a single row, as the "loading next page" indicator under the list while
  `isFetchingNextPage`.
- **Empty** — an `EmptyState` (`context="article-comments"`) using
  `articles.comments.empty.title` / `articles.comments.empty.body`; for a guest, the
  action is the `articles.comments.loginToComment` prompt, for an authenticated user it
  gently points at the composer.
- **Error** — an `EmptyState` with `articles.comments.error` and a "Try again" action
  calling the comments `refetch`.

The composer's own submit failure is a **toast** (not a section swap), so a failed post
never clears what the reader typed — see [12-comments.md](12-comments.md).

## Popular-sidebar loading / empty

The sidebar (`useArticleDetailPopular`, sourced from promoted/recent articles — see
[11-popular-articles-sidebar.md](11-popular-articles-sidebar.md)) is non-critical, so its
states are quiet:

- **Loading** — three `ArticleCard.Horizontal`-shaped skeleton rows (thumbnail square +
  two text lines), same `animate-pulse bg-muted` idiom.
- **Empty** — when there is nothing to show (no promoted, empty recent, or every candidate
  filtered out as the current article), the sidebar renders a single muted line
  (`articles.sidebar.empty`) or collapses entirely. It never shows an error surface — a
  failed popular fetch just hides the column, since it is supplementary.

---

## State selection

```text
route RSC (server)
    getArticleBySlug → Failure(not-found) | null   → notFound()  → not-found.tsx (EmptyState + back link)
    getArticleBySlug → Success                      → hydrate → ArticleDetailContainer
    (streaming)                                     → loading.tsx (ArticleDetailLoading)

ArticleDetailContainer (client)
    useArticleDetail.isError (transient)            → ArticleDetailError (retry)
    else                                            → ArticleDetail (hero · body · tags · engagement)

comments section  (see 12)
    isLoading                                       → comment-row skeletons
    isError                                         → EmptyState (comments.error, retry)
    empty                                           → EmptyState (comments.empty[, loginToComment])
    else                                            → list (+ skeleton row while isFetchingNextPage)

popular sidebar  (see 11)
    isLoading                                       → 3 horizontal-card skeletons
    empty / error                                   → sidebar.empty line or collapse
```

All detail-level state components live in `ArticleDetail/` beside the assembler; the
comment and sidebar states live with their sub-composers.
