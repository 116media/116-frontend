# 20 — State Management & Query Keys

> **Corrected.** An earlier version gave the key factory three catalog keys
> (`lyrics` / `videos` / `albums`) and **no sort dimension**, which would have made *Chansons
> populaires* and *Dernières chansons* — the same endpoint at two sorts
> ([07](07-artist-detail-tabs.md)) — collide on one cache entry and overwrite each other. It also
> stated that `tab` is not a key input. Both are fixed below.

TanStack Query is the only client cache. There is no store, no context holding server data, and no
`useState` mirror of a query result. URL params own filter state ([05](05-alphabet-search-and-filters.md),
[07](07-artist-detail-tabs.md)); everything else is derived.

## Key factory

**`src/modules/artists/presentation/constants/artistKeys.ts`** — same shape as `articleKeys` /
`videoKeys`, including the co-located page-size constants.

```ts
/**
 * IArtistDirectoryFilters
 *
 * @description
 * Filters that scope the artist directory. `letter` and `search` are mutually exclusive;
 * when neither is set the query targets the whole directory.
 *
 * @interface IArtistDirectoryFilters
 *
 * @property {string} [letter] - Single bucket, "A"–"Z" or "#"
 * @property {string} [search] - Name substring, minimum two characters
 */
export interface IArtistDirectoryFilters {
    letter?: string;
    search?: string;
}

/**
 * Stable TanStack Query keys for the artists feature. The directory key embeds the active
 * filters so each letter and each search term caches independently; every profile surface
 * is keyed by slug plus whatever else changes its result — sort for songs, release type for
 * releases, past-inclusion for tour — so no two surfaces share a cache entry.
 */
export const artistKeys = {
    all: ["artists"] as const,
    directory: (filters: IArtistDirectoryFilters = {}) =>
        [...artistKeys.all, "directory", filters] as const,
    detail: (slug: string) => [...artistKeys.all, "detail", slug] as const,
    lyrics: (slug: string, sort: ArtistCatalogSort) =>
        [...artistKeys.all, "detail", slug, "lyrics", sort] as const,
    videos: (slug: string) => [...artistKeys.all, "detail", slug, "videos"] as const,
    releases: (slug: string, releaseType: ArtistReleaseType) =>
        [...artistKeys.all, "detail", slug, "releases", releaseType] as const,
    news: (slug: string) => [...artistKeys.all, "detail", slug, "news"] as const
};

/**
 * Page size for the /artistes directory grid.
 */
export const ARTISTS_PAGE_SIZE = 30;

/**
 * Page size for the Dernières chansons section.
 */
export const ARTIST_LYRICS_PAGE_SIZE = 20;

/**
 * Fixed size of Chansons populaires. Not a page size — the section never pages.
 */
export const ARTIST_POPULAR_SIZE = 10;

/**
 * Page size for the profile's videos tab; smaller because video cards are 16:9 and heavier.
 */
export const ARTIST_VIDEOS_PAGE_SIZE = 12;

/**
 * Page size shared by Albums, Mixtapes and Actualités.
 */
export const ARTIST_SECTION_PAGE_SIZE = 12;

/**
 * Minimum characters before the directory search fires a request.
 */
export const ARTIST_SEARCH_MIN_LENGTH = 2;
```

Page sizes are locked by [04](04-artists-index-page.md) and [08](08-catalog-sections.md) and live
here rather than in the components, so the SSR first page and the client's subsequent pages cannot
drift apart.

Every profile key nests under `detail(slug)` deliberately: `queryClient.removeQueries({ queryKey:
artistKeys.detail(slug) })` drops one artist's entire footprint — profile, every tab, and every
section inside `Musique` — in one call. That property is why the sort and release-type dimensions
are appended as *suffixes* rather than folded into a filters object at the front.

### `sort` is a cache dimension, not a request detail

**Populaires and Récentes are the same endpoint with `sort=views` and `sort=publishedAt`**
([07](07-artist-detail-tabs.md)). They must not share a cache entry. Under the earlier
`lyrics(slug)` key they would have: the second section to mount would find a populated cache under
the same key, render the *other* section's ordering, and — because both are infinite queries —
append its own pages onto the wrong accumulation. The failure is silent and looks like a backend
sort bug.

