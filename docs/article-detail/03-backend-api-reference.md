# 03 — Backend API Reference

Every endpoint the detail page consumes, with the exact DTO shapes and the generated
client method. All routes are public (`/api/v1/public/...`), rate-limited
`ContentBrowsing`. Source: the `.NET` `Content` module in `apps/backend`. The generated
client lives at `src/shared/infrastructure/api/generated/116.api.ts`.

---

## 1. Get one article — `getArticleBySlug`

```text
GET /api/v1/public/articles/{slug}
```

- **Auth**: none. **200** article found & published · **404** not found / unpublished ·
  **429** rate limited.
- **Client**: `api.getArticleBySlug(slug: string)` → `{ article: ArticleDetailDto }`.

### `ArticleDetailDto`

The full detail projection. Fields the page uses in **bold**; the rest are admin/SEO/
commerce metadata carried through for `generateMetadata` or ignored.

| Field | Type | Notes |
|---|---|---|
| **`id`** | `string` (Guid) | Used for interaction + comment endpoints |
| **`categoryId`** | `string` | |
| **`categoryName`** | `string` | Category chip / `Tag` |
| **`title`** | `string` | |
| **`slug`** | `string` | |
| **`headline`** | `string` | Teaser under the title |
| **`body`** | `string` | **Rich-text HTML** — sanitized then rendered |
| **`coverImageUrl`** | `string \| null` | Hero image; null → fallback |
| `authorId` | `string` | |
| `status` | `EnumContentStatus` | `Draft \| PendingReview \| Published \| Rejected \| Archived` |
| `rejectionReason` | `string \| null` | admin |
| `socialBoost` / `isPromoted` | `bool` | |
| `promotedUntil` / `promotionLevelId` / `promotionLevelName` | nullable | promotion |
| **`publishedAt`** | `string \| null` (DateTimeOffset) | Meta line date |
| `metaTitle` / `metaDescription` | `string \| null` | **SEO** ([17](17-seo-and-metadata.md)) |
| **`images`** | `ArticleImageDto[]` | Cover + body images |
| **`tags`** | `TagDto[]` | Tag block |
| **`readTimeInMinutes`** | `int` | Server-computed; shown as-is |
| **`likeCount`** | `int` | |
| **`commentCount`** | `int` | |
| **`shareCount`** | `int` | |
| **`bookmarkCount`** | `int` | |
| `customerId` / `customerName` / `orderItemId` | nullable | B2B commerce |
| **`author`** | `AuthorDto \| null` | Avatar + username |
| `createdAt` / `updatedAt` / `createdBy` / `updatedBy` | auditable | |

> **No per-user state.** There is no `isLiked` / `isBookmarked`. Initial like/bookmark
> state is unknown to the client — treated as `false` and driven optimistically, exactly
> as on the feed. Tracked in [19](19-open-questions.md).

### Nested DTOs

```text
ArticleImageDto { id: string; url: string; storageKey: string; imageType: "Cover" | "Body" }
TagDto          { id: string; name: string; slug: string }
AuthorDto       { userName: string; email: string | null; avatarUrl: string | null; role: string | null }
```

---

## 2. Comments

### List — `publicGetArticleComments`

```text
GET /api/v1/public/articles/{id}/comments?pageIndex=0&pageSize=10
```

- **Auth**: none. Paginated.
- **Client**: `api.publicGetArticleComments(id, { pageIndex, pageSize })` →
  `ArticleCommentDtoPaginatedResult`.

```text
ArticleCommentDtoPaginatedResult {
    pageIndex: number; pageSize: number; count: number; items: ArticleCommentDto[]
}
ArticleCommentDto {
    id: string; userId: string; body: string | null; isDeleted: boolean;
    createdAt: string | null; updatedAt: string | null; createdBy: string | null; updatedBy: string | null
}
```

> **The gap.** A comment carries only `userId` — **no username, no avatar, no
> threading, no per-comment likes**. Deleted comments have `body: null`,
> `isDeleted: true`. The UI is designed around an author **projection**
> (`IArticleCommentEntity.author?`) the backend should add; see [12](12-comments.md) and
> [19](19-open-questions.md).

