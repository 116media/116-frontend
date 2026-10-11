# Spec 02 — Domain entities & mapper

The new module's domain shapes and the mapper that produces them from `LyricsDto`. Depends on
specs 01, 10, and 11 having shipped (`slug`, cover/credits fields, and engagement counts all live
on the generated `LyricsDto`) — the shapes below assume the full DTO, not the spec-01-only
version. No callers yet — verifiable in isolation.

---

## Domain entities

**`src/modules/lyrics/domain/entities/ILyricsSummaryEntity.ts`**

```ts
/**
 * ILyricsSummaryEntity
 *
 * @description
 * One row in the public lyrics listing (and the similar-lyrics section — both surfaces
 * share this shape). Deliberately excludes the full lyrics body — only an excerpt — and
 * the SEO fields, which belong to the detail page.
 *
 * @interface ILyricsSummaryEntity
 *
 * @property {string} id - Unique identifier (UUID)
 * @property {string} slug - Unique URL slug for the standalone detail page
 * @property {string} songTitle - Title of the song
 * @property {string} artistName - Performing artist's display name
 * @property {string} language - ISO 639-1 / BCP-47 language code of the lyrics text
 * @property {string} excerpt - First ~120 characters of the lyrics text, for the card preview
 * @property {string | null} coverImageUrl - Cover/album artwork URL, or null when unset
 */
export interface ILyricsSummaryEntity {
    id: string;
    slug: string;
    songTitle: string;
    artistName: string;
    language: string;
    excerpt: string;
    coverImageUrl: string | null;
}
```

**`src/modules/lyrics/domain/entities/ILyricsPage.ts`** — unchanged from the original version
(`{ items: ILyricsSummaryEntity[]; pageIndex; pageSize; count; hasNextPage }`), not reproduced here.

**`src/modules/lyrics/domain/entities/ILyricsDetailEntity.ts`**

```ts
/**
 * The song credit fields requested for the detail page: album, release year, label,
 * songwriter, and producer. All optional — a lot of catalog lyrics won't have complete
 * metadata.
 *
 * @interface ILyricsCredits
 *
 * @property {string | null} album - The album or project this song appears on
 * @property {number | null} releaseYear - The four-digit year the song was released
 * @property {string | null} label - The record label that released the song
 * @property {string | null} songwriter - Who wrote the lyrics, if distinct from the performer.
 * Not to be confused with CMS attribution (see the naming note below)
 * @property {string | null} producer - Who composed the melody, if distinct from the performer
 */
export interface ILyricsCredits {
    album: string | null;
    releaseYear: number | null;
    label: string | null;
    songwriter: string | null;
    producer: string | null;
}

/**
 * ILyricsDetailEntity
 *
 * @description
 * The full standalone lyrics page: content, cover art, song credits, engagement counts,
 * SEO metadata, and an optional linked-video cross-link. Mirrors the shape of the other
 * content modules' detail entities — distinct from the videos module's IVideoLyricsEntity,
 * which is intentionally stripped down for its embedded, in-tab use. Deliberately has no
 * author field: LyricsDto.Author is the admin who entered the record into the CMS, not the
 * songwriter or performer — see ILyricsCredits.songwriter for the actual music credit, kept
 * under a name that can't collide with CMS attribution. Carries videoSlug, not the raw
 * videoId — the backend resolves the linked video's slug server-side in the same lookup,
 * so the page can render a "watch the video" link with no second fetch.
 *
 * @interface ILyricsDetailEntity
 *
 * @property {string} id - Unique identifier (UUID)
 * @property {string} slug - Unique URL slug for this page
 * @property {string} songTitle - Title of the song
 * @property {string} artistName - Performing artist's display name — always present, the
 * display fallback regardless of whether artistSlug is set
 * @property {string | null} artistSlug - Claimed artist profile's slug, or null when the
 * artist has no linked ArtistEntity yet (the common case). Present → the artist name
 * renders as a link to /artistes/{artistSlug}; absent → plain text, no navigation.
 * @property {string} lyricsText - Full lyrics body (plain text with line breaks)
 * @property {string} language - ISO 639-1 / BCP-47 language code of the lyrics text
 * @property {string | null} coverImageUrl - Cover/album artwork URL, or null when unset
 * @property {ILyricsCredits} credits - Album, release year, label, songwriter, producer
 * @property {number} viewCount - Cached view count
 * @property {number} likeCount - Cached like count
 * @property {number} shareCount - Cached share count
 * @property {boolean} isLiked - Whether the current viewer has liked this page (always
 * false for anonymous viewers)
 * @property {string | null} videoSlug - Linked video's slug, or null when standalone
 * @property {string | null} metaTitle - SEO title override, or null
 * @property {string | null} metaDescription - SEO description override, or null
 */
export interface ILyricsDetailEntity {
    id: string;
    slug: string;
    songTitle: string;
    artistName: string;
    artistSlug: string | null;
    lyricsText: string;
    language: string;
    coverImageUrl: string | null;
    credits: ILyricsCredits;
    viewCount: number;
    likeCount: number;
    shareCount: number;
    isLiked: boolean;
    videoSlug: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
}
```

`artistName` and `artistSlug` are deliberately both present, not one-or-the-other — this mirrors
the backend's own `LyricsEntity.ArtistName` (always set, plain string) vs. `ArtistId` (nullable FK
to a claimed `ArtistEntity`, resolved to `artistSlug` server-side — see the backend's
[specs/02-video-and-artist-slug-resolution.md](../../../../backend/docs/lyrics-page/specs/02-video-and-artist-slug-resolution.md)
and [specs/08-artist-and-album-entities.md](../../../../backend/docs/lyrics-page/specs/08-artist-and-album-entities.md)).
Most artists have no claimed profile yet, so `artistSlug` is `null` far more often than not at
launch — the UI must handle that as the normal case, not an edge case.

