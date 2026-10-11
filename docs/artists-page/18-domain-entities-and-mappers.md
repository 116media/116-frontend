# 18 — Domain Entities & Mappers

> **Scope history.** An earlier version typed the profile for three tabs —
> `ArtistTabKey = "lyrics" | "videos" | "albums"`, "the three catalog totals", and a note that
> `albumsTotal` is *"always 0 until Gap 3 ships"*. All three are **corrected** below:
> [07](07-artist-detail-tabs.md) locks three tab keys (`lyrics` and `albums` are retired in favour
> of stacked sections inside `music`), the profile carries a total per surface, and
> `AlbumEntity.ArtistId` already exists so Gap 3 is a repository query and endpoint, not a
> migration ([16](16-backend-gaps-and-contracts.md)). A later pass added merch, tour and guest
> credits; all three were cut, and their entities are gone rather than deferred.

The module's domain shapes and the mapper that produces them from the generated DTOs. Shapes
below assume the DTOs *after* [16](16-backend-gaps-and-contracts.md) Gaps 1 and 2 ship; the
degradation path for each missing field is called out where it matters. Entities behind Gaps 3, 4, 7 and 8
are specified here so the shape is agreed before the backend lands — they map to nothing today and
their sections simply do not render ([08](08-catalog-sections.md)).

Two repo rules govern everything here:

- **Domain entities are interfaces only.** No methods, no getters, no classes. Anything derived
  (`isVerified`, `hasNextPage`, `defaultTab`) is computed in the mapper and exposed as a plain
  property.
- **Mappers own list mapping.** Every `xxxFromDto` that has a list form ships an
  `xxxListFromDto` beside it. Call sites never write `dtos.map(ArtistsMapper.x)`.

## Entities

**`src/modules/artists/domain/entities/IArtistSummaryEntity.ts`**

```ts
/**
 * IArtistSummaryEntity
 *
 * @description
 * One tile in the /artistes directory grid. Carries no id — the whole surface is
 * slug-addressed — and no bio, which the index never renders.
 *
 * @interface IArtistSummaryEntity
 *
 * @property {string} slug - Unique URL slug, the card's link target
 * @property {string} name - Display name, also the sort and bucket source
 * @property {string | null} avatarUrl - Avatar URL, or null when unset (the common case)
 * @property {boolean} isVerified - Whether the profile is claimed and admin-verified
 * @property {number} contentCount - Published lyrics + videos linked to this artist
 */
export interface IArtistSummaryEntity {
    slug: string;
    name: string;
    avatarUrl: string | null;
    isVerified: boolean;
    contentCount: number;
}
```

No `id`. [14](14-data-requirements.md) states the frontend does not need it and exposing it
invites its use in URLs.

**`src/modules/artists/domain/entities/IArtistPage.ts`**

```ts
/**
 * IArtistPage
 *
 * @description
 * One page of the artist directory plus the cursor for the next page and the letter
 * buckets that have at least one artist. `hasNextPage` and `availableLetters` are both
 * mapper-derived.
 *
 * @interface IArtistPage
 *
 * @property {IArtistSummaryEntity[]} items - The artists on this page
 * @property {number} pageIndex - Zero-based index of this page
 * @property {number} pageSize - Page size the server used
 * @property {number} count - Total artists across all pages, for the header count
 * @property {boolean} hasNextPage - Whether a further page exists
 * @property {string[] | null} availableLetters - Buckets with at least one artist, or
 * null when the backend does not supply them (Gap 1b not shipped)
 */
export interface IArtistPage {
    items: IArtistSummaryEntity[];
    pageIndex: number;
    pageSize: number;
    count: number;
    hasNextPage: boolean;
    availableLetters: string[] | null;
}
```

`availableLetters` is `string[] | null`, not `string[]`. `null` means "the backend did not tell
us", which the rail renders as *all letters enabled* — the documented v1 degradation
([16](16-backend-gaps-and-contracts.md) Gap 1b). An empty array would mean "no letter has any
artist", a different and much rarer fact, and collapsing the two would silently disable the whole
rail the day the field ships empty.

**`src/modules/artists/domain/entities/IArtistAlbumEntity.ts`**

