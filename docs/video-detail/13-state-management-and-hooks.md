# 13 — State Management & Hooks

TanStack Query end to end, mirroring the article detail's discipline: every hook wraps a
use case, unwraps `Result`, and either throws the typed `Failure` (primary data) or
degrades to an empty value (supplementary data).

## Query keys — `presentation/constants/videoKeys.ts` (new)

```text
videoKeys.all                         ["videos"]
videoKeys.detail(slug)                [..., "detail", slug]
videoKeys.lyrics(videoId)             [..., "detail", videoId, "lyrics"]
videoKeys.similar(videoId)            [..., "similar", videoId]
videoKeys.popular(videoId)            [..., "popular", videoId]
videoKeys.youtubeStats(youtubeId)     [..., "youtube", youtubeId]
videoKeys.myPlaylists                 [..., "playlists", "mine"]
```

## Queries

| Hook | Wraps | Failure policy | Gating |
|---|---|---|---|
| `useVideoDetail(slug, { initialData })` | `getVideoBySlugUseCase` | dummy fallback (phase) / error view | hydrated by RSC |
| `useYoutubeStats(youtubeId)` | `getYoutubeVideoStatsUseCase` | null-shape → chips hide | `enabled: !!youtubeId`, `staleTime` 5 min |
| `useVideoLyrics(videoId, enabled)` | `getVideoLyricsUseCase` | 404/failure → lyrics empty state | Lyrics tab opened && `hasLyrics` |
| `useSimilarVideos(categoryId, videoId, enabled)` | `getPublishedVideosUseCase` | `[]` | Similar tab opened |
| `useVideoDetailPopular(videoId)` | promoted → published fallback | `[]` | mount |
| `useMyPlaylists(enabled)` | `getMyPlaylistsUseCase` | `[]` + modal error line | modal open && authed |

## Mutations

| Hook | Wraps | Optimistic / follow-up |
|---|---|---|
| `useShareVideo(videoId, slug)` | `shareVideoUseCase` | fire-and-forget; `shareCount + 1` on the cached detail (`videoKeys.detail(slug)`), failure swallowed |
| `useRateVideo(videoId, slug)` | `rateVideoUseCase` | auth-gated via `useRequireAuth`; success toast + invalidate detail (server recomputes average); error toast keeps prior stars |
| `useCreatePlaylist()` | `createPlaylistUseCase` | append to cached `myPlaylists`, auto-select in the modal |
| `useAddToPlaylist(videoId)` | `addVideoToPlaylistUseCase` × selected ids | `Promise.all` of `Result`s; success/partial/error toasts; invalidate `myPlaylists` |

## Local state

- Active tab (`useState`, default `description`) — also drives lazy query `enabled`.
- Share/playlist modal `open` booleans, playlist selection `Set<string>` — all local to
  the assembler/modals; nothing global.

## Dummy-data phase

Same seams as articles: `video-detail.dummy.ts` provides a deterministic
`dummyVideoDetail(slug)` (reusing the feed dummies so a clicked card and the landing
page agree), `dummyLyrics`, `dummyPlaylists`, and popular/similar slices. Fallbacks live
in the hooks/route exactly like the article page's, each documented with a
"Dummy-data phase" JSDoc note for later removal.