`releases(slug, releaseType)` carries the same reasoning for Albums vs Mixtapes, and
`tour(slug, includePast)` for the past-dates disclosure. The rule: **anything that changes the
server's answer for the same slug belongs in the key.**

## How URL params map into keys

| URL param ([03](03-information-architecture.md)) | Enters the key? | How |
|---|:---:|---|
| `letter` | ✅ | inside the `directory` filters object |
| `q` | ✅ | as `search`, after 300ms debounce and the 2-char gate |
| `page` (index) | ❌ | it is the infinite query's `pageParam`, not part of the key |
| `tab` | ✅ | each tab has its **own key factory entry** — `lyrics`, `videos`, `news` |
| section anchor (`#popular`, …) | ❌ | scroll position only; every `Musique` section is mounted |
| `page` (within a tab or section) | ❌ | that query's `pageParam` |

**Correction:** the earlier version said `tab` *"selects which query is mounted, it is not a key
input"*. That reads as though the tab is absent from the cache, which it is not — the tab is baked
into the key, one factory entry per tab, which is exactly what makes a tab switch a zero-request
cache read ([21](21-performance-and-pagination.md)). What is true is narrower: `tab` is not a
*runtime argument* to a shared key, and mounting is what decides whether a tab's query fires at
all. The distinction matters, because "not a key input" invites a single `catalog(slug)` key that
every tab would fight over.

The `Musique` sections are the same idea one level down: `lyrics(slug, sort)` and
`releases(slug, releaseType)` are separate entries, so the four stacked sections load, fail and
cache independently and one failed section never blanks the panel
([07](07-artist-detail-tabs.md), [09](09-loading-empty-error.md)).

**`page` is never in a query key.** An infinite query caches all its accumulated pages under one
key; putting the page number in the key would give each page its own cache entry and destroy the
accumulation. `page` in the URL records how deep the user has scrolled so a refresh restores it —
it is a *hydration input*, not a cache dimension.

Because `letter` and `q` are mutually exclusive ([05](05-alphabet-search-and-filters.md)), the
container writes only one of them into the filters object. Passing both would key a query the
server rejects.

Filters go in as a plain object, matching `articleKeys.feed(filters)`. TanStack hashes keys
structurally, so `{ letter: "F" }` and `{ letter: "F", search: undefined }` hash identically —
setting the inactive filter to `undefined` rather than deleting it is safe.

## Hooks

Nine hooks in `presentation/hooks/` ([17](17-frontend-module.md)), all `"use client"`, all thin
wrappers over the cradle. One is shown in full; the rest differ only in key, use case and query
type.

```ts
"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type { IArtistPage } from "@/modules/artists/domain/entities/IArtistPage";
import {
    ARTISTS_PAGE_SIZE,
    artistKeys,
    type IArtistDirectoryFilters
} from "@/modules/artists/presentation/constants/artistKeys";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useArtistsDirectory
 *
 * @description
 * Infinite query over the public artist directory, keyed by the active letter or search
 * filter. Pages accumulate; `availableLetters` is read from the first page only, since
 * the rail reflects the whole filtered set rather than the loaded slice.
 *
 * @param filters - Optional letter / search scoping.
 * @returns The `useInfiniteQuery` result for the directory.
 */
export function useArtistsDirectory(filters: IArtistDirectoryFilters = {}) {
    return useInfiniteQuery<IArtistPage, Failure>({
        queryKey: artistKeys.directory(filters),
        initialPageParam: 0,
        queryFn: async ({ pageParam }) => {
            const result = await container.cradle.getArtistsUseCase.execute({
                pageIndex: pageParam as number,
                pageSize: ARTISTS_PAGE_SIZE,
                ...filters
            });
            if (!result.ok) throw result.error;
            return result.value;
        },
        getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.pageIndex + 1 : undefined)
    });
}
```

