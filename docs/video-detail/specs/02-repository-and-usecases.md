# Spec 02 — Repository & Use Cases

Design ref: [../02-architecture.md](../02-architecture.md),
[../03-backend-api-reference.md](../03-backend-api-reference.md). Extends
`videos.repository.port.ts` / `videos.repository.impl.ts` and registers eight transient
use cases. Every method returns `Result<T>` via try/catch →
`ok(...)` / `err(ProblemMapper.toFailure(error))`.

## 1. Port additions (`IVideosRepositoryPort`)

```ts
getVideoBySlug(slug: string): Promise<Result<IVideoDetailEntity>>;
getVideoLyrics(videoId: string): Promise<Result<IVideoLyricsEntity>>;
rateVideo(id: string, stars: number): Promise<Result<boolean>>;
shareVideo(id: string, platform: string): Promise<Result<boolean>>;
getMyPlaylists(): Promise<Result<IPlaylistEntity[]>>;
createPlaylist(name: string): Promise<Result<IPlaylistEntity>>;
addVideoToPlaylist(input: IAddVideoToPlaylistInput): Promise<Result<boolean>>;
getYoutubeStats(youtubeId: string): Promise<Result<IYoutubeVideoStats>>;
```

Plus the input contract next to the existing query shapes:
`IAddVideoToPlaylistInput { playlistId: string; videoId: string; sortOrder: number }`.
`shareVideo`'s `platform` is client-side context only (not transmitted), mirroring
`shareArticle`.

## 2. Impl mapping (generated client calls)

| Method | Client call | Unwrap |
|---|---|---|
| `getVideoBySlug` | `this.api.getVideoBySlug(slug)` | `response.data.video` → `videoDetailFromDto` |
| `getVideoLyrics` | `this.api.getLyricsByVideoId(videoId)` | `response.data.lyrics` → `videoLyricsFromDto` |
| `rateVideo` | `this.api.publicRateVideo(id, { stars })` | `response.data.isSuccess` |
| `shareVideo` | `this.api.publicShareVideo(id)` | `response.data.isSuccess` |
| `getMyPlaylists` | `this.api.publicGetMyPlaylists()` | `response.data.map(playlistFromDto)` |
| `createPlaylist` | `this.api.publicCreatePlaylist({ name })` | `response.data.playlist` → `playlistFromDto` |
| `addVideoToPlaylist` | `this.api.publicAddVideoToPlaylist(playlistId, { videoId, sortOrder })` | `isSuccess` |
| `getYoutubeStats` | `fetch("/api/youtube/" + youtubeId)` (internal route, **not** the generated client) | json → `youtubeStatsFromJson`; non-OK → failure |

`getYoutubeStats` resolves the internal route absolutely on the server
(`API`-independent — it only ever runs in the browser because the stats hook is
client-gated; guard with a browser check and return a failure server-side).

## 3. Use cases (`application/usecases/`)

House pattern (interface extending `IResultUseCase`, injected
`{ videosRepository }`, delegating `execute`): `GetVideoBySlugUseCase`,
`GetVideoLyricsUseCase`, `RateVideoUseCase` (input `{ id, stars }`),
`ShareVideoUseCase` (`execute(id, platform)` like `ShareArticleUseCase`),
`GetMyPlaylistsUseCase`, `CreatePlaylistUseCase`, `AddVideoToPlaylistUseCase`,
`GetYoutubeVideoStatsUseCase`.

## 4. Registration

`videos.dependencies.ts` — all eight `asClass(...).transient()` under the existing
Queries/Interactions grouping; `service.locator.ts` `Cradle` gains the eight typed
entries (imports type-only, alphabetized).

## Tasks

- [ ] Port + `IAddVideoToPlaylistInput` added with JSDoc.
- [ ] Impl methods with exact unwraps above; youtube via internal route.
- [ ] Eight use cases in house style; registered in DI + Cradle.
- [ ] `tsc` + biome clean.
