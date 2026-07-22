# 04 — Backend Endpoints & Tests

## HTTP surface

```http
GET /api/v1/public/articles/bookmarks?pageIndex=0&pageSize=12
GET /api/v1/public/articles/commented?pageIndex=0&pageSize=12
GET /api/v1/public/articles/liked?pageIndex=0&pageSize=12
GET /api/v1/public/articles/shared?pageIndex=0&pageSize=12
GET /api/v1/public/articles/{articleId}/comments/mine?pageIndex=0&pageSize=20
GET /api/v1/public/videos/rated?pageIndex=0&pageSize=12
GET /api/v1/public/videos/shared?pageIndex=0&pageSize=12
GET /api/v1/public/shorts/bookmarked?pageIndex=0&pageSize=12
GET /api/v1/public/shorts/liked?pageIndex=0&pageSize=12
GET /api/v1/public/shorts/shared?pageIndex=0&pageSize=12
```

The bookmark route received the coordinated wrapper response upgrade. Playlist list and detail
routes received additive DTO fields. Nine operations were added: eight collection reads that were
previously missing plus current-user article comments.

## Response requirements

- `401` anonymous; existing forbidden behavior for inactive/unauthorized principals.
- `400` invalid pagination/id with standard problem details.
- `404` inaccessible/nonexistent article for `comments/mine` without leaking which condition.
- `200` empty page for a valid collection with no rows.
- No user id in any route/query/body.

## Tasks

- [x] Add nine authenticated endpoints/operations and upgrade bookmark/list playlist schemas.
- [x] Add endpoint metadata and response/problem schemas.
- [x] Test auth, validation, empty results, ownership, publication/activity filters, and pagination.
- [x] Use cross-user fixtures for comments, shares, ratings, playlists, and short interactions.
- [ ] Inspect grouped query and playlist collage query plans with production-like volumes.
