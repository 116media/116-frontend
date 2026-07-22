# 06 — Backend Contracts (Implemented)

Implementation status: **complete as of 2026-07-19**. This document is the contract reference for
generated-client regeneration and frontend work.

All private endpoints derive the user id from the authenticated active Visitor and apply the
ContentBrowsing policy/rate limit.

## Collection reads

| Method | Route | Response |
|---|---|---|
| GET | `/api/v1/public/articles/bookmarks` | paginated bookmarked-article wrapper (contract upgrade) |
| GET | `/api/v1/public/articles/commented` | paginated commented-article wrapper |
| GET | `/api/v1/public/articles/liked` | paginated article activity |
| GET | `/api/v1/public/articles/shared` | paginated article activity |
| GET | `/api/v1/public/articles/{articleId}/comments/mine` | paginated current-user comments |
| GET | `/api/v1/public/videos/rated` | paginated rated-video activity |
| GET | `/api/v1/public/videos/shared` | paginated shared-video activity |
| GET | `/api/v1/public/shorts/bookmarked` | paginated saved-short activity |
| GET | `/api/v1/public/shorts/liked` | paginated liked-short activity |
| GET | `/api/v1/public/shorts/shared` | paginated shared-short activity |

Keep playlist list/detail and mutation routes. Do not add one endpoint that returns every section.

## Exact projections

```text
UserBookmarkedArticleDto {
  article: ArticleSummaryDto
  bookmarkedAt: DateTimeOffset
}

UserCommentedArticleDto {
  article: ArticleSummaryDto
  latestComment: ArticleCommentDto
  commentCount: int
  lastCommentedAt: DateTimeOffset
}

UserArticleActivityDto {
  article: ArticleSummaryDto
  lastInteractedAt: DateTimeOffset
  interactionCount: int
  lastShareChannel?: EnumShareChannel
}

UserVideoActivityDto {
  video: VideoSummaryDto
  lastInteractedAt: DateTimeOffset
  interactionCount: int
  ratedStars?: short
  lastShareChannel?: EnumShareChannel
}

ShortVideoFavoriteDto {
  shortVideo: ShortVideoDto
  interactedAt: DateTime
  interactionCount: int
}

PlaylistDto {
  id: Guid
  name: string
  videoCount: int
  thumbnailUrls: IReadOnlyList<string?> // zero to four slots, playlist order
}
```

Extend `VideoInPlaylistDto` with `Slug`, `CategoryName`, and `PublishedAt` so playlist detail can
render a normal video card/link.

## Query semantics

- Bookmarks project the bookmark row so `CreatedAt` survives mapping.
- Commented groups non-deleted top-level comments and replies by article. It returns the latest
  current-user comment preview and remaining count.
- `comments/mine` returns only that user's non-deleted comments/replies for the specified published
  article, newest first, with parent ids. Optional parent preview may provide reply context.
- Likes/bookmarks/ratings are current state; shares/comments are grouped history.
- Rating activity exposes only the current user's `Stars`; re-rating updates the row and activity
  order using `UpdatedAt ?? CreatedAt`.
- Share `interactionCount` counts only events whose `UserId` matches the current principal.
- Shorts must be active; parent articles/videos must be published.
- Every collection orders by interaction time descending plus content id as a stable tie-breaker.

## Playlist collage projection

For each playlist summary, return at most the first four video thumbnail URLs ordered by
`PlaylistVideo.SortOrder`. A video with no thumbnail contributes `null` so later videos do not shift
into the wrong collage cell. Resolve file URLs in one batched query/projection for the page/list;
do not issue one file repository request per playlist slot. The frontend fills remaining cells to four.

## Compatibility note

Changing `/articles/bookmarks` from a page of `ArticleSummaryDto` to bookmark wrappers is a response
schema change. Coordinate backend, generated client, and frontend in one release. If that endpoint
has consumers outside this repository, publish the wrapper under a new API version and retain v1.

## As-built verification

- Collection reads enforce authenticated current-user ownership and content visibility.
- Share/comment history is grouped per content item; stateful likes/bookmarks/ratings remain one row.
- Playlist thumbnail URL resolution is batched and preserves nullable collage positions.
- Unit and PostgreSQL-backed integration suites cover handlers, repositories, HTTP contracts,
  pagination, filtering, timestamps, grouping, deletion effects, and playlist collage states.