```ts
/**
 * Release types the backend discriminator carries. `EP` and `Single` exist in the enum from
 * the start but are not rendered in v1 — [08](08-catalog-sections.md).
 */
export type ArtistReleaseType = "album" | "mixtape" | "ep" | "single";

/**
 * IArtistAlbumEntity
 *
 * @description
 * One tile in the Albums or Mixtapes section of the Musique tab — the same entity and the
 * same card for both, separated only by `releaseType`. Deliberately has no slug or id:
 * release cards are not links in v1 and there is no release detail page to link to.
 *
 * @interface IArtistAlbumEntity
 *
 * @property {string} name - Release title
 * @property {string | null} coverImageUrl - Cover artwork URL, or null when unset
 * @property {number | null} releaseYear - Four-digit release year, or null when unknown
 * @property {ArtistReleaseType} releaseType - Album vs mixtape discriminator (Gap 4)
 */
export interface IArtistAlbumEntity {
    name: string;
    coverImageUrl: string | null;
    releaseYear: number | null;
    releaseType: ArtistReleaseType;
}
```

The absent identifier is a deliberate constraint, not an omission: a card with no id cannot
accidentally grow a link before an album detail page exists ([08](08-catalog-sections.md)).

`releaseType` is **required, not optional**. Before Gap 4 ships the field is absent from the DTO and
the mapper coalesces it to `"album"`, which matches the backend's own backfill default
([16](16-backend-gaps-and-contracts.md) Gap 4) — so pre-Gap-4 data renders entirely under *Albums*
and the *Mixtapes* heading is simply empty and hidden, which is honest. `"ep"` and `"single"` map
through untouched and are dropped by the section filters, never re-labelled as mixtapes
([08](08-catalog-sections.md)). Albums and mixtapes are two headings over one entity
([08](08-catalog-sections.md)); a second `IArtistMixtapeEntity` would fork the card as well as the
query for no gain.

**`releaseType` is the only genuine schema change behind the releases sections.** The earlier claim
that albums needed a migration and a backfill was wrong — `AlbumEntity.ArtistId` already exists, so
Gap 3 is a repository method plus an endpoint ([16](16-backend-gaps-and-contracts.md) Gap 3, and
[15](15-backend-current-state.md)). Gap 4 is the discriminator, and it is what gates the *Mixtapes*
heading specifically, not the Albums one.

**`src/modules/artists/domain/entities/IArtistIdentityEntity.ts`** — Gap 7

```ts
/**
 * IArtistIdentityEntity
 *
 * @description
 * The optional identity facts under the bio. Every field is nullable and omitted from the
 * UI when absent; an artist with none renders no identity block at all.
 *
 * @interface IArtistIdentityEntity
 *
 * @property {string | null} realName - Legal name, null when unknown or equal to the stage name
 * @property {string[]} aliases - Other names, empty array when none — never null
 * @property {string | null} birthdate - Civil date `YYYY-MM-DD`, never an instant
 * @property {string | null} hometown - Free text as entered, not a structured place
 */
export interface IArtistIdentityEntity {
    realName: string | null;
    aliases: string[];
    birthdate: string | null;
    hometown: string | null;
}
```

Three constraints the type is carrying deliberately:

- **`birthdate` is a `YYYY-MM-DD` string, never a `Date` and never an ISO instant.** `new Date()` on
  an instant localises it and shifts a birthday by a day for half the world
  ([06](06-artist-detail-hero.md)). It stays a string through the mapper and is formatted with
  explicit date parts at render time. Same class of bug as `eventDate` below.
- **`aliases` is `string[]`, never `string[] | null`.** The absence of aliases is an empty array;
  callers render `aliases.length > 0` with no null check.
- **Age is not a property.** It is derived at render time — a stored age is wrong within a year
  ([06](06-artist-detail-hero.md)). Real-name suppression when it duplicates the stage name is
  likewise a render decision, not a mapper one: the mapper must not silently null a real field.

**`src/modules/artists/domain/entities/IArtistSocialLinkEntity.ts`** — Gap 8

