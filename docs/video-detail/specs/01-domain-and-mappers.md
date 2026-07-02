# Spec 01 — Domain Entities & Mappers

Design ref: [../02-architecture.md](../02-architecture.md),
[../03-backend-api-reference.md](../03-backend-api-reference.md). Four new entities in
`videos/domain/entities`, four mapper functions on the existing `VideosMapper`. Reuses
`IVideoTagEntity` and `IVideoSummaryEntity` untouched.

## 1. `IVideoDetailEntity.ts`

```ts
export interface IVideoDetailEntity {
    id: string;
    categoryId: string;
    categoryName: string;
    title: string;
    slug: string;
    description: string;
    thumbnailUrl: string | null;
    youtubeVideoUrl: string | null;
    hasLyrics: boolean;
    tags: IVideoTagEntity[];
    shareCount: number;
    ratingAverage: number;
    ratingCount: number;
    publishedAt: string | null;
    metaTitle?: string;
    metaDescription?: string;
}
```

Drops audit/status/promotion/commerce fields **and the author entirely** (product rule:
no author on this page). JSDoc every property.

## 2. `IVideoLyricsEntity.ts`

`{ id, songTitle, artistName, lyricsText, language }` from `LyricsDto` — author and SEO
fields dropped (lyrics render inside the video page; the lyrics page owns its own SEO).

## 3. `IPlaylistEntity.ts`

`{ id, name, videoCount }` from `PlaylistDto`, 1:1.

## 4. `IYoutubeVideoStats.ts`

`{ viewCount: number | null; likeCount: number | null; commentCount: number | null }` —
null means *hidden/unavailable*, distinct from 0
([../06-youtube-data.md](../06-youtube-data.md)). No DTO on the generated client; the
route handler's JSON is the source shape.

## 5. Mapper functions (`videos.mapper.ts`)

- `videoDetailFromDto(dto: VideoDetailDto): IVideoDetailEntity` — nullables normalized
  (`?? null`), `metaTitle`/`metaDescription` `?? undefined`, counts `?? 0`, tags via the
  existing tag mapper.
- `videoLyricsFromDto(dto: LyricsDto): IVideoLyricsEntity`.
- `playlistFromDto(dto: PlaylistDto): IPlaylistEntity`.
- `youtubeStatsFromJson(json: unknown): IYoutubeVideoStats` — defensive parse of the
  route handler payload; anything non-numeric → null.

Follow the `ArticlesMapper` house style: `as const` object, static pure functions,
`@param`/`@returns` JSDoc, self-references via `VideosMapper.…`.

## Tasks

- [ ] Four entity files created, JSDoc'd, no author fields anywhere.
- [ ] Four mapper functions added to `VideosMapper` with normalization rules above.
- [ ] `tsc` + biome clean.
