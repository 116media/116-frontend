# 06 — YouTube Data (views · likes · comments)

The header shows live YouTube statistics for the embedded video: **view count, like
count, comment count**. These come from the **YouTube Data API v3** — not our backend —
via `GET https://www.googleapis.com/youtube/v3/videos?part=statistics&id={id}&key={key}`.

## Key handling: a server route, never the browser

The API key must not ship to the client. A Next **route handler** proxies the call:

```text
app/api/youtube/[videoId]/route.ts
    GET → statistics for one video id
    reads process.env.YOUTUBE_API_KEY   (server-only, no NEXT_PUBLIC_)
    → 200 { viewCount, likeCount, commentCount }
    → 200 null-shape when the key is absent, the id is unknown,
      or Google errors (stats are decorative — never break the page)
```

- The handler caches per id (`revalidate`-style caching or in-handler cache headers,
  ~5 minutes) so a hot video doesn't burn quota per pageview.
- Google omits `likeCount`/`commentCount` when the channel hides them — each field maps
  to `number | null` rather than defaulting to 0 (0 and "hidden" are different facts).
- Quota: `videos.list` costs 1 unit; the default 10k/day quota comfortably covers the
  traffic with the 5-minute cache in front.

## Through the architecture (not a bare fetch in a component)

External data flows through the same hexagon as backend data:

- `IYoutubeVideoStats` domain entity: `{ viewCount: number | null; likeCount: number |
  null; commentCount: number | null }`.
- Port method `getYoutubeStats(youtubeId): Promise<Result<IYoutubeVideoStats>>` on the
  videos repository; the impl `fetch`es the internal `/api/youtube/{id}` route and maps
  failures through `ProblemMapper.toFailure`-compatible failure values.
- `GetYoutubeVideoStatsUseCase` + `useYoutubeStats(youtubeId)` query hook
  (`videoKeys.youtubeStats(youtubeId)`, `staleTime` 5 min, `enabled: !!youtubeId`).

## Display

- Counts render through the shared `formatCount` (1 532 → "1.5K").
- Views pair with `EyeIcon`, likes with the existing `ThumbsUp`-style glyph (barrel
  addition), comments with `MessageSquareIcon`.
- **Graceful absence**: while loading, small skeleton chips; when a field is null or the
  whole result failed, that chip simply doesn't render. YouTube being down must never
  degrade the page beyond missing numbers.

## Dummy-data phase

When `youtubeVideoUrl` is a real URL the stats are real even in dummy mode (the route
handler works regardless of backend state). When the key is unset locally, the null
shape hides the chips — documented in `.env.example` as `YOUTUBE_API_KEY=`.
