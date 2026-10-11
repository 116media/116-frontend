# 08 — Catalog Sections

What renders inside each tab panel, section by section.

> **Scope history.** The first version covered three sections (lyrics / videos / albums); a later
> one added merch, tour and featured-on, all since cut. [01](01-overview.md) now requires **five**
> content types, rendered as six sections. An early draft also claimed the artist→album
> relationship did not exist — **that was wrong**: `AlbumEntity.ArtistId` already exists and only
> the query path is missing ([15](15-backend-current-state.md), Gap 3).

Tab structure and why `Musique` holds four stacked sections: [07](07-artist-detail-tabs.md).
Gap numbers refer to [16](16-backend-gaps-and-contracts.md).

## Shared shape

```
┌─────────────────────────────────────────────┐
│  Chansons populaires                        │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                │
│  └────┘ └────┘ └────┘ └────┘                │
├─────────────────────────────────────────────┤
│  Dernières chansons (24)                    │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                │
│              [ Voir plus ]                   │
└─────────────────────────────────────────────┘
```

Every section: `<h2>` heading with count where paginated → grid or list → load-more when paginated.
Same paging control and end-of-list treatment as the index ([04](04-artists-index-page.md)).

## Rules that apply to every section

- **Reuse the existing card.** `LyricsCard` for anything song-shaped, `VideoCard` for anything
  video-shaped. Do not build artist-page-specific variants.

  > ⚠️ **Blocking dependency:** there is **no `lyrics` frontend module today**, so `LyricsCard`
  > does not exist. Either the lyrics feature ships first, or this feature builds `LyricsCard`
  > *in the lyrics module* (not in `artists`) so it stays the shared owner. Tracked in
  > [24](24-implementation-plan.md).

- **The artist name is suppressed on cards** in the artist's own sections. Repeating "Fally Ipupa"
  on 24 cards on Fally Ipupa's page is noise. This needs a prop on the existing card
  (`showArtist={false}`), not a fork — see [10](10-components-and-reuse.md). It is unconditional
  here: every section on this page shows the artist's own work, so the name is never the point.

  > `VideoCard` renders no artist name today, so the suppression rule is currently a no-op for
  > videos. Do not add a dead `showArtist` prop to it until it actually shows one.

- **Counts come from pagination totals**, never from the loaded page length — which would show "4"
  while the hero shows "24" ([06](06-artist-detail-hero.md)). Non-paginated sections (Populaires,
  Albums, Mixtapes) show no count in the heading.
- **Preview grids render only above 10 items.** At or below, the preview duplicates most of the
  list directly beneath it.
- **An empty section is not rendered** — no heading, no placeholder ([09](09-loading-empty-error.md)).
- **A section whose gap has not shipped simply does not exist.** No "coming soon", no disabled tab.

## Grid columns

All five breakpoints are given explicitly. An earlier draft listed four values and left `xl`
ambiguous — corrected.

| Section | base | sm | md | lg | xl | Page size |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Chansons populaires | 1 | 2 | 2 | 2 | 2 | 10, fixed |
| Dernières chansons | 2 | 3 | 4 | 5 | 5 | 20 |
| Albums | 2 | 3 | 4 | 5 | 6 | 12 |
| Mixtapes | 2 | 3 | 4 | 5 | 6 | 12 |
| Vidéos | 1 | 2 | 2 | 3 | 4 | 12 |
| Actualités | 1 | 2 | 2 | 3 | 3 | 12 |

Song and article grids cap at 5 and 3 respectively because a tab panel sits inside the page's
content column — a 6th column of song cards makes them too narrow to read a title. Album covers are
square and carry only a name and a year, so they tolerate 6.

---

## `Musique` → Chansons populaires

The section that makes the profile feel alive rather than archival.

| Property | Value |
|---|---|
| Card | `LyricsCard` in its **row/compact** variant, with a rank number |
| Ordering | `ViewCount` descending, `PublishedAt` descending as tie-break |
| Size | Top 10, fixed. No paging |
| Grid | 1 / 2 / 2 / 2 / 2 — two columns of five rows at `sm+` |
| Empty | Hidden. Also hidden when the artist has ≤ 10 songs total |
| Backend | ✅ **no gap** — `sort=views` on `GET /public/lyrics`, scoped by artist |

**Ranking metric: `ViewCount` alone.** Not likes, not shares, not a composite.

- Views are the only **densely populated** signal. Likes and shares require a deliberate user
  action and will be zero or near-zero on the long tail, which would produce a "popular" list
  ordered by three ties.
- A composite (`views + 10×likes + 20×shares`) requires weights nobody can defend, and it changes
  the answer without changing anything the user can see. Any weighting we invent today will be
  argued about forever and re-tuned by feel.
- A single sort key is **explainable in one sentence** — "most read" — and that is exactly what the
  label should say. If the French label reads better as *"Les plus écoutées"*, that is a lie:
  we count reads, not plays. Use *"Les plus lues"* / *"Most read"* ([12](12-i18n.md)).
- It costs nothing. `sort=views` already exists.

Revisit only if a real engagement model lands. Recorded in [25](25-open-questions.md).

**Why it is hidden below 11 songs:** with 8 songs, "the 10 most popular" is the whole catalog
reordered, printed directly above the same catalog in date order. The section adds nothing and
doubles the page.

**Rank numbers are decorative.** `1.`–`10.` render as `aria-hidden` text; the ordered list itself
carries the ordering for assistive tech (`<ol>`). Do not put "Number 1" in the accessible name.

## `Musique` → Dernières chansons

The backbone list. This is what the old "Lyrics tab" was.

