# 02 — Architecture

The detail page is a **vertical slice inside the existing `videos` module** — no new
module. It extends the four clean-architecture layers the video feed already uses.

```text
videos/
├── domain/entities/
│   ├── IVideoDetailEntity.ts        ← full video (new)
│   ├── IVideoLyricsEntity.ts        ← lyrics page (new)
│   ├── IPlaylistEntity.ts           ← viewer playlist (new)
│   └── IYoutubeVideoStats.ts        ← external stats (new)
├── application/
│   ├── repositories/videos.repository.port.ts   ← +5 methods
│   └── usecases/                    ← getvideobyslug, getvideolyrics,
│                                       ratevideo, sharevideo,
│                                       getmyplaylists, createplaylist,
│                                       addvideotoplaylist,
│                                       getyoutubevideostats
├── infrastructure/
│   ├── mappers/videos.mapper.ts     ← +4 mapper functions
│   ├── repositories/videos.repository.impl.ts
│   └── dependencies/videos.dependencies.ts
└── presentation/
    ├── constants/videoKeys.ts       ← query keys (new file)
    ├── hooks/                       ← useVideoDetail, useVideoLyrics,
    │                                   useYoutubeStats, useRateVideo,
    │                                   useShareVideo, useMyPlaylists,
    │                                   useAddToPlaylist, useVideoDetailPopular,
    │                                   useSimilarVideos
    ├── notifications/               ← playlist + share + rating configs
    └── components/
        ├── VideoDetail/             ← assembler + sub-composers
        └── VideosPopularSidebar/    ← popular column (own folder, like articles)
```

## Boundaries

- **Domain** knows nothing about YouTube, Plyr, or HTTP. `IYoutubeVideoStats` is a plain
  value shape; where the numbers come from is infrastructure's business.
- **Application** exposes `Result<T>` for every operation; the YouTube stats use case is
  a first-class `IResultUseCase` like any other, so the page treats external data with
  the same failure discipline as backend data.
- **Infrastructure** talks to two transports: the generated `116.api` client (backend)
  and the app's own `/api/youtube/[videoId]` route handler (which holds the YouTube API
  key server-side — the browser never calls Google directly, and the key never ships to
  the client). See [06-youtube-data.md](06-youtube-data.md).

## Shared additions

Two generic primitives are promoted to `shared/presentation/components/ui` because they
are app-wide by nature, not video-specific:

- `Tabs` — radix-based tabs with direction-aware animated panels (motion), used by the
  description/lyrics/similar navigation. See [11-tabs.md](11-tabs.md).
- `Checkbox` — radix checkbox for the playlist modal list.
- `SocialShareGroup` — the brand-colored share buttons (extracted from the article share
  rail's config) rendered through `ButtonGroup`, orientation-aware, so the article rail
  and the video modal share one source of truth. See [08-share-modal.md](08-share-modal.md).

## Route

```text
app/(public)/videos/[slug]/
├── page.tsx        ← async RSC: fetch by slug, notFound(), JSON-LD, metadata
├── loading.tsx     ← streaming skeleton
└── not-found.tsx   ← EmptyState + back to home
```

Same server-first pattern as `/articles/[slug]`: the RSC fetches through the server
cradle, seeds the client container with `initialData`, and the client owns refetches.