```ts
/**
 * Platforms the socials row can render. Values the backend adds later and this union does
 * not carry are skipped by the UI rather than rendered generically.
 */
export type ArtistSocialPlatform =
    | "instagram"
    | "x"
    | "facebook"
    | "youtube"
    | "tiktok"
    | "website";

/**
 * IArtistSocialLinkEntity
 *
 * @description
 * One platform-keyed outbound link in the hero's socials row. Modelled as a list rather
 * than N nullable URL fields, mirroring the backend's child-table shape.
 *
 * @interface IArtistSocialLinkEntity
 *
 * @property {ArtistSocialPlatform} platform - Chooses the icon and the accessible label
 * @property {string} url - Display-and-navigate only; never parsed for a handle
 */
export interface IArtistSocialLinkEntity {
    platform: ArtistSocialPlatform;
    url: string;
}
```

**Unknown platforms are dropped in the mapper**, not at render time. A backend that adds
`EnumSocialPlatform.Snapchat` before the frontend knows the icon must not produce an unlabelled
link, and a component should not have to defend against a value its own type says cannot exist
([06](06-artist-detail-hero.md), [16](16-backend-gaps-and-contracts.md) Gap 8).

**`src/modules/artists/domain/entities/IArtistDetailEntity.ts`**

```ts
import type { IArtistIdentityEntity } from "@/modules/artists/domain/entities/IArtistIdentityEntity";
import type { IArtistSocialLinkEntity } from "@/modules/artists/domain/entities/IArtistSocialLinkEntity";
import type { ILyricsPage } from "@/modules/lyrics/domain/entities/ILyricsPage";
import type { IVideoPage } from "@/modules/videos/domain/entities/IVideoPage";

/**
 * The primary tab keys, in resolution order. Stable English strings — they are URL
 * values and must not change with the viewer's language.
 */
export type ArtistTabKey = "music" | "videos" | "news";

/**
 * The stacked sections inside the Musique tab, in render order. These are in-page anchor
 * fragments (`#popular`, `#latest`, …), not tab keys — the Musique panel has no nested
 * tablist.
 */
export type ArtistMusicSectionKey =
    | "popular"
    | "latest"
    | "albums"
    | "mixtapes";

/**
 * IArtistTotals
 *
 * @description
 * Every per-surface count the profile needs before any tab is opened: the stat row, tab
 * visibility, and default-tab resolution all read from here. A total is one COUNT; the
 * alternative is a flash of the wrong default tab.
 *
 * @interface IArtistTotals
 *
 * @property {number} songs - Published lyrics pages where this artist is the primary credit
 * @property {number} videos - Published videos where this artist is the primary credit
 * @property {number} albums - Releases with `releaseType: "album"` (Gap 3 + 4)
 * @property {number} mixtapes - Releases with `releaseType: "mixtape"` (Gap 3 + 4)
 * @property {number} news - Articles tagged to this artist (Gap 5)
 */
export interface IArtistTotals {
    songs: number;
    videos: number;
    albums: number;
    mixtapes: number;
    news: number;
}

/**
 * IArtistDetailEntity
 *
 * @description
 * The full /artistes/{slug} profile: identity, socials, every surface total, and the first
 * page of the two catalogs the profile request already returns. `visibleTabs`,
 * `visibleMusicSections` and `defaultTab` are mapper-derived from the totals so the server
 * render picks the right tab with no flash of an empty panel.
 *
 * @interface IArtistDetailEntity
 *
 * @property {string} slug - Unique URL slug, the canonical URL source
 * @property {string} name - Display name, the h1 and JSON-LD name
 * @property {string | null} bio - Plain-text biography, or null when unset
 * @property {string | null} avatarUrl - Avatar URL, or null when unset
 * @property {boolean} isVerified - Whether the profile is claimed and admin-verified
 * @property {IArtistIdentityEntity} identity - Real name, aliases, birthdate, hometown (Gap 7)
 * @property {IArtistSocialLinkEntity[]} socialLinks - Known-platform links only, empty when none (Gap 8)
 * @property {IArtistTotals} totals - Every per-surface count
 * @property {ILyricsPage} latestSongsFirstPage - First page of the Récentes section
 * @property {IVideoPage} videosFirstPage - First page of the videos tab
 * @property {ArtistTabKey[]} visibleTabs - Tabs with at least one item, in fixed order
 * @property {ArtistMusicSectionKey[]} visibleMusicSections - Sections with at least one item
 * @property {ArtistTabKey | null} defaultTab - First visible tab, or null when none
 */
