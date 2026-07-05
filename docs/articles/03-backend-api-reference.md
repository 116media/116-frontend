# Backend API Reference

The articles page consumes the public `articles` endpoints of the Content module. All
routes are under `/api/v1/public/articles` and are already present in the generated
client (`src/shared/infrastructure/api/generated/116.api.ts`). This page is the
contract the frontend maps against; source of truth is the backend.

---

## Endpoints used by the listing page

### List published articles (paginated) — the grid source

```
GET /api/v1/public/articles
```

Generated client: **`api.getPublishedArticles(query?)`**.

**Query parameters**

| Param | Type | Default | Notes |
|---|---|---|---|
| `pageIndex` | int32 | `0` | **Zero-based** page number |
| `pageSize` | int32 | `10` | Items per page |
| `search` | string | — | Full-text search (deferred UI) |
| `categoryId` | uuid | — | Filter by category (deferred UI) |
| `tagSlug` | string | — | Filter by tag slug (deferred UI) |

**Response** — `PublicGetPublishedArticlesResponse`

```ts
interface PublicGetPublishedArticlesResponse {
    articles: ArticleSummaryDtoPaginatedResult;
}

interface ArticleSummaryDtoPaginatedResult {
    pageIndex: number;
    pageSize: number;
    count: number;
    items: ArticleSummaryDto[];
}
```

`pageIndex` is zero-based; `count` is the total across all pages (int64).
`hasNextPage` is **derived**, not returned:
`(pageIndex + 1) * pageSize < count`. See
[07-domain-entities-and-mappers.md](07-domain-entities-and-mappers.md).

### Promoted articles (top strip is fed by the promotion feed)

```
GET /api/v1/public/articles/promoted        → api.getPromotedArticles()
GET /api/v1/public/articles/promotion/feed  → api.getArticlePromotionFeed(query?)
```

The top of the page reuses the promotion **feed** (hero / side / pair / gossip strip)
via the existing `ArticlePromotionFeedContainer`; no new call is added. Documented
here only because it shares the DTO. See [04-page-composition.md](04-page-composition.md).

### Single article (detail page — out of scope, listed for completeness)

```
GET /api/v1/public/articles/{slug}          → api.getArticleBySlug(slug)
```

Returns `ArticleDetailDto` (adds `body`, `tags`, `images`, `author`,
`readTimeInMinutes`, SEO, promotion fields). Not used by the listing.

### Filter option sources (categories & tags)

The toolbar's dropdown and tag strip are populated from these:

```
GET /api/v1/public/categories?contentTypeId=<Article>  → api.publicGetActiveCategories()
GET /api/v1/public/tags/popular?contentType=Article    → api.publicGetPopularTags()
GET /api/v1/public/tags?search=<term>                  → api.publicGetAllTags()
```

- **Active categories** — `CategoryDto[]` (`{ id, name, slug, description, isFree, … }`),
  already mapped to `IArticleCategoryEntity` via the existing `getArticleCategories()`.
- **Popular tags** — `TagDto[]` for the inline strip, via the existing
  `getArticlePopularTags()`.
- **All tags** — `TagDto[]` (`{ id, name, slug }`) for the searchable "All tags"
  popover; `search` filters server-side. Needs a new thin `getAllTags()` (see
  [08-repositories-and-usecases.md](08-repositories-and-usecases.md)).

See [16-search-and-filters.md](16-search-and-filters.md) for how these feed the toolbar.

---

## `ArticleSummaryDto` — the grid's row shape

```ts
interface ArticleSummaryDto {
    id: string;
    categoryId: string;
    categoryName: string;
    title: string;
    slug: string;
    headline: string;
    coverImageUrl?: string | null;
    authorId: string;
    status: EnumContentStatus;
    isPromoted: boolean;
    publishedAt?: string | null;
    likeCount: number;
    commentCount: number;
    shareCount: number;
    bookmarkCount: number;
}
```

Notes on the wire shape: `id` / `categoryId` are UUIDs; `title` is ≤ 100 chars;
`headline` is a short teaser; `status` is `"Published"` for this feed; `publishedAt` is
an ISO date-time. The DTO also inherits audit fields (`createdAt/By`, `updatedAt/By`)
which the mapper ignores.

### Gaps vs. the card design (important)

The `ArticleCard` in the brief needs three things the **summary** DTO does not carry.
This drives the decisions in [05-article-card.md](05-article-card.md) and
[15-open-questions.md](15-open-questions.md):

| Card needs | On `ArticleSummaryDto`? | Resolution |
|---|---|---|
| **Reading time** (`"8 min read"`) | ❌ (only on `ArticleDetailDto.readTimeInMinutes`) | Dummy for now; request `ReadTimeInMinutes` on the summary DTO |
| **Author name + avatar** | ❌ (only `authorId`; `AuthorDto` is on the detail) | Dummy author for now; request an `Author` on the summary DTO |
| **`isLiked` / `isBookmarked`** | ❌ (no per-user flag on any list DTO) | Local optimistic state; reconcile via the interaction endpoints |

The mapper leaves room for these (optional fields); until the backend adds them the
dummy generator supplies them. **No hardcoding in components** — the fields flow
through the entity.

---

## Interaction endpoints (card actions)

All require the Visitor role (auth); each returns `{ isSuccess: boolean }` unless
noted. The frontend updates counts optimistically and reconciles on the response.

| Action | Method + route | Generated client |
|---|---|---|
| Like | `POST /articles/{id}/likes` | `api.publicLikeArticle(id)` |
| Unlike | `DELETE /articles/{id}/likes` | `api.publicUnlikeArticle(id)` |
| Bookmark | `POST /articles/{id}/bookmarks` | `api.publicBookmarkArticle(id)` |
| Remove bookmark | `DELETE /articles/{id}/bookmarks` | `api.publicUnbookmarkArticle(id)` |
| Share | `POST /articles/{id}/shares` `{ platform }` | `api.publicShareArticle(id, body)` |
| My bookmarks (paged) | `GET /articles/bookmarks` | `api.publicGetMyArticleBookmarks(query)` |
| Comments (paged) | `GET /articles/{id}/comments` | `api.publicGetArticleComments(id, query)` |

Only **like / bookmark / share** are wired from the listing card (see
[10-interactions.md](10-interactions.md)); comments belong to the detail page.

---

## Enums

`EnumContentStatus`: `Draft`, `PendingPayment`, `PendingReview`, `Approved`,
`Published`, `Rejected`, `Archived`. The public list returns only `Published`.

## Errors & rate limits

Every endpoint returns `ProblemDetails` on failure and can return **429 Too Many
Requests**. The repository impl catches and maps to a typed `Failure` via
`ProblemMapper.toFailure` (see [08-repositories-and-usecases.md](08-repositories-and-usecases.md));
the grid surfaces a retryable error state (see
[13-loading-empty-error.md](13-loading-empty-error.md)).
