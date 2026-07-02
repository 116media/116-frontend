# 18 — Open Questions & Decisions

Decisions locked for this cut, then the backend gaps that need input or a later phase.

## Decisions

- **No author anywhere** — explicit product requirement; the mapper drops
  `author`/`authorId` so composers can't accidentally render a byline.
- **YouTube key server-side** — stats go through `/api/youtube/[videoId]` with
  `YOUTUBE_API_KEY`; the browser never talks to Google, the key never ships.
- **Stats are decorative** — any YouTube failure hides chips, never errors the page.
- **Share telemetry is platform-blind** — `publicShareVideo` takes no payload; the
  platform label stays client-side context (same as articles).
- **Rating recompute is server-owned** — after `publicRateVideo`, the detail query is
  invalidated rather than optimistically recomputing the average locally.
- **`SocialShareGroup` extraction** — the article rail and the video modal share one
  component; the rail keeps its vertical sticky presentation.
- **Playlist add is fan-out** — one POST per selected playlist; acceptable at the
  expected playlist counts.

## Backend gaps (requested follow-ups)

1. **`GET /api/v1/public/videos/popular`** — twin of the articles endpoint (weighted
   engagement, `limit`, `excludeId`, optional `categoryId`). Until then the sidebar
   approximates with promoted → published.
2. **Similar-videos signal** — either `GET /videos/{id}/similar` or a `tagSlug` filter
   on `getPublishedVideos` so similarity can use shared tags instead of same-category
   recency.
3. **Playlist membership** — `PlaylistDto` carries no "contains this video" flag; the
   modal can't pre-check playlists that already hold the video, and re-adding relies on
   the backend's conflict handling. A `containsVideoId` query param or membership map
   endpoint would fix the UX.
4. **Per-user rating echo** — the DTO has no `myRating`; the stars can't show the
   viewer's own previous rating (only the aggregate). Needs an `IsRatedByMe`/`MyStars`
   projection like the article `isLiked` work.
5. **Video view telemetry** — no `POST /videos/{id}/view`; the backend's own view
   counts (vs YouTube's) aren't tracked. Shorts already have
   `publicRecordShortVideoView` — a long-form twin would align.

## Frontend follow-ups

- Lyrics deep link (`?tab=lyrics`) — trivial once requested; tab state is local today.
- The `/videos` listing route doesn't exist yet ("back to videos" targets
  `VIDEOS_PATH = /videos`); acceptable while the homepage carries the feed, but the 404
  boundary's CTA should be revisited when the listing ships.
