# 02 — Inspiration Benchmark: HotNewHipHop

Teardown of [hotnewhiphop.com/artists](https://www.hotnewhiphop.com/artists) and an individual
profile (`/artist/drake`), with an explicit adopt / adapt / reject call on each pattern.

The point is not to clone HNHH. It is a mature hip-hop media site with the same core problem
we have — a large artist catalog attached to heterogeneous content — so its solutions are worth
reasoning about. It also carries a decade of accumulated features we should not inherit.

---

## What HNHH's index page does

| Pattern | Observed |
|---|---|
| Layout | Uniform card grid |
| Card content | Cover image (~228×152, landscape), artist name, "View" affordance |
| Card metadata | **None** — no counts, no genre, no follower numbers |
| Navigation | Alphabet rail `A–Z` plus `#`, jumping to artists by initial |
| Search | Global header search input |
| Paging | Continuous/lazy loading, no numbered pagination |

### Calls

| Pattern | Call | Reasoning |
|---|:---:|---|
| Uniform card grid | **Adopt** | Correct for a directory. Scannable, responsive, no ranking implied. |
| Landscape image | **Adapt → square** | HNHH uses landscape press photos. Artist identity reads better as a square/circular avatar, and our `AvatarFileId` is an avatar, not a press shot. |
| Bare card (name only) | **Adapt** | Too bare. We add a content count ("12 items" — lyrics + videos, deliberately type-neutral) because it is the one honest, cheap signal we already have and it tells a user whether the profile is worth opening. |
| "View" button on each card | **Reject** | The whole card is the link. A redundant button adds a tab stop per card and hurts keyboard navigation. |
| Alphabet A–Z rail | **Adopt** | The single most valuable pattern here. Directories without it force search-or-scroll. See [05](05-alphabet-search-and-filters.md). |
| Global header search | **Adapt → scoped** | We add an artist-scoped search on the page itself. Reusing global search would return lyrics/videos/articles too. |
| Infinite scroll | **Adapt → "Load more"** | Infinite scroll on a directory traps keyboard users and breaks the footer. An explicit button is accessible and preserves deep-linkable paging. |

---

## What HNHH's profile page does

| Pattern | Observed |
|---|---|
| Hero | Large press photo, real name, aliases, birthdate, hometown |
| Socials | Instagram / Twitter / Facebook links |
| Stat row | Counts: news `3865`, songs `281`, mixtapes `22`, videos `163` |
| Tabs | News · Songs · Mixtapes · Videos |
| "Top Songs" | 5-item grid — artwork, title, credited artists, release date |
| "Top Albums & Mixtapes" | 5-item grid, same shape |
| Discography | Full chronological list, typed (album / mixtape / collab) |
| Biography | Long-form prose, multi-section |

### Calls

| Pattern | Call | Reasoning |
|---|:---:|---|
| Hero with avatar + name | **Adopt** | Baseline identity. We have `Name` and `AvatarFileId`. |
| Stat row with counts | **Adopt** | Cheap, honest, and immediately orienting. Derived from pagination totals we already return — no new aggregation. See [06](06-artist-detail-hero.md). |
| Tabs per content type | **Adopt** | Maps exactly onto our lyrics / videos / albums split. |
| "Top N" preview grids | **Adopt** | ~~We have no ranking signal~~ — **corrected**: `LyricsEntity` carries `ViewCount`/`LikeCount`/`ShareCount` and `GET /public/lyrics` already supports `sort=views\|likes\|shares`. Popularity is real and computable, so "Popular songs" ships alongside "Latest". See [08](08-catalog-sections.md). |
| Biography | **Adopt (short)** | `ArtistEntity.Bio` exists. Render it, clamped, with expand. No multi-section long-form. |
| Real name, aliases, birthdate, hometown | **Adopt** | Requested. None of these columns exist — each is a schema addition plus an editorial burden to populate and keep accurate. See [16](16-backend-gaps-and-contracts.md) Gap 7. |
| Social links | **Adopt** | Requested. Modelled as a child table keyed by platform, mirroring the existing `StreamingLinkEntity` — see [16](16-backend-gaps-and-contracts.md) Gap 8. |
| News tab | **Adopt** | Requested. `ArticleEntity` has no `ArtistId`, so this needs a migration + admin tagging + backfill — see [16](16-backend-gaps-and-contracts.md). |
| Mixtapes as a distinct type | **Adopt** | Requested. `AlbumEntity` has no release-type discriminator today, so this needs one new column — see [16](16-backend-gaps-and-contracts.md). |
| Discography timeline | **Adopt** | Requested. Becomes the Discography surface grouping releases by type and year — see [08](08-catalog-sections.md). |

---

## The two lessons worth stealing

**1. Counts before content.** HNHH tells you a profile has 281 songs before you scroll. That one
row sets expectations and makes the tabs meaningful. We can do this for free from pagination totals.

**2. Alphabet navigation is not optional for a directory.** For a browsing user with no specific
artist in mind, A–Z is the only affordance that makes a large list tractable. Search only helps
users who already know the name.

## The trap worth avoiding

These identity fields are now in scope, so the trap is no longer *whether* to ship them — it is
shipping them with nothing in them. A profile showing an empty `Nom réel —` row reads as broken,
not as sparse.

**Every one is nullable and every one is omitted from the UI when null**
([06](06-artist-detail-hero.md)). The identity block shrinks to whatever is actually known, so an
artist with only a name still renders a clean hero. That constraint is what makes an unstaffed
backfill survivable.
