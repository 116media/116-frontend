# 03 — Backend API Reference

Every public interaction endpoint, grouped by kind. All live under the Content module's
`Interactions` submodule (`apps/backend/.../Application/Interactions`). The base prefix is
`/api/v1/public`; the generated client method name is in the last column.

## Conventions

- **Auth** — `Visitor` means an authenticated user with the Visitor role (401 without a
  token, 403 with the wrong role). `anon` means `AllowAnonymous`.
- **Rate limit** — every interaction endpoint uses the `ContentBrowsing` fixed-window
  policy.
- **Envelope** — mutations return `{ "isSuccess": true }` unless noted. Comment/reply
  creation returns **201 Created** with a `Location` header and the created DTO.
- **`CurrentUserId`** — extracted from the `NameIdentifier` claim. Anonymous-capable
  endpoints read it only when a valid token is present and pass `null` otherwise.

---

## Likes

| Method | Path | Auth | Body | Response | Client method |
|---|---|---|---|---|---|
| POST | `/public/articles/{id}/likes` | Visitor | — | `{ isSuccess }` | `publicLikeArticle` |
| DELETE | `/public/articles/{id}/likes` | Visitor | — | `{ isSuccess }` | `publicUnlikeArticle` |
| POST | `/public/shorts/{id}/likes` | Visitor | — | `{ isSuccess }` | `publicLikeShortVideo` |
| DELETE | `/public/shorts/{id}/likes` | Visitor | — | `{ isSuccess }` | `publicUnlikeShortVideo` |
| POST | `/public/articles/comments/{commentId}/likes` | Visitor | — | `{ isSuccess }` | `publicLikeArticleComment` |
| DELETE | `/public/articles/comments/{commentId}/likes` | Visitor | — | `{ isSuccess }` | `publicUnlikeArticleComment` |

**Rules.** Article like: **409** if already liked, **400** if unliking when not liked, 404
if the article is missing. Comment like: **idempotent** — liking twice returns success with
no change (no 409); 404 if the comment is missing or soft-deleted. There is **no toggle
endpoint** — the caller chooses POST vs DELETE from the intended next state.

---

## Comments (articles only)

| Method | Path | Auth | Body | Response | Client method |
|---|---|---|---|---|---|
| GET | `/public/articles/{id}/comments?pageIndex&pageSize` | anon | — | `PaginatedResult<ArticleCommentDto>` | `publicGetArticleComments` |
| POST | `/public/articles/{id}/comments` | Visitor | `{ body }` | **201** `{ comment }` | `publicAddArticleComment` |
| GET | `/public/articles/comments/{commentId}/replies?pageIndex&pageSize` | anon | — | `PaginatedResult<ArticleCommentDto>` | `publicGetCommentReplies` |
| POST | `/public/articles/{id}/comments/{commentId}/replies` | Visitor | `{ body }` | **201** `{ reply }` | `publicAddCommentReply` |
| PUT | `/public/articles/{id}/comments/{commentId}` | Visitor | `{ body }` | `{ isSuccess }` | `publicEditArticleComment` |
| DELETE | `/public/articles/{id}/comments/{commentId}` | Visitor | — | `{ isSuccess }` | `publicDeleteArticleComment` |

**Rules.**

- **Body**: required, ≤ **1000** chars (400 `CommentBodyRequired` / `CommentBodyTooLong`).
- **Threading is one level.** Replying to a reply → **400 `CannotReplyToReply`**.
- **Ownership.** Edit/delete a comment you don't own → **400 `NotCommentOwner`**.
- **Soft delete.** Delete keeps the row: `body = null`, `author = null`, `isDeleted = true`.
  Deleted comments still appear in the list (as a tombstone) but deleted **replies** are
  omitted from the replies list.
- **Pagination**: `pageIndex` is 0-based, `pageSize` default 10. List includes per-viewer
  `isLiked` (false for anonymous) and `replyCount` (non-deleted direct replies).
