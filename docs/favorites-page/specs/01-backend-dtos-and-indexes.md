# 01 — Backend DTOs & Indexes

## DTOs

Add the exact wrappers from [backend contracts](../06-backend-required-contracts.md):

```text
UserBookmarkedArticleDto(ArticleSummaryDto Article, DateTimeOffset BookmarkedAt)
UserCommentedArticleDto(ArticleSummaryDto Article, ArticleCommentDto LatestComment,
                        int CommentCount, DateTimeOffset LastCommentedAt)
UserArticleActivityDto(ArticleSummaryDto Article, DateTimeOffset LastInteractedAt,
                       int InteractionCount, EnumShareChannel? LastShareChannel)
UserVideoActivityDto(VideoSummaryDto Video, DateTimeOffset LastInteractedAt,
                     int InteractionCount, short? RatedStars,
                     EnumShareChannel? LastShareChannel)
UserShortVideoActivityDto(ShortVideoDto ShortVideo, DateTimeOffset LastInteractedAt,
                          int InteractionCount)
```

Extend `PlaylistDto` with zero-to-four ordered `ThumbnailUrls`. Extend
`VideoInPlaylistDto` with `Slug`, `CategoryName`, and `PublishedAt`.

## Index migration

```text
ArticleComments   (UserId, IsDeleted, CreatedAt DESC, ArticleId)
ArticleShares     (UserId, CreatedAt DESC, ArticleId) WHERE UserId IS NOT NULL
VideoShares       (UserId, CreatedAt DESC, VideoId) WHERE UserId IS NOT NULL
ShortVideoShares  (UserId, CreatedAt DESC, ShortVideoId) WHERE UserId IS NOT NULL
```

Reuse existing user-first unique indexes for article likes/bookmarks, video ratings, and short
likes/bookmarks. Confirm representative query plans before adding redundancy.

## Tasks

- [x] Add wrappers and schema/handler tests for required activity fields and rating values.
- [x] Extend playlist summary/detail DTOs additively.
- [x] Add the four indexes through `20260718225835_AddFavoriteCollectionReadIndexes`.
- [x] Verify the additive migration does not rewrite interaction rows.
- [x] Document the bookmark response compatibility requirement.
