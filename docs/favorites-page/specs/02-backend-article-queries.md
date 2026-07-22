# 02 — Backend Article Queries

## Repository surface

```text
GetBookmarkedArticleActivityAsync(userId, pageIndex, pageSize, ct)
GetCommentedArticlesAsync(userId, pageIndex, pageSize, ct)
GetLikedArticlesAsync(userId, pageIndex, pageSize, ct)
GetSharedArticlesAsync(userId, pageIndex, pageSize, ct)
GetMyCommentsForArticleAsync(userId, articleId, pageIndex, pageSize, ct)
```

## Rules

- Bookmarks project bookmark `CreatedAt` with the published article summary.
- Commented filters deleted rows, includes top-level comments and replies, groups by article,
  returns count plus the complete latest `ArticleCommentDto`, and counts distinct articles.
- My-comments returns only the principal's non-deleted rows for one published article, newest
  first. Parent id is required; optional parent preview may be projected without revealing
  inaccessible/deleted content.
- Likes return active user/article rows.
- Shares group authenticated current-user events, exposing own count/latest time/channel.
- All collection queries use stable secondary ordering and batched summary interaction stamping.

## Existing mutation reuse

Do not add edit/delete commands. Existing handlers already verify ownership and soft-delete. Add
integration coverage proving their effects are reflected in the new grouped/detail queries,
especially deletion of the last own comment.

## Tasks

- [x] Implement five SQL-translatable, cancellation-aware repository reads.
- [x] Add authenticated handlers; never accept a client user id.
- [x] Test reply inclusion, deleted exclusion, preview selection, distinct totals, and pagination.
- [x] Test deletion effects, including last-comment collection removal.
- [x] Verify cross-user comments cannot enter either response.
