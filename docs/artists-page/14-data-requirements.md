# 14 — Data Requirements

Derived from the page designs in [04](04-artists-index-page.md)–[08](08-catalog-sections.md).
This is the frontend stating what it needs; [16](16-backend-gaps-and-contracts.md) turns it into a
backend contract.

> Scoped to the **six** content types the profile surfaces ([01](01-overview.md)). Gap numbers below
> refer to [16](16-backend-gaps-and-contracts.md).

## Index page (`/artistes`)

### Per artist in the grid

| Field | Type | Used by | Available today |
|---|---|---|:---:|
| `slug` | `string` | card link | ✅ |
| `name` | `string` | card label, sort, bucket | ✅ |
| `avatarUrl` | `string \| null` | card avatar | ✅ |
| `isVerified` | `boolean` | inline badge | ❌ not on `ArtistDto` |
| `contentCount` | `number` | "12 chansons" | ❌ not computed anywhere |

### Per response

| Field | Used by | Available |
|---|---|:---:|
| `total` | header count, load-more exhaustion | ✅ if paginated |
| `availableLetters` | disabling empty letters in the rail | ❌ |

### Query inputs

`page`, `pageSize`, `letter`, `q` — plus the implicit, non-negotiable filter **"has surfaceable
content"** ([04](04-artists-index-page.md)), which is one shared predicate rather than a fixed
column list ([16](16-backend-gaps-and-contracts.md)).

### Two things worth calling out

**`contentCount` is a per-row aggregate.** It counts the same surfaces the filter tests — today
`COUNT(lyrics) + COUNT(videos)`, growing a term per landing gap. Computed naively that is an N+1
across the page. It must be a join/subquery computed in the same statement, or the index
page will issue 30 extra queries per page load. This is the single biggest performance risk in the
feature ([21](21-performance-and-pagination.md)).

**`availableLetters` is one cheap query** — a `SELECT DISTINCT` over the normalised initial across
the same filtered set. It returns at most 27 values and can be cached aggressively; it changes only
when an artist is added or gains their first published item.

## Profile page (`/artistes/{slug}`)

### Hero

| Field | Used by | Available |
|---|---|:---:|
| `name` | `<h1>`, title, JSON-LD | ✅ |
| `slug` | canonical URL | ✅ |
| `bio` | clamped bio | ✅ |
| `avatarUrl` | avatar, OG image | ✅ |
| `isVerified` | badge | ❌ Gap 2 |
| `songsTotal` / `videosTotal` | stat row, tab visibility, default tab | ✅ pagination totals |
| `albumsTotal` / `mixtapesTotal` | stat row | ❌ Gap 3 + 4 |
| `newsTotal` | tab visibility, default tab | ❌ Gap 5 |

The stat row and the default-tab resolution both need **every** total in the initial payload, even
for tabs the user has not opened ([07](07-artist-detail-tabs.md)). A total is one `COUNT`; the
alternative is a flash of the wrong default tab.

### Tab-level totals

| Tab | Total needed | Available |
|---|---|:---:|
| Musique | `songsTotal`, `albumsTotal`, `mixtapesTotal` | ⚠️ one of three |
| Vidéos | `videosTotal` | ✅ |
| Actualités | `newsTotal` | ❌ Gap 5 |

### Query inputs

`slug`, plus independent `page`/`pageSize` per section (not per tab — `Musique` holds four
independently-fetched sections; see [07](07-artist-detail-tabs.md)).

## Per content type

Every field the UI actually renders. Anything not listed is not needed and should not be built.

### Popular songs — ✅ no gap

| Field | Type | Used by | Available |
|---|---|---|:---:|
| `slug`, `title`, `coverUrl` | | card | ✅ `LyricsSummaryDto` |
| `viewCount` | `number` | **ranking only**, not displayed | ✅ on `LyricsEntity` |
| `publishedAt` | `date` | tie-break | ✅ |