`credits` is a nested object, not five flat fields, so the detail page's song-info card can accept
one prop (`<LyricsCreditsList credits={lyrics.credits} />`) instead of five.

## Mapper

**`src/modules/lyrics/infrastructure/mappers/lyrics.mapper.ts`**

```ts
import type { ILyricsCredits, ILyricsDetailEntity } from "@/modules/lyrics/domain/entities/ILyricsDetailEntity";
import type { ILyricsPage } from "@/modules/lyrics/domain/entities/ILyricsPage";
import type { ILyricsSummaryEntity } from "@/modules/lyrics/domain/entities/ILyricsSummaryEntity";
import type { LyricsDto, LyricsDtoPaginatedResult } from "@/shared/infrastructure/api/generated/116.api";

const EXCERPT_LENGTH = 120;

/**
 * LyricsMapper
 *
 * @description
 * Maps LyricsDto (and its paginated envelope) to the lyrics module's domain entities.
 * Marked as const to prevent accidental mutation.
 */
export const LyricsMapper = {
    /**
     * Maps LyricsDto to the listing-row domain shape, deriving a plain-text excerpt
     * from the full lyrics body. Reused for the similar-lyrics section — same shape.
     *
     * @param dto - Lyrics data from API
     * @returns {ILyricsSummaryEntity} Mapped lyrics summary entity
     */
    lyricsSummaryFromDto(dto: LyricsDto): ILyricsSummaryEntity {
        return {
            id: dto.id,
            slug: dto.slug,
            songTitle: dto.songTitle,
            artistName: dto.artistName,
            language: dto.language,
            coverImageUrl: dto.coverImageUrl ?? null,
            excerpt:
                dto.lyricsText.length > EXCERPT_LENGTH
                    ? `${dto.lyricsText.slice(0, EXCERPT_LENGTH).trimEnd()}…`
                    : dto.lyricsText
        };
    },

    /**
     * Maps a list of LyricsDto to a list of lyrics summary entities.
     *
     * @param dtos - Lyrics data list from API
     * @returns {ILyricsSummaryEntity[]} Mapped lyrics summary entities
     */
    lyricsSummaryListFromDto(dtos: LyricsDto[]): ILyricsSummaryEntity[] {
        return dtos.map(LyricsMapper.lyricsSummaryFromDto);
    },

    /**
     * Maps a paginated LyricsDto result to an ILyricsPage, deriving hasNextPage
     * from the total count and the current page index.
     *
     * @param dto - Paginated envelope from getPublishedLyrics
     * @returns {ILyricsPage} Mapped lyrics page entity
     */
    lyricsPageFromDto(dto: LyricsDtoPaginatedResult): ILyricsPage {
        return {
            items: LyricsMapper.lyricsSummaryListFromDto(dto.items),
            pageIndex: dto.pageIndex,
            pageSize: dto.pageSize,
            count: dto.count,
            hasNextPage: (dto.pageIndex + 1) * dto.pageSize < dto.count
        };
    },

    /**
     * Maps LyricsDto's five song-credit fields to the nested ILyricsCredits shape.
     *
     * @param dto - Lyrics data from API
     * @returns {ILyricsCredits} Mapped song credits
     */
    creditsFromDto(dto: LyricsDto): ILyricsCredits {
        return {
            album: dto.album ?? null,
            releaseYear: dto.releaseYear ?? null,
            label: dto.label ?? null,
            songwriter: dto.songwriter ?? null,
            producer: dto.producer ?? null
        };
    },

    /**
     * Maps LyricsDto (plus the server-resolved video slug and artist slug from the same
     * response) to the full standalone-page domain shape. Deliberately drops dto.author —
     * CMS attribution (who entered the record), not the songwriter or performer, with no
     * legitimate public-facing use on this page; the actual music credit is dto.songwriter,
     * mapped into credits.
     *
     * @param dto - Lyrics data from API
     * @param videoSlug - The linked video's slug, resolved server-side by the same
     * by-slug call (PublicGetLyricsBySlugResponse.videoSlug), or null when standalone
     * @param artistSlug - The claimed artist profile's slug, resolved server-side by the
     * same by-slug call (PublicGetLyricsBySlugResponse.artistSlug), or null when the
     * artist has no linked profile yet
     * @returns {ILyricsDetailEntity} Mapped lyrics detail entity
     */
    lyricsDetailFromDto(dto: LyricsDto, videoSlug: string | null, artistSlug: string | null): ILyricsDetailEntity {
        return {
            id: dto.id,
            slug: dto.slug,
            songTitle: dto.songTitle,
            artistName: dto.artistName,
            artistSlug,
            lyricsText: dto.lyricsText,
            language: dto.language,
            coverImageUrl: dto.coverImageUrl ?? null,
            credits: LyricsMapper.creditsFromDto(dto),
            viewCount: dto.viewCount,
            likeCount: dto.likeCount,
            shareCount: dto.shareCount,
            isLiked: dto.isLiked ?? false,
            videoSlug,
            metaTitle: dto.metaTitle ?? null,
            metaDescription: dto.metaDescription ?? null
        };
    }
} as const;
```

## Task checklist

- [ ] Add `ILyricsSummaryEntity`, `ILyricsPage`, `ILyricsDetailEntity` (+ nested `ILyricsCredits`).
- [ ] Add `lyrics.mapper.ts`.
- [ ] `tsc --noEmit` clean.
- [ ] `biome check` clean.
