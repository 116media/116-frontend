# 04 — Domain Entities & Mappers

How interaction data lands in frontend domain entities: the **counts** and **per-user
flags** that ride on content read DTOs, plus the **comment** entities that model the
thread. No interaction has a standalone "like entity" on the frontend — a like is a boolean
result plus a count on the parent.

---

## Counts and flags on content entities

### Articles

`IArticleDetailEntity` carries the full interaction surface:

| Field | Type | Source |
|---|---|---|
| `likeCount` | `number` | denormalized on the article |
| `commentCount` | `number` | denormalized on the article |
| `shareCount` | `number` | denormalized on the article |
| `bookmarkCount` | `number` | denormalized on the article |
| `isLiked` | `boolean` | per-viewer (false when anonymous) |
| `isBookmarked` | `boolean` | per-viewer (false when anonymous) |

`IArticleSummaryEntity` (feed cards) carries the counts (`likeCount`, `commentCount`,
`shareCount`, `bookmarkCount?`) but **no per-user flags** — a feed card shows counts, and
its like/bookmark toggles seed `initialOn = false`.

### Videos

`IVideoDetailEntity` / `IVideoSummaryEntity` carry only:

| Field | Type |
|---|---|
| `shareCount` | `number` |
| `ratingAverage` | `number` (1–5, 2 dp) |
| `ratingCount` | `number` |

There is **no** `likeCount` / `commentCount` / `bookmarkCount` and **no** per-user flag on
video entities — full videos support only share + rating, and neither exposes a readable
per-user state (`ratingAverage` is an aggregate; there is no `myRating`).

> **Do not add `isLiked`/`hasRated` to video entities.** The backend never sends them.
> The `likes`/`comments` numbers in the video **scoreboard** are YouTube-derived stats
> (`IYoutubeVideoStats`), a different concern entirely.

---

## Comment entities

Two entities model the article comment thread.

### `IArticleCommentEntity`

One comment or reply:

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | UUID |
| `userId` | `string` | commenter identity UUID — drives the "is this mine?" check |
| `body` | `string \| null` | null when the comment is soft-deleted |
| `isDeleted` | `boolean` | soft-delete tombstone flag |
| `createdAt` | `string \| null` | ISO |
| `author` | `IArticleAuthor?` | `{ userName, avatarUrl?, role? }`; null when deleted |

**To add** for the deferred comment completion (see [06](06-comments.md)):

| Field | Type | Notes |
|---|---|---|
| `parentCommentId` | `string \| null` | null = top-level; set = a reply |
| `replyCount` | `number` | non-deleted direct replies |
| `likeCount` | `number` | comment likes |
| `isLiked` | `boolean` | per-viewer comment-like flag |

### `IArticleCommentPage`

One page of the comment (or replies) list:

```text
items: IArticleCommentEntity[]
pageIndex: number      // 0-based
pageSize: number
count: number          // total across all pages
hasNextPage: boolean   // derived by the mapper from count
```

`hasNextPage` is derived in the mapper as `(pageIndex + 1) * pageSize < count`, the same
pattern as every other paged entity in the app.

---

## Mapper responsibilities

Mappers convert API DTOs to the entities above. The rules that matter for interactions:

- **Nullable normalization.** `body`, `createdAt`, `avatarUrl` normalize `undefined → null`.
- **Author projection.** `AuthorDto → IArticleAuthor` drops the always-null `email`.
- **Flag defaults.** `isLiked` / `isBookmarked` default to `false` — the mapper never
  invents a per-user state the DTO didn't carry.
- **List helper.** `commentListFromDto` maps `items`; `commentPageFromDto` wraps it with the
  derived `hasNextPage` (never call `.map(Mapper.x)` at a call site).
- **Deleted comments.** A tombstone (`isDeleted: true`, `body: null`, `author: null`) maps
  straight through — the UI decides how to render it (a muted "comment deleted" row).

The concrete mapper functions and their JSDoc are in
[specs/01-domain-and-mappers.md](specs/01-domain-and-mappers.md).

---

## What the frontend never models

- **Like / bookmark / share / rating "rows".** These are backend entities
  (`ArticleLikeEntity`, `VideoRatingEntity`, …). The frontend only ever sees the resulting
  boolean/aggregate on the content entity.
- **Short-video entities.** Not modeled; the short-video content type doesn't exist on the
  frontend.