- **Author**: `AuthorDto(userName, email?, avatarUrl?, role?)` — email is always null on
  public projections. On *create* the response DTO's author is **not resolved** (the
  frontend fills it from the auth context); on *reply* it **is** resolved.

---

## Bookmarks

| Method | Path | Auth | Body | Response | Client method |
|---|---|---|---|---|---|
| POST | `/public/articles/{id}/bookmarks` | Visitor | — | `{ isSuccess }` | `publicBookmarkArticle` |
| DELETE | `/public/articles/{id}/bookmarks` | Visitor | — | `{ isSuccess }` | `publicUnbookmarkArticle` |
| GET | `/public/articles/bookmarks?pageIndex&pageSize` | Visitor | — | `PaginatedResult<ArticleSummaryDto>` | `publicGetMyArticleBookmarks` |
| POST | `/public/shorts/{id}/bookmarks` | Visitor | — | `{ isSuccess }` | `publicBookmarkShortVideo` |
| DELETE | `/public/shorts/{id}/bookmarks` | Visitor | — | `{ isSuccess }` | `publicUnbookmarkShortVideo` |

**Rules.** **409** if already bookmarked, **400** if unbookmarking when not bookmarked, 404
if the article is missing. `GET .../bookmarks` returns the caller's own bookmarked articles
(auth required) as a paginated summary list — there is **no** short-video "my bookmarks".
There is **no standalone "is this bookmarked?" check** — the `isBookmarked` flag rides on
the article read DTOs.

---

## Shares

| Method | Path | Auth | Body | Response | Client method |
|---|---|---|---|---|---|
| POST | `/public/articles/{id}/shares` | anon | `{ shareChannel? }` | `{ isSuccess }` | `publicShareArticle` |
| POST | `/public/videos/{id}/shares` | anon | `{ shareChannel? }` | `{ isSuccess }` | `publicShareVideo` |
| POST | `/public/shorts/{id}/shares` | anon | `{ shareChannel? }` | `{ isSuccess }` | `publicShareShortVideo` |

**Rules.** All anonymous-allowed. The optional `shareChannel` body is parsed into
`EnumShareChannel` (`Facebook`/`X`/`WhatsApp`/`Clipboard`/`WebShare`, case-insensitive,
unrecognized → ignored) and stored on the `*ShareEntity` (`share_channel` column). **No
deduplication** — every call inserts a share row and increments `shareCount`. 404 if the
content is missing. See [08](08-shares.md).

Related (not a share): **POST `/public/shorts/{id}/views`** (anon, no user id) increments a
short video's `viewCount`.

---

## Ratings (full videos only)

| Method | Path | Auth | Body | Response | Client method |
|---|---|---|---|---|---|
| POST | `/public/videos/{id}/ratings` | Visitor | `{ stars }` | `{ isSuccess }` | `publicRateVideo` |

**Rules.**

- **Upsert.** One rating per `(user, video)` — a second POST **updates** the existing star
  value. The same endpoint handles rate and re-rate.
- **`stars`** — a `short`, validated `1..5` inclusive (400 `InvalidStarRating`).
- **Aggregate recompute.** After the write, the backend recomputes `ratingAverage`
  (rounded to 2 dp) and `ratingCount` and stores them on the video, then invalidates the
  popular-videos cache. The frontend refetches the detail entity to display the new values.
- **No readback.** There is **no** get-own-rating endpoint and **no** `hasRated` / `myRating`
  flag on the video DTO. The frontend cannot show which star the user previously chose.

---

## Where per-user flags come from

Per-user interaction flags are populated **outside** the Interactions submodule, in the
Editorial *read* handlers, by threading `CurrentUserId` through the query:

- `getArticleBySlug`, `getPublishedArticles`, `getPromotedArticles`,
  `getArticlePromotionFeed` → stamp `isLiked` / `isBookmarked` on article DTOs (both false
  for anonymous).
- Comment list / replies handlers → stamp `isLiked` per viewer on `ArticleCommentDto`.
- **Video / short-video DTOs carry no per-user flags** — only aggregate counts.

See [04](04-domain-entities-and-mappers.md) for how these map into frontend entities.