| Hook | Query type | Key |
|---|---|---|
| `useArtistsDirectory(filters)` | infinite | `artistKeys.directory(filters)` |
| `useArtistProfile(slug, { initialData })` | standard | `artistKeys.detail(slug)` |
| `useArtistLyrics(slug, { sort, initialPage, enabled })` | infinite | `artistKeys.lyrics(slug, sort)` |
| `useArtistVideos(slug, { initialPage, enabled })` | infinite | `artistKeys.videos(slug)` |
| `useArtistReleases(slug, { releaseType, enabled })` | infinite | `artistKeys.releases(slug, releaseType)` |
| `useArtistNews(slug, { enabled })` | infinite | `artistKeys.news(slug)` |

`useArtistLyrics` is called **twice on one page** — `sort: "views"` for Populaires with
`ARTIST_POPULAR_SIZE` and `sort: "publishedAt"` for Récentes. Two hook instances, two keys, two
caches, one endpoint. Populaires is a fixed top-10 with no paging, so it uses a standard query's
semantics even though it shares the infinite hook; it simply never calls `fetchNextPage`.

Every catalog hook is an infinite query even where a second page is unlikely — Albums and Mixtapes
are page size 12 and will be one page for almost every artist ([08](08-catalog-sections.md)).
Using the infinite hook anyway costs nothing and means a prolific discography is not silently
truncated at twelve. Their `getNextPageParam` compares the accumulated item count against the
matching entry in `artist.totals` rather than reading a `hasNextPage` off an envelope, since those
endpoints return a bare item array ([19](19-repository-usecases-and-di.md)).

`getNextPageParam` reads `hasNextPage` off the mapped page entity, matching `useArticlesFeed` and
`useVideosFeed`. Page indices are **zero-based** throughout the data layer; the `?page=` URL param
is one-based ([05](05-alphabet-search-and-filters.md)) and the container converts.

Note the divergence from existing feeds: `useArticlesFeed` falls back to dummy data on an empty
unfiltered page. **The artists hooks never do.** An empty directory is a real state with real copy
([09](09-loading-empty-error.md)), and a fabricated artist would be a fabricated person.

## Per-tab independence

[07](07-artist-detail-tabs.md) requires each tab independently paginated, independently fetched,
and cached once loaded. That falls out of one instance of `ArtistTabPanelContainer` per tab, each
owning its own infinite query:

- **Own key** → own accumulated pages. Paging Récentes to page 3 leaves videos untouched.
- **`enabled: tab === activeTab || hasBeenActivated`** → an unopened tab never fetches. Once
  opened, the flag latches so the query stays mounted-equivalent in cache.
- **Never unmount-and-refetch.** Switching back to `music` reads cache and renders instantly;
  `staleTime` keeps it from firing a background refetch on every switch.
- Only `music` (Récentes) and `videos` arrive seeded from the profile payload. **Every other
  surface — Populaires, Albums, Mixtapes, Actualités — fetches on first open**, which is the
  tradeoff the multi-section profile makes deliberately ([21](21-performance-and-pagination.md)).

The same independence applies **inside** the `music` panel, one level down. The four sections are
stacked and all mounted together, so opening `music` fans out to up to four requests — but each
`ArtistMusicSectionContainer` owns its key, its loading state and its error state, and a section
whose gap has not shipped simply is not rendered ([08](08-catalog-sections.md)). One failed section
must never blank the panel ([09](09-loading-empty-error.md)).

To keep that fan-out honest, the sections below the fold are **gated on visibility, not mounted
eagerly**: Populaires and Récentes fire on panel open; Albums and Mixtapes enable when their
heading approaches the viewport. Four simultaneous requests on tab open would undo the per-section
split's whole point.

An island container is the sanctioned pattern for this in `AGENTS.md` — an independently-loading
region may own its query and still sit in `containers/`.

## Server rendering and hydration

This repo has **no `HydrationBoundary` / `dehydrate` / `prefetchQuery` anywhere**. The established
pattern is `initialData` seeding, and this module follows it rather than introducing a second one.