export interface IArtistDetailEntity {
    slug: string;
    name: string;
    bio: string | null;
    avatarUrl: string | null;
    isVerified: boolean;
    identity: IArtistIdentityEntity;
    socialLinks: IArtistSocialLinkEntity[];
    totals: IArtistTotals;
    latestSongsFirstPage: ILyricsPage;
    videosFirstPage: IVideoPage;
    visibleTabs: ArtistTabKey[];
    visibleMusicSections: ArtistMusicSectionKey[];
    defaultTab: ArtistTabKey | null;
}
```

**Correction — three shapes changed here.**

1. `ArtistTabKey` was `"lyrics" | "videos" | "albums"`. Those keys are **retired**
   ([07](07-artist-detail-tabs.md)): `lyrics` and `albums` are no longer tabs at all — songs and
   releases are stacked sections *inside* `music`. Nothing shipped the old keys, so no redirect is
   owed; if one ever appears in a share, `lyrics → music` and `albums → music#albums`.
2. The flat `lyricsTotal` / `videosTotal` / `albumsTotal` trio became `IArtistTotals`. "The three
   catalog totals" was accurate when songs, videos and albums were the whole profile; a nested
   object keeps `IArtistDetailEntity` readable across five surfaces, and the stat row and
   tab-visibility rule read from one place.
3. `lyricsFirstPage` is now `latestSongsFirstPage`. The payload's lyrics page is specifically the
   *Récentes* section, not the whole `music` tab — Populaires, Albums and Mixtapes are separate
   requests ([07](07-artist-detail-tabs.md)).

`albumsTotal` also lost its *"always 0 until Gap 3 ships"* note. That note followed from the
mistaken belief that albums needed a schema migration. `AlbumEntity.ArtistId` already exists, so
`totals.albums` is real as soon as the artist-scoped query lands, and `totals.mixtapes` follows
Gap 4 ([16](16-backend-gaps-and-contracts.md)).

`visibleTabs`, `visibleMusicSections` and `defaultTab` are properties, not methods — the
interface-only rule. They encode [07](07-artist-detail-tabs.md)'s rules in one place: a zero-item
tab is hidden, a zero-item section inside `Musique` is not rendered, and the default tab is the
first non-empty one in `music → videos → news` order.

`music` is visible when **any** of its four sections has items — an artist with only a mixtape
still gets a `Musique` tab.

`defaultTab` is nullable and `visibleTabs` can be empty, which together mean "this artist has no
published content". The route treats that as `notFound()` ([01](01-overview.md), locked: a
zero-content artist 404s). The entity records the fact rather than throwing, so the route owns the
404 and the mapper stays a pure transformation.

## Mapper

**`src/modules/artists/infrastructure/mappers/artists.mapper.ts`**

