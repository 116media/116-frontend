# Spec 09 — `VideoDetailLyrics` cross-link to the standalone page

Per [../05-open-questions.md](../05-open-questions.md) question 5: the embedded lyrics tab on a
video's detail page gains a "View full lyrics" link to the new standalone `/lyrics/{slug}` page.
This is the one place this feature touches the `videos` module — everything else about
`VideoDetailLyrics` / `IVideoLyricsEntity` is unchanged.

Depends on spec 01 (`LyricsDto.Slug`) having shipped — `GetLyricsByVideoIdHandler`'s response
already carries it once that lands, no further backend change needed here.

---

## Domain entity

**`src/modules/videos/domain/entities/IVideoLyricsEntity.ts`** (add one field)

```ts
/**
 * IVideoLyricsEntity
 *
 * @description
 * Domain entity representing the lyrics linked to a video, rendered inside the
 * detail page's lyrics tab. Maps from LyricsDto — drops the author and SEO fields,
 * which belong to the standalone lyrics page, not this embedded view. Carries slug
 * so this view can link out to that standalone page.
 *
 * @interface IVideoLyricsEntity
 *
 * @property {string} id - Unique identifier (UUID)
 * @property {string} slug - Unique slug for the standalone lyrics page
 * @property {string} songTitle - Title of the song the lyrics belong to
 * @property {string} artistName - Performing artist's display name
 * @property {string} lyricsText - Full lyrics body (plain text with line breaks)
 * @property {string} language - Language the lyrics are written in
 */
export interface IVideoLyricsEntity {
    id: string;
    slug: string;
    songTitle: string;
    artistName: string;
    lyricsText: string;
    language: string;
}
```

## Mapper

**`src/modules/videos/infrastructure/mappers/videos.mapper.ts`** (relevant excerpt —
`videoLyricsFromDto` only)

```ts
/**
 * Maps LyricsDto to IVideoLyricsEntity domain entity.
 * Drops the author and SEO fields — lyrics render embedded in the video
 * detail page, where the standalone lyrics page owns its own SEO.
 *
 * @param dto - Lyrics data from API
 * @returns {IVideoLyricsEntity} Mapped video lyrics entity
 */
videoLyricsFromDto(dto: LyricsDto): IVideoLyricsEntity {
    return {
        id: dto.id,
        slug: dto.slug,
        songTitle: dto.songTitle,
        artistName: dto.artistName,
        lyricsText: dto.lyricsText,
        language: dto.language
    };
},
```

## Component

**`src/modules/videos/presentation/components/sections/VideoDetailLyrics/VideoDetailLyrics.tsx`**
(relevant excerpt — `render` prop only; everything else in the file is unchanged)

```tsx
import Link from "next/link";

// ...
render={(lyrics) => (
    <div className="flex flex-col gap-4">
        <div>
            <h3 className="font-bold text-foreground text-xl">{lyrics.songTitle}</h3>
            <p className="text-muted-foreground text-sm">
                {t("videos.detail.lyrics.by")} {lyrics.artistName}
            </p>
        </div>
        <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
            {lyrics.lyricsText}
        </p>
        <Link
            href={`/lyrics/${lyrics.slug}`}
            className="text-primary text-sm hover:underline"
        >
            {t("videos.detail.lyrics.viewFullLyrics")}
        </Link>
    </div>
)}
```

## i18n

**`src/modules/videos/presentation/i18n/locales/fr/video-detail.ts`** (add one key to the existing
`detail.lyrics` object — exact current shape shown, only `viewFullLyrics` is new)

```ts
lyrics: {
    by: "Par",
    empty: "Aucunes paroles disponibles pour cette vidéo.",
    viewFullLyrics: "Voir les paroles complètes"
}
```

**`src/modules/videos/presentation/i18n/locales/en/video-detail.ts`** (mirror)

```ts
lyrics: {
    by: "By",
    empty: "No lyrics available for this video.",
    viewFullLyrics: "View full lyrics"
}
```

## Task checklist

- [ ] Add `slug` to `IVideoLyricsEntity`.
- [ ] Update `VideosMapper.videoLyricsFromDto` to map `slug: dto.slug`.
- [ ] Add the "View full lyrics" link to `VideoDetailLyrics.tsx`.
- [ ] Add `videos.detail.lyrics.viewFullLyrics` to both locales.
- [ ] `tsc --noEmit` clean.
- [ ] `biome check` clean.
- [ ] Open a video detail page whose lyrics tab has linked lyrics; confirm "View full lyrics"
  renders and navigates to the correct `/lyrics/{slug}`.
- [ ] Confirm the rest of the lyrics tab (song title, artist, text, empty/loading states) is
  unregressed.
