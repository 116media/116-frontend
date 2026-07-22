# 12 — Liked Articles

## Definition

Show every currently published article with an active `ArticleLikeEntity` for the current
user, newest like first.

## Backend

The unique `(UserId, ArticleId)` index already supports ownership and lookup. Add a
paginated read joining likes to published articles and ordered by like `CreatedAt DESC`.
The returned summary must carry `isLiked = true` and the viewer's current
`isBookmarked` value.

## UI and mutation coherence

- Reuse `ArticlesGrid` and `ArticleCard.Feed`.
- Unlike from any surface removes the article from this cached collection.
- A new like invalidates or prepends to the Liked collection only if that collection has
  been fetched; do not eagerly fetch it for cache maintenance.
- Aggregate `likeCount` still comes from `ArticleSummaryDto`.

## Current blocker

The backend can test a single article's like and stamp flags on known article pages, but
has no endpoint that enumerates all liked articles for a user.