```ts
import type {
    ArtistMusicSectionKey,
    ArtistTabKey,
    IArtistDetailEntity,
    IArtistTotals
} from "@/modules/artists/domain/entities/IArtistDetailEntity";
import type {
    ArtistReleaseType,
    IArtistAlbumEntity
} from "@/modules/artists/domain/entities/IArtistAlbumEntity";
import type { IArtistIdentityEntity } from "@/modules/artists/domain/entities/IArtistIdentityEntity";
import type { IArtistPage } from "@/modules/artists/domain/entities/IArtistPage";
import type {
    ArtistSocialPlatform,
    IArtistSocialLinkEntity
} from "@/modules/artists/domain/entities/IArtistSocialLinkEntity";
import type { IArtistSummaryEntity } from "@/modules/artists/domain/entities/IArtistSummaryEntity";
import { LyricsMapper } from "@/modules/lyrics/infrastructure/mappers/lyrics.mapper";
import { VideosMapper } from "@/modules/videos/infrastructure/mappers/videos.mapper";
import type {
    AlbumDto,
    ArtistDto,
    ArtistSocialLinkDto,
    ArtistSummaryDto,
    ArtistSummaryDtoPaginatedResult,
    PublicGetArtistBySlugResult
} from "@/shared/infrastructure/api/generated/116.api";

/**
 * Order in which tabs resolve. Also the render order of the tab bar.
 */
const TAB_ORDER: ArtistTabKey[] = ["music", "videos", "news"];

/**
 * Render order of the stacked sections inside the Musique tab, and the order of the
 * jump-bar anchors above them.
 */
const MUSIC_SECTION_ORDER: ArtistMusicSectionKey[] = [
    "popular",
    "latest",
    "albums",
    "mixtapes"
];

/**
 * Backend social platforms this build knows how to render. Anything outside the map is
 * dropped rather than rendered as a generic link.
 */
const SOCIAL_PLATFORMS: Record<string, ArtistSocialPlatform> = {
    Instagram: "instagram",
    X: "x",
    Facebook: "facebook",
    YouTube: "youtube",
    TikTok: "tiktok",
    Website: "website"
};

/**
 * ArtistsMapper
 *
 * @description
 * Maps the artist DTOs and their paginated envelopes to the artists module's domain
 * entities. Delegates catalog items to the lyrics and videos mappers so tab cards get
 * exactly the entities their existing card components already accept.
 */
export const ArtistsMapper = {
    /**
     * Maps ArtistSummaryDto to the directory-tile domain shape.
     *
     * @param dto - Artist summary from the public list endpoint
     * @returns {IArtistSummaryEntity} Mapped artist summary entity
     */
    artistSummaryFromDto(dto: ArtistSummaryDto): IArtistSummaryEntity {
        return {
            slug: dto.slug,
            name: dto.name,
            avatarUrl: dto.avatarUrl ?? null,
            isVerified: dto.isVerified ?? false,
            contentCount: dto.contentCount ?? 0
        };
    },

    /**
     * Maps a list of ArtistSummaryDto to a list of artist summary entities.
     *
     * @param dtos - Artist summary list from API
     * @returns {IArtistSummaryEntity[]} Mapped artist summary entities
     */
    artistSummaryListFromDto(dtos: ArtistSummaryDto[]): IArtistSummaryEntity[] {
        return dtos.map(ArtistsMapper.artistSummaryFromDto);
    },

    /**
     * Maps a paginated artist result to an IArtistPage, deriving hasNextPage from the
     * total count and normalising absent letter buckets to null.
     *
     * @param dto - Paginated envelope from the public artist list endpoint
     * @param availableLetters - Letter buckets returned alongside the page, if any
     * @returns {IArtistPage} Mapped artist page entity
     */
    artistPageFromDto(
        dto: ArtistSummaryDtoPaginatedResult,
        availableLetters?: string[] | null
    ): IArtistPage {
        return {
            items: ArtistsMapper.artistSummaryListFromDto(dto.items),
            pageIndex: dto.pageIndex,
            pageSize: dto.pageSize,
            count: dto.count,
            hasNextPage: (dto.pageIndex + 1) * dto.pageSize < dto.count,
            availableLetters: availableLetters?.length ? availableLetters : null
        };
    },

    /**
     * Maps AlbumDto to the release-tile shape, dropping the identifier so a card cannot
     * become a link before a release detail page exists.
     *
     * @param dto - Release data from API
     * @returns {IArtistAlbumEntity} Mapped release entity
     */
    artistAlbumFromDto(dto: AlbumDto): IArtistAlbumEntity {
        return {
            name: dto.name,
            coverImageUrl: dto.coverImageUrl ?? null,
            releaseYear: dto.releaseYear ?? null,
            releaseType: (dto.releaseType?.toLowerCase() as ArtistReleaseType) ?? "album"
        };
    },

    /**
     * Maps the backend's social link rows, dropping platforms this build cannot render.
     *
     * @param dtos - Social link list from API
     * @returns {IArtistSocialLinkEntity[]} Mapped links, unknown platforms omitted
     */
    artistSocialLinkListFromDto(dtos: ArtistSocialLinkDto[]): IArtistSocialLinkEntity[] {
        return dtos
            .filter((dto) => dto.platform in SOCIAL_PLATFORMS)
            .map((dto) => ({ platform: SOCIAL_PLATFORMS[dto.platform], url: dto.url }));
    },

    /**
     * Maps the optional identity fields, normalising an absent alias list to an empty
     * array and keeping the birthdate as its `YYYY-MM-DD` string.
     *
     * @param dto - Artist data from the profile response
     * @returns {IArtistIdentityEntity} Mapped identity entity
     */
    artistIdentityFromDto(dto: ArtistDto): IArtistIdentityEntity {
        return {
            realName: dto.realName ?? null,
            aliases: dto.aliases ?? [],
            birthdate: dto.birthdate ?? null,
            hometown: dto.hometown ?? null
        };
    },

    /**
     * Maps a list of AlbumDto to a list of album entities.
     *
     * @param dtos - Album list from API
     * @returns {IArtistAlbumEntity[]} Mapped album entities
     */
    artistAlbumListFromDto(dtos: AlbumDto[]): IArtistAlbumEntity[] {
        return dtos.map(ArtistsMapper.artistAlbumFromDto);
    },

    /**
     * Maps the profile response to IArtistDetailEntity, deriving every surface total from
     * the paginated envelopes and the counts, and the visible tabs, visible Musique
     * sections and default tab from those totals.
     *
     * @param dto - Response from GET /public/artists/{slug}
     * @returns {IArtistDetailEntity} Mapped artist detail entity
     */
    artistDetailFromDto(dto: PublicGetArtistBySlugResult): IArtistDetailEntity {
        const latestSongsFirstPage = LyricsMapper.lyricsPageFromDto(dto.lyrics);
        const videosFirstPage = VideosMapper.videoPageFromDto(dto.videos);

        const totals: IArtistTotals = {
            songs: latestSongsFirstPage.count,
            videos: videosFirstPage.count,
            albums: dto.albumsTotal ?? 0,
            mixtapes: dto.mixtapesTotal ?? 0,
            news: dto.newsTotal ?? 0
        };

        const sectionTotals: Record<ArtistMusicSectionKey, number> = {
            popular: totals.songs > 10 ? totals.songs : 0,
            latest: totals.songs,
            albums: totals.albums,
            mixtapes: totals.mixtapes
        };
        const visibleMusicSections = MUSIC_SECTION_ORDER.filter(
            (section) => sectionTotals[section] > 0
        );

        const tabTotals: Record<ArtistTabKey, number> = {
            music: visibleMusicSections.length,
            videos: totals.videos,
            news: totals.news
        };
        const visibleTabs = TAB_ORDER.filter((tab) => tabTotals[tab] > 0);

        return {
            slug: dto.artist.slug,
            name: dto.artist.name,
            bio: dto.artist.bio ?? null,
            avatarUrl: dto.artist.avatarUrl ?? null,
            isVerified: dto.artist.isVerified ?? false,
            identity: ArtistsMapper.artistIdentityFromDto(dto.artist),
            socialLinks: ArtistsMapper.artistSocialLinkListFromDto(dto.artist.socialLinks ?? []),
            totals,
            latestSongsFirstPage,
            videosFirstPage,
            visibleTabs,
            visibleMusicSections,
            defaultTab: visibleTabs[0] ?? null
        };
    }
};
```

