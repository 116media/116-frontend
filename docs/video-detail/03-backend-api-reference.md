# 03 — Backend API Reference

Every endpoint the page consumes, as exposed by the generated client
(`src/shared/infrastructure/api/generated/116.api.ts`). Method names below are the
generated client methods.

## 1. Video by slug

`getVideoBySlug(slug)` — `GET /api/v1/public/videos/{slug}` →
`PublicGetVideoBySlugResponse { video: VideoDetailDto }`. 404 for unknown/unpublished.

`VideoDetailDto` fields the page consumes:

| Field | Use |
|---|---|
| `id`, `categoryId`, `categoryName`, `title`, `slug` | identity + header |
| `description` | Description tab (plain text) |
| `thumbnailUrl?` | player poster, OG image |
| `youtubeVideoUrl?` | player source + YouTube stats id (nullable!) |
| `hasLyrics` | gates the Lyrics tab |
| `publishedAt?` | relative date, JSON-LD |
| `metaTitle?`, `metaDescription?` | SEO |
| `tags: TagDto[]` | tag pills |
| `shareCount`, `ratingAverage`, `ratingCount` | header stats |

Dropped at the mapper: audit fields, `authorId`/`author` (page shows no author), status,
rejection, promotion, commerce, and `shootingScheduledAt`.

## 2. Lyrics

`getLyricsByVideoId(videoId)` — `GET /api/v1/public/lyrics/videos/{videoId}` →
`{ lyrics: LyricsDto }`; **404 when the video has no lyrics** (treat as empty, not an
error — the tab is already gated by `hasLyrics`). Consumed: `songTitle`, `artistName`,
`lyricsText` (plain text with newlines), `language`.

## 3. Interactions

- `publicShareVideo(id)` — `POST /api/v1/public/videos/{id}/share` → `{ isSuccess }`.
  Anonymous OK. No payload: the platform label is client-side context only.
- `publicRateVideo(id, { stars })` — `POST /api/v1/public/videos/{id}/ratings`,
  `stars` 1–5 → `{ isSuccess }`. **Auth required**; invalid stars → 400.

## 4. Playlists (all auth-required)

- `publicGetMyPlaylists()` — `GET /api/v1/public/playlists` → `PlaylistDto[]`
  (`id`, `name`, `videoCount`).
- `publicCreatePlaylist({ name })` — `POST /api/v1/public/playlists` →
  `{ playlist: PlaylistDto }`.
- `publicAddVideoToPlaylist(playlistId, { videoId, sortOrder })` —
  `POST /api/v1/public/playlists/{id}/videos` → `{ isSuccess }`. `sortOrder` appends:
  pass the playlist's `videoCount` as the next index.

## 5. Video lists (popular sidebar + similar tab sources)

- `getPromotedVideos()` — `GET /api/v1/public/videos/promoted` →
  `{ videos: VideoSummaryDto[] }`.
- `getPublishedVideos({ pageIndex, pageSize, search?, categoryId? })` — paginated
  `VideoSummaryDto`. **Note: no `tagSlug` filter for videos** (unlike articles).

**There is no popular-videos endpoint and no similar-videos endpoint.** Both surfaces
are derived client-side:

- *Popular*: promoted videos first (editorial signal), published fallback, current video
  excluded, capped at 5 — the same interim strategy the articles sidebar used before the
  backend shipped `GET /articles/popular`. A `GET /videos/popular` twin (weighted
  engagement rank, `limit`/`excludeId`) is the requested backend follow-up — see
  [18-open-questions.md](18-open-questions.md).
- *Similar*: first page of `getPublishedVideos({ categoryId })` for the current video's
  category, current video excluded, capped at 3.

## 6. External: YouTube Data API v3

Not a backend endpoint — see [06-youtube-data.md](06-youtube-data.md). Consumed through
the app's own route handler so the API key stays server-side:
`GET /api/youtube/{youtubeId}` → `{ viewCount, likeCount, commentCount } | null`.

## 7. Rate limiting

All public endpoints can return `429 ProblemDetails`; `ProblemMapper.toFailure` already
maps it (with `retryAfter`) and every hook surfaces it as a typed `Failure`.
