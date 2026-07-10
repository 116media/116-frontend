# Spec 03 — Hooks, Keys, Notifications & Dummies

Design ref: [../13-state-management-and-hooks.md](../13-state-management-and-hooks.md).

## 1. `presentation/constants/videoKeys.ts` (new)

```ts
export const videoKeys = {
    all: ["videos"] as const,
    detail: (slug: string) => [...videoKeys.all, "detail", slug] as const,
    lyrics: (videoId: string) => [...videoKeys.all, "detail", videoId, "lyrics"] as const,
    similar: (videoId: string) => [...videoKeys.all, "similar", videoId] as const,
    popular: (videoId: string) => [...videoKeys.all, "popular", videoId] as const,
    youtubeStats: (youtubeId: string) => [...videoKeys.all, "youtube", youtubeId] as const,
    myPlaylists: ["videos", "playlists", "mine"] as const
};

export const SIMILAR_VIDEOS_LIMIT = 3;
export const POPULAR_VIDEOS_LIMIT = 5;
```

## 2. Query hooks (`presentation/hooks/`)

- `useVideoDetail(slug, { initialData })` — `useQuery`, throws nothing in dummy phase:
  failed result → `dummyVideoDetail(slug)` (mirrors `useArticleDetail`).
- `useVideoLyrics(videoId, enabled)` — `useQuery`, `enabled`, failure → dummy lyrics in
  dummy phase / rethrow-as-empty policy per
  [../14-loading-empty-error.md](../14-loading-empty-error.md).
- `useSimilarVideos(categoryId, currentVideoId, enabled)` — published page
  (`pageSize: SIMILAR_VIDEOS_LIMIT + 1`, `categoryId`), exclude current, slice 3;
  failure/empty → dummy slice.
- `useVideoDetailPopular(currentVideoId)` — promoted → published fallback, exclude,
  cap 5; failure/empty → dummy slice (thumbnails required).
- `useYoutubeStats(youtubeId)` — `enabled: !!youtubeId`, `staleTime: 300_000`;
  failure → all-null stats (chips hide).
- `useMyPlaylists(enabled)` — failure surfaces as `isError` for the modal's inline
  retry line; **no dummy fallback when authenticated** (real account data), dummy list
  only in dummy phase for guests-after-login preview.

## 3. Mutation hooks

- `useShareVideo(videoId, slug)` — fire-and-forget use case; optimistic
  `shareCount + 1` via `setQueryData(videoKeys.detail(slug))`; failures swallowed.
- `useRateVideo(videoId, slug)` — `useRequireAuth`-gated `submit(stars)`; success →
  `ratingSuccessNotification` toast + invalidate `videoKeys.detail(slug)`; error →
  `ratingFailedNotification`.
- `useCreatePlaylist()` — success appends to cached `myPlaylists` and returns the
  entity for auto-select.
- `useAddToPlaylist(videoId)` — `submit(selections: IPlaylistEntity[])` fans out the
  use case with `sortOrder: playlist.videoCount`; aggregates results; success/partial
  toasts from `playlist.notification.ts`; invalidates `myPlaylists`.

## 4. Notifications (`presentation/notifications/`)

`rating.notification.ts` (success/failed), `playlist.notification.ts` (addedSuccess
with `{ count }`, addFailed, createdSuccess), `share.notification.ts` (linkCopied —
video-scoped copy). All `(t) => INotificationConfig`, copy from `videos.detail.*`.

## 5. Dummies (`presentation/data/video-detail.dummy.ts`)

Deterministic, SSR-safe (no `Math.random`/`Date.now`), seeded from the existing feed
dummy generators so clicked card ↔ landing page agree: `dummyVideoDetail(slug)` (real
public-domain YouTube url so the player and stats work; ~500-char description; 4 tags;
`hasLyrics: true`), `dummyVideoLyrics`, `dummyPlaylists (3)`,
`dummyPopularVideos(excludeId)`, `dummySimilarVideos(excludeId)`. Each fallback JSDoc'd
with the "Dummy-data phase" note.

## Tasks

- [ ] Keys + limits file; all six queries + four mutations per policies above.
- [ ] Three notification config files, i18n-resolved copy only.
- [ ] Dummy module wired into every fallback seam.
- [ ] `tsc` + biome clean.