Two derivations worth reading twice:

- **`popular` is gated at `> 10`, not `> 0`.** [08](08-catalog-sections.md) hides Chansons
  populaires when the artist has ten songs or fewer, because "the 10 most popular" of 8 songs is
  the same list reordered directly above itself. That threshold belongs here, with the other
  visibility rules, and not in the panel component.
- **`music` is visible when it has any visible *section*,** which is why `tabTotals.music` is a
  section count rather than a sum of items. Summing would be equivalent today but would silently
  resurrect the tab the moment a section gained its own hiding rule, as `popular` already has.

### The remaining mappers

Not shown in full — each is the same `xxxFromDto` + `xxxListFromDto` pair against the DTO shapes in
[16](16-backend-gaps-and-contracts.md), and each lands with its gap:

| Pair | Produces | Gap |
|---|---|---|
| `artistAlbumFromDto` / `…ListFromDto` | `IArtistAlbumEntity` — albums and mixtapes, split on `releaseType` | 3 + 4 |

News needs **no mapper here**. Articles are mapped by `ArticlesMapper` into the entity `ArticleCard`
already consumes; re-mapping them in this module would fork the card
([08](08-catalog-sections.md)).

## Mapping rules

- **`isVerified` is read, never computed client-side.** The backend derives it from
  `UserId != null && VerifiedAt != null` ([16](16-backend-gaps-and-contracts.md) Gap 2). The
  frontend never sees `UserId` and must not attempt its own derivation.