Sorted by `ViewCount` desc — `GET /public/lyrics` already supports `sort=views|likes|shares`.
`likeCount`/`shareCount` exist but are **deliberately unused**: rationale in
[08](08-catalog-sections.md). The count itself is not rendered on the card; ranking is conveyed by
position, and publishing raw view numbers invites comparison we have not designed for.

**Requires:** artist scoping on the public lyrics list (or a `sort` param on the existing profile
endpoint's lyrics page). No schema change, no new domain.

### Latest songs — ✅ no gap

`PaginatedResult<LyricsSummaryDto>`, already returned by `GET /public/artists/{slug}`.

| Field | Used by | Available |
|---|---|:---:|
| `slug`, `title`, `coverUrl`, `publishedAt` | card | ✅ |
| `total` | heading count, hero stat, load-more exhaustion | ✅ |

### Albums & Mixtapes — ❌ Gap 3 + Gap 4

| Field | Type | Used by | Available |
|---|---|---|:---:|
| `name` | `string` | card label | ✅ on `AlbumEntity` |
| `coverUrl` | `string \| null` | card image (from `CoverImageFileId`) | ✅ |
| `releaseYear` | `number \| null` | card sub-label, sort | ✅ |
| `artistId` | `Guid?` | the scoping filter | ✅ **already exists** |
| `releaseType` | enum | Album vs Mixtape split | ❌ **Gap 4** |
| artist-scoped query path | — | fetching them at all | ❌ **Gap 3** |

**Correction:** an earlier version of this doc listed "Artist → albums" as a *schema change*. It is
not — `AlbumEntity.ArtistId` already exists ([15](15-backend-current-state.md)). Only the repository
method and endpoint are missing. The one genuine schema change is the release-type discriminator.

No `id` and no `slug` are needed: album cards are **not links in v1** ([08](08-catalog-sections.md)).

## Field-by-field gap summary

| Need | Status | Gap | Where it lands |
|---|---|:---:|---|
| Public artist list | ❌ missing entirely | 1 | new endpoint |
| Letter bucketing + filter | ❌ | 1 | new param + normalised column/index |
| Public name search | ❌ (admin has it) | 1 | new param |
| "Has published content" filter | ❌ | 1 | endpoint semantics |
| `contentCount` per artist | ❌ | 1a | aggregate in list query |
| `availableLetters` | ❌ | 1b | new field or sibling endpoint |
| Accent-insensitive sort/search | ⚠️ unverified | 1c | collation |
| `isVerified` on `ArtistDto` | ❌ | 2 | DTO + mapper change |
| Artist-scoped album query | ❌ | 3 | repository + endpoint — **no migration** |
| Release-type discriminator | ❌ | 4 | one column + admin surface + backfill |
| Article → artist | ❌ | 6 | join table + admin tagging + editorial backfill |
| `ArtistSlug` on video detail | ❌ | 9 | DTO field |
| **Popular songs sort** | ✅ **available** | — | `sort=views` already exists |

## What the frontend explicitly does **not** need

Stated so the backend doesn't over-build:

- No artist `Id` on the client. Everything is slug-addressed; exposing ids invites their use in URLs.
- No `UserId` — who claimed a profile is not public information. Only the derived `isVerified`.
- No `createdAt`/`updatedAt` — nothing renders them.
- No bio on the **index** — cards show name and count only, and shipping bios for 30 artists per
  page is wasted payload.
- No per-section data for tabs the user hasn't opened, beyond the totals needed to decide
  visibility and the default tab.
- No commerce shape of any kind — no product, price, currency, cart, order, inventory or payment
  field. Nothing on this page sells anything ([01](01-overview.md)).
- No tour, event, venue or ticket shape, for the same reason.
- No guest/featured credit data. The profile shows an artist's **own** catalog; `LyricsEntity.ArtistId`
  and `VideoEntity.ArtistId` already mean "primary credit", which is exactly what is needed and
  requires no join table.
