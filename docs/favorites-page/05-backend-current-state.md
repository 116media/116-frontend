# 05 — Backend Current State

## Implemented reads

```text
GET /api/v1/public/articles/bookmarks?pageIndex&pageSize
GET /api/v1/public/articles/commented?pageIndex&pageSize
GET /api/v1/public/articles/liked?pageIndex&pageSize
GET /api/v1/public/articles/shared?pageIndex&pageSize
GET /api/v1/public/articles/{articleId}/comments?pageIndex&pageSize
GET /api/v1/public/articles/{articleId}/comments/mine?pageIndex&pageSize
GET /api/v1/public/comments/{commentId}/replies?pageIndex&pageSize
GET /api/v1/public/videos/rated?pageIndex&pageSize
GET /api/v1/public/videos/shared?pageIndex&pageSize
GET /api/v1/public/shorts/bookmarked?pageIndex&pageSize
GET /api/v1/public/shorts/liked?pageIndex&pageSize
GET /api/v1/public/shorts/shared?pageIndex&pageSize
GET /api/v1/public/playlists
GET /api/v1/public/playlists/{id}
```

Article bookmarks now return `UserBookmarkedArticleDto`, preserving the bookmark timestamp.
Commented articles return the latest remaining current-user comment and own comment count;
`comments/mine` provides the lazy drawer read without loading the public thread.

Playlist summaries include up to four ordered nullable thumbnail slots resolved in one batch.
Playlist detail includes slug, category, publication, rating, sort-order, and thumbnail fields.
Rated/shared video and liked/bookmarked/shared short reads expose current-user activity metadata.

## Existing mutations that can be reused

| Requirement | Backend | Frontend |
|---|:---:|:---:|
| Edit own article comment | yes, ownership checked | repository/use case/hook exists |
| Soft-delete own comment | yes, ownership checked | repository/use case/hook exists |
| Unbookmark article | yes | toggle hook exists |
| Rename/delete playlist | yes | generated client only; data/UI wiring missing |
| Remove video from playlist | yes | generated client only; data/UI wiring missing |
| Re-rate video 1–5 | yes, upsert | `VideoRatingModal` + hook exist |
| Unsave short | yes | toggle hook exists |

## Persisted data

- Article/short bookmark rows have `CreatedAt`, sufficient for “Bookmarked/Saved on”.
- Comments contain body, parent id, user id, soft-delete state, and audit timestamps.
- Video ratings are unique per user/video and can update stars.
- Article/video/short shares are event rows with nullable user id; article/video store optional
  channel, short shares do not.
- Playlist junctions preserve `SortOrder`; video records have thumbnail file ids.

## Remaining gaps

- Regenerate `116.api.ts` so the frontend can consume the implemented operations and wrappers.
- Build frontend repositories, use cases, query hooks, panels, route shell, and account menu entry.
- Migrate the legacy `/bookmarks` consumer to the bookmark wrapper before redirecting it.
- Run production-volume query-plan inspection during rollout; functional repository and endpoint
  coverage is already present.

## Verification snapshot

- Solution build: 0 warnings, 0 errors.
- Unit suite: 6,173 passed, 0 failed, 3 skipped.
- Integration suite: 1,404 passed, 0 failed.
- Migration: `20260718225835_AddFavoriteCollectionReadIndexes`.