| Property | Value |
|---|---|
| Card | `LyricsCard`, default vertical variant, `showArtist={false}` |
| Ordering | `PublishedAt` descending |
| Size | Page size 20, load-more |
| Grid | 2 / 3 / 4 / 5 / 5 |
| Empty | Hidden |
| Backend | ✅ already in the profile payload as `PaginatedResult<LyricsSummaryDto>` |

This list reflects `LyricsEntity.ArtistId`, which already means "primary credit" — so it is an
artist's own catalog, not everything they appeared on. An earlier version of this doc required a
credits join table to enforce that; the join table was cut along with the `Featured on` section it
existed to serve, and the existing column already gives the correct behaviour.

## `Musique` → Albums

| Property | Value |
|---|---|
| Card | New minimal `ReleaseCard`: cover, name, release year |
| Ordering | `ReleaseYear` descending, then `Name` ascending |
| Size | Page size 12 — realistically one page for every artist |
| Grid | 2 / 3 / 4 / 5 / 6 |
| Empty | Hidden |
| Backend | ❌ **Gap 3** (artist-scoped album query) + **Gap 4** (`type=Album`) |

**Album cards are not links in v1.** There is no album detail page. A card that looks clickable and
does nothing is worse than a static card — so it is styled as a tile, not a link: no hover-lift, no
pointer cursor, no focus ring, not in the tab order.

Gap 3 is **repository method + endpoint, no migration** — `AlbumEntity.ArtistId` already exists.
This is the cheapest of the outstanding gaps and the first that should land.

**"Page size 12" is a real pager, not a cap.** Every `Size` in this document means a paginated
request that returns `PaginatedResult<T>` and can be advanced. The note *"realistically one page
for every artist"* is an observation about the data, not a promise the second page is unreachable —
truncating a discography at 12 would silently hide a prolific artist's early work.

What varies is only whether the **control** renders: the pager is hidden while `totalPages === 1`,
which is why most artists appear to have an unpaginated grid. Every section on this page paginates;
there are no exceptions ([21](21-performance-and-pagination.md)).

## `Musique` → Mixtapes

Identical to Albums in every respect except the filter and the heading.

| Property | Value |
|---|---|
| Card | `ReleaseCard` — the same component, not a variant |
| Ordering | `ReleaseYear` descending, then `Name` ascending |
| Size | Page size 12 |
| Grid | 2 / 3 / 4 / 5 / 6 |
| Empty | Hidden — which is the normal case for most artists |
| Backend | ❌ **Gap 3** + **Gap 4** (`type=Mixtape`) |

**Two headings, not a filter chip.** A "Albums / Mixtapes" toggle inside one section was rejected:
the two sets are small, they are usually one or two items each, and a toggle hides half the
discography behind an interaction to save ~200px of scroll.

Gap 4 also adds `EP` and `Single` to the enum. **v1 renders neither** — an EP under a "Mixtapes"
heading is a factual error, and giving each of four types its own heading on an artist with one
release each produces four sections of one card. If `EP`/`Single` volume ever justifies it, they
join as their own sections, not as fake mixtapes.

## `Vidéos`

| Property | Value |
|---|---|
| Card | `VideoCard` from the existing videos module |
| Ordering | `PublishedAt` descending |
| Size | Page size 12 — video cards are visually heavier |
| Grid | 1 / 2 / 2 / 3 / 4 |
| Empty | Tab hidden |
| Backend | ✅ already in the profile payload as `PaginatedResult<VideoSummaryDto>` |

Preview grid ("Dernières vidéos", 3 items) only above 10 items.

Like the songs list, this reflects `VideoEntity.ArtistId` — the artist's own videos, not guest
appearances.

## `Actualités`

| Property | Value |
|---|---|
| Card | `ArticleCard` from the existing articles module — reuse, do not rebuild |
| Ordering | `PublishedAt` descending |
| Size | Page size 12 |
| Grid | 1 / 2 / 2 / 3 / 3 |
| Empty | Tab hidden |
| Backend | ❌ **Gap 5** — `ArticleArtist` join table |

A join table, not a single FK: articles routinely cover several artists, and a single FK forces an
arbitrary choice for "news about Fally and Ferré".

The real cost here is editorial, not technical. Tagging is an admin action on every new article
plus a backfill of the existing archive; an untagged archive means the tab is empty on artists who
obviously have coverage, which reads as a bug. Flag this in the rollout —
[25](25-open-questions.md).

Article cards **do** link out to the article detail page (unlike album cards) — that page exists.

---

## Preview grids

- Render only when the section has **more than 10 items**.
- Show the first 4 (songs, articles) or 3 (videos) items.
- Use the same card at the same size — no "featured" variant. The heading provides the framing.
- **A preview's label must match its actual sort key.** "Dernières" for date order, "Populaires"
  for view order. Labelling date-ordering as popularity is a lie the UI would be telling
  ([02](02-inspiration-benchmark.md)).

Populaires, Albums and Mixtapes never get a preview — they are already short,
fixed-size sections.

## Cross-linking

Every song, video and article card links to its own detail page. Those pages link *back* to this
profile via the artist name ([03](03-information-architecture.md)), closing the loop:

```
lyrics detail ──artist name──> artist profile ──card──> another lyrics detail
```

That loop is the core value of the whole feature. The video→artist half needs **Gap 6**
(`ArtistSlug` on the video detail response); the lyrics half already works.

## Counts

The heading count (`Dernières chansons (24)`) is the pagination total, matching the hero stat row
exactly ([06](06-artist-detail-hero.md)). One number, one source.

Sections without a total — Populaires — show no count rather than counting the
rendered rows.