### Add — `publicAddArticleComment`

```text
POST /api/v1/public/articles/{id}/comments        body: { body: string }
```

- **Auth**: required (Visitor). **201** → `{ comment: ArticleCommentDto }`. **400** invalid ·
  **401** unauthenticated · **404** article missing.
- **Client**: `api.publicAddArticleComment(id, { body })`.

### Edit / Delete (deferred UI, endpoints exist)

```text
PUT    /api/v1/public/articles/{id}/comments/{commentId}   body: { body: string }  → { isSuccess }
DELETE /api/v1/public/articles/{id}/comments/{commentId}                            → { isSuccess }
```

- **Auth**: required, owner-only. Clients: `publicEditArticleComment`,
  `publicDeleteArticleComment`. Wired in the domain/repo layer, but no UI in the first cut.

---

## 3. Interactions (like / bookmark / share)

All keyed by **article id**. Like & bookmark require auth; share is anonymous-friendly.

```text
POST   /api/v1/public/articles/{id}/likes       → { isSuccess }   publicLikeArticle(id)
DELETE /api/v1/public/articles/{id}/likes        → { isSuccess }   publicUnlikeArticle(id)
POST   /api/v1/public/articles/{id}/bookmarks    → { isSuccess }   publicBookmarkArticle(id)
DELETE /api/v1/public/articles/{id}/bookmarks    → { isSuccess }   publicUnbookmarkArticle(id)
POST   /api/v1/public/articles/{id}/shares       → { isSuccess }   publicShareArticle(id)
```

- **Like/unlike/bookmark/unbookmark**: `409 Conflict` if already in that state; the
  client toggles reconcile this. These already have repo methods + use cases + hooks
  (`useToggleArticleLike`, `useToggleArticleBookmark`) — **reused unchanged**.
- **Share** takes **no platform parameter** — it records a share event (optional user).
  The chosen platform is client-side context only; `shareArticle(id, platform)` keeps the
  two-arg surface but does not transmit `platform`. Reuses `useShareArticle`.

---

## 4. Popular / related articles (no dedicated endpoint)

There is **no** "most popular articles" endpoint. The sidebar sources from what exists:

```text
GET /api/v1/public/articles/promoted            → { articles: ArticleSummaryDto[] }   getPromotedArticles()
GET /api/v1/public/articles?pageIndex&pageSize  → { articles: <paginated summaries> }  getPublishedArticles(query)
```

Decision ([11](11-popular-articles-sidebar.md)): the sidebar uses **`getPromotedArticles`**
(editorially boosted ≈ "popular"), excluding the current article, falling back to the
first page of `getPublishedArticles`. `ArticleSummaryDto` is the same shape the feed card
already maps (`articleSummaryFromDto`), so the sidebar reuses `IArticleSummaryEntity`.

---

## 5. Method summary (generated client)

| Concern | Method | Returns |
|---|---|---|
| Article by slug | `getArticleBySlug(slug)` | `{ article: ArticleDetailDto }` |
| List comments | `publicGetArticleComments(id, { pageIndex, pageSize })` | `ArticleCommentDtoPaginatedResult` |
| Add comment | `publicAddArticleComment(id, { body })` | `{ comment: ArticleCommentDto }` |
| Edit comment | `publicEditArticleComment(id, commentId, { body })` | `{ isSuccess }` |
| Delete comment | `publicDeleteArticleComment(id, commentId)` | `{ isSuccess }` |
| Like / unlike | `publicLikeArticle(id)` · `publicUnlikeArticle(id)` | `{ isSuccess }` |
| Bookmark / unbookmark | `publicBookmarkArticle(id)` · `publicUnbookmarkArticle(id)` | `{ isSuccess }` |
| Share | `publicShareArticle(id)` | `{ isSuccess }` |
| Popular source | `getPromotedArticles()` · `getPublishedArticles(query)` | summaries |