```tsx
// app/(public)/artistes/[slug]/page.tsx
const fetchArtist = cache(async (slug: string): Promise<IArtistDetailEntity | null> => {
    const cradle = await createServerCradle();
    const result = await cradle.getArtistBySlugUseCase.execute(slug);
    return result.ok ? result.value : null;
});

export default async function ArtistProfilePage({ params, searchParams }: ArtistRouteProps) {
    const { slug } = await params;
    const artist = await fetchArtist(slug);

    if (!artist || artist.defaultTab === null) notFound();

    return <ArtistProfileContainer slug={slug} initialData={artist} tab={...} />;
}
```

- `cache()` memoizes per request so `generateMetadata` and the render share one backend call.
- `initialData: artist` seeds `artistKeys.detail(slug)`; the client mounts without refetching.
- `artist.latestSongsFirstPage` / `videosFirstPage` seed the corresponding query's *first page*:
  `initialData: { pages: [artist.latestSongsFirstPage], pageParams: [0] }` under
  `artistKeys.lyrics(slug, "publishedAt")` and `artistKeys.videos(slug)`. Those two pages are
  already in the payload — refetching them would be a wasted request on every profile load
  ([21](21-performance-and-pagination.md)).
- **The `sort` suffix is what makes that seeding safe.** Seeding under `lyrics(slug)` would have
  handed the profile's date-ordered page to whichever section mounted first, including Populaires.
  With the sort in the key, the seed lands only on Récentes and Populaires fetches its own data.
- Nothing else is seeded. The identity block and socials ride along on `detail(slug)` because they
  are fields on the profile entity, not separate queries; every other section starts empty.
- `!artist || artist.defaultTab === null` → `notFound()`. Zero-content artists 404
  ([01](01-overview.md), locked). The entity records the condition; the route enforces it.

The index page passes `searchParams` down as `initialLetter` / `initialSearch` /`initialPage` and
lets the client query own the fetching, mirroring `ArticlesPage`. Once Gap 1 ships, seeding the
directory's first page from the server is a worthwhile follow-up for crawlability — the same
`initialData` shape as the tabs.

## staleTime

| Query | `staleTime` | Why |
|---|---|---|
| `directory` | 5 min | An artist directory changes when an artist gains their first published item — hours or days, not seconds |
| `detail` | 5 min | Name, bio, avatar, verification, identity and socials are all editorial fields |
| `lyrics` (`publishedAt`) / `videos` / `news` | 2 min | New content is published more often than artists are added, but not within one session |
| `lyrics` (`views`) | 5 min | Ranked by a counter that moves constantly but changes *order* slowly; a shorter window would refetch to produce the same ten cards |
| `releases` | 10 min | A discography gains an entry a few times a year |

Releases at 10 minutes are the most static data on the page: a discography gains an entry a few
times a year, and nothing on this profile decays with the wall clock — an earlier version carried
merch and tour dates, which did, and both were cut ([01](01-overview.md)).

Nothing here is user-specific and nothing is a live counter, so the global default (immediately
stale, refetch on mount) would refetch a directory that has not moved on every back-navigation.
`gcTime` stays at the library default.

`refetchOnWindowFocus` stays off for all of them: the user tabbing away and back is not a reason
to re-fetch a directory, and on the profile it would visibly re-render the catalog under them.

## Invalidation

This surface is entirely read-only — no mutations, therefore no invalidation matrix. The only
cache-eviction rules worth stating:

| Situation | Action |
|---|---|
| Letter or search changes | Nothing. It is a different key; the previous filter's pages stay cached and returning to `Tous` is instant |
| Tab switch | Nothing. Cached pages are the point |
| Expanding past tour dates | Nothing. `tour(slug, true)` is a different key; collapsing again is instant |
| Navigating away from a profile | Nothing. `gcTime` handles it; a back-press should be instant |
| Admin verifies an artist | Not observable from this surface. `staleTime` bounds the badge's staleness to 5 minutes |

If a claim CTA is ever added ([22](22-verified-artists-and-claiming.md)), submitting a claim
invalidates nothing — a claim request grants no badge, so no rendered state changes.