- **`?? false` and `?? 0` across `isVerified` and every total are the degradation path**, not
  defensive noise: before the corresponding gap ships the property is absent from the generated DTO,
  the total is `0`, the tab or section is not visible, and the page renders without it — the
  documented v1 fallback ([08](08-catalog-sections.md)). Remove the coalescing per field as each
  becomes non-nullable in `116.api.ts`; do not remove them as a batch.
- **`?? 0` is not a permanent state for any total.** The earlier rule singled out `albumsTotal` as
  *"always 0 until Gap 3 ships"* on the belief that albums needed a migration. **Corrected:**
  `AlbumEntity.ArtistId` already exists, so `totals.albums` becomes real with a repository method
  and an endpoint ([16](16-backend-gaps-and-contracts.md) Gap 3). The same coalescing now covers
  five surfaces and means "not wired yet", never "not possible".
- **Totals come from the pagination envelopes** where one exists, never from `items.length`. The
  hero stat row and the section heading count must be the same number ([08](08-catalog-sections.md)).
  `albums`, `mixtapes` and `news` arrive as scalar counts on the profile response — they have no
  envelope in the initial payload because their first page is not in it
  ([21](21-performance-and-pagination.md)).
- **Identity and socials are mapped, never inferred.** The mapper does not suppress a `realName`
  that equals the stage name and does not compute an age — both are render decisions
  ([06](06-artist-detail-hero.md)). It *does* drop unknown social platforms, because a value the
  union cannot express must not reach a component.
- **Civil dates stay strings.** `birthdate` passes through untouched: no `new Date()`, no
  normalisation, no timezone handling. Converting it is how a birthday moves a day
  ([06](06-artist-detail-hero.md)).
- **Bio stays a plain string.** It is rendered as text, never as HTML ([06](06-artist-detail-hero.md)).
- **Catalog items delegate.** `LyricsMapper` and `VideosMapper` produce the entities their own
  cards already consume; this module never re-maps a `LyricsSummaryDto`.
- **Letter bucketing is not a mapper concern.** Bucketing and accent folding happen server-side
  ([05](05-alphabet-search-and-filters.md)); the mapper only passes the returned buckets through.

## A dependency worth stating

`IVideoPage` and `VideosMapper.videoPageFromDto` exist today. **`ILyricsPage` and `LyricsMapper`
do not** — `src/modules/lyrics/` is not yet a module in the repo; it is specified in
[`../lyrics-page/specs/02-domain-entities-and-mapper.md`](../lyrics-page/specs/02-domain-entities-and-mapper.md)
and [`03`](../lyrics-page/specs/03-repository-usecases-and-di.md) and not yet built.

The profile's `Musique` tab — Populaires and Récentes — therefore depends on the lyrics module
landing first. That is a hard
sequencing constraint, recorded in [24](24-implementation-plan.md), not something this module can
work around: building a second lyrics entity here would fork the card component too.

## Exact DTO names

`ArtistSummaryDto`, `ArtistDto`, `PublicGetArtistBySlugResult`, `AlbumDto` and
`ArtistSocialLinkDto` above are the names this design expects. Confirm all of them against the
regenerated `116.api.ts` after each gap ships and adjust the mapper's imports — the generator's
naming follows the backend's result types, not this document
([19](19-repository-usecases-and-di.md)).

The enum casings in `SOCIAL_PLATFORMS` and the release-type lowercasing are the same bet: the
generator emits the backend's C# enum member names, and this module normalises them once, in the
mapper, so no component ever branches on a backend casing.
