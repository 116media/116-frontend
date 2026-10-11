# 16 — Backend Gaps & Required Contracts

Every backend change the design requires, derived from [14](14-data-requirements.md) against
[15](15-backend-current-state.md). Ordered by blocking severity.

> These are **frontend-authored requirements**, not implementation-ready backend specs. The
> authoritative implementation spec belongs in `apps/backend/docs/`, following the precedent set
> by the lyrics feature ([`../lyrics-page/specs/13-backend-artist-and-album-entities.md`](../lyrics-page/specs/13-backend-artist-and-album-entities.md)
> is a pointer, not a copy). Do not duplicate C# here — it drifts.

---

## Gap 1 — Public artist list endpoint  🔴 blocks the entire index page

**Proposed:** `GET /api/v1/public/artists`

| Param | Type | Default | Notes |
|---|---|---|---|
| `page` | int | 1 | |
| `pageSize` | int | 30 | |
| `letter` | string? | — | `A`–`Z` or `#`; mutually exclusive with `search` |
| `search` | string? | — | min 2 chars, name only, `ILIKE` |

Response: `PaginatedResult<ArtistSummaryDto>` + `availableLetters: string[]`.

```
ArtistSummaryDto: { name, slug, avatarUrl, isVerified, contentCount }
```

**Mandatory semantics:**

- Returns **only artists with surfaceable content**. Not a client filter — unlisted stubs must
  never reach the response ([04](04-artists-index-page.md)). See the definition below; it is not
  a fixed column list.
- Ordered by `Name` ascending, accent- and case-insensitive.
- `letter` buckets on the **accent-folded** first character; non-letters bucket to `#`.

`AdminGetAllArtistsQuery` is the closest existing sibling and a reasonable starting point — but the
public one differs in filter, projection, and the published-content requirement. It is not a
copy-paste.

### "Surfaceable content" is one definition, used three times  🔴

> **Corrected.** An earlier version of this gap hard-coded the filter as *"≥1 published lyrics page
> or video"* and `contentCount` as `COUNT(lyrics) + COUNT(videos)`. That contradicts
> [01](01-overview.md) decision 4, which — after the scope expansion — defines an artist's content
> as *any* of the five surfaces. An artist with only albums is a real destination, and a
> hard-coded two-table filter would hide them from the index while their profile rendered fine.

There is exactly **one** predicate, `HasSurfaceableContent(artist)`, and it must be the single
source of truth for all three of:

1. the index filter (this gap),
2. `contentCount` on `ArtistSummaryDto`,
3. the profile's 404 rule ([09](09-loading-empty-error.md)).

If those three ever disagree the page contradicts itself: an artist appears in the index with
`contentCount: 0`, or is absent from the index but reachable by URL.

**It is defined by which surfaces exist, not by a fixed column list.** It grows as gaps land:

| Surface | Counted from | Available |
|---|---|---|
| Songs | published `LyricsEntity` | today |
| Videos | published `VideoEntity` | today |
| Albums / Mixtapes | `AlbumEntity.ArtistId` | Gap 3 (no migration) |
| News | articles tagged to the artist | Gap 5 |

**Until Gaps 3 and 5 land the predicate legitimately reduces to lyrics + videos** — not because
that is the definition, but because the other tables are not reachable yet. Implement it as one
composable `Specification<ArtistEntity>` (or one query fragment) so each gap extends it in one
place. Writing it inline in the index query is how the three uses drift apart.

The consequence worth stating outright: **Gaps 3 and 5 are each also a change to this predicate**,
not only a new endpoint. A gap that ships its section without extending the predicate leaves
artists correctly rendering that section while still 404-ing or missing from the index.

### 1a — `contentCount` must not be N+1  🔴

The count is per row. Computed naively it is 30 extra queries per page. It must be a single
statement — an aggregate over the surfaces in the predicate above, grouped by artist. Today that
is lyrics + videos filtered to published; each landing gap adds a term.

This is why the predicate has to be composable rather than inline: `contentCount` and the filter
must expand together, in one edit, or the index starts listing artists whose count reads `0`.

This is the **highest-risk item in the feature**. If it ships as N+1 the index page will be the
slowest route on the site.

### 1b — `availableLetters`  🟠

`SELECT DISTINCT` of the folded initial over the same filtered set. ≤27 values, highly cacheable —
it only changes when an artist gains their first published item. Without it, the rail cannot
disable empty letters and must show all 27 as active, some leading to empty results
([05](05-alphabet-search-and-filters.md)).

Acceptable v1 degradation: ship without it, show all letters enabled. The empty-state copy already
handles a letter with no results.

### 1c — Accent-insensitive collation  🟠

`Élodie` must sort under `E` and match a search for `elodie`. Sorting and bucketing must use the
**same** folding, or a name sorts to one place and buckets to another. Postgres-side concern
(collation or a normalised generated column); a normalised column is also the natural index target
for `letter`.

---

## Gap 2 — `isVerified` on artist DTOs  🟠 blocks the verified badge

`ArtistDto` exposes no verification state. Add a derived boolean:

```
isVerified = UserId is not null && VerifiedAt is not null
```

Applies to both `ArtistDto` and the new `ArtistSummaryDto`.

**Do not expose `UserId`.** Who claimed a profile is not public information; the frontend needs only
the derived flag ([14](14-data-requirements.md)).

Low cost: DTO + mapper. Without it, ship without badges — the pages are otherwise complete.

---

## Gap 3 — Artist-scoped album query  🟡 was mis-stated as a schema change

**Correction:** `AlbumEntity.ArtistId` (nullable) **already exists** ([15](15-backend-current-state.md)).
An earlier draft of this doc claimed no artist→album relationship existed. That was wrong.

What is missing is only the query path: no artist-scoped method on `IAlbumRepository`, and no
endpoint returning an artist's releases. Repository method + endpoint, no migration.

---

## Gap 4 — Release-type discriminator (album vs mixtape)  🟠 blocks the mixtapes section

`AlbumEntity` has `Name`, `ArtistId`, `CoverImageFileId`, `ReleaseYear`, `Label` — and no type.
Album and mixtape are therefore indistinguishable.

Needs an `EnumReleaseType { Album, Mixtape, EP, Single }` column with a default, plus the admin
create/update surface to set it, plus a backfill decision for existing rows (default them to
`Album` and let editors correct, rather than blocking on a full audit).

`EP` and `Single` are included in the enum from the start even though the UI only groups
album/mixtape — adding enum members later is cheap, but re-classifying live rows is not.

---

## Gap 5 — Article → artist  🟠 blocks the News section

Was previously out of scope; now required ([01](01-overview.md)).

`ArticleEntity` has no `ArtistId`. Given articles routinely mention several artists, this should be
a **join table** (`ArticleArtist`), not a single FK — otherwise "news about Fally and Ferré" forces
an arbitrary choice.

Cost: migration + admin tagging UI + backfill of existing articles (which is editorial work, not
just a script).

---

## Gap 6 — Artist name on the video detail response  🟡 blocks one entry point

The lyrics detail response already returns `ArtistSlug`, so the lyrics→artist link is free. The
video detail response does not, so the video→artist link needs either that field added or a second
fetch. Adding the field mirrors what lyrics already does.

---

## Gap 7 — Artist identity fields  🟠 blocks the identity block

`ArtistEntity` today is `Name`, `Slug`, `Bio`, `AvatarFileId`, `UserId`, `VerifiedAt`. The requested
identity fields need four new nullable columns:

| Column | Type | Note |
|---|---|---|
| `RealName` | `string?` | |
| `Aliases` | `string[]` | Npgsql maps `List<string>` to `text[]` natively — no join table needed for a display-only, never-queried list |
| `Birthdate` | **`DateOnly?`** | **Not** `DateTimeOffset`. A timestamp shifts a birthday across timezones |
| `Hometown` | `string?` | Free text, not a structured place reference |

All nullable, all omitted from the UI when null ([06](06-artist-detail-hero.md)). No backfill is
required to ship — the block simply renders whatever exists.

Also needs: admin create/update surface for the four fields, and max-length validation consistent
with the existing editorial validators.

**Non-schema requirement:** these are factual claims about real people on mostly-unclaimed profiles.
Editorial sourcing and a correction path are a policy decision, flagged in
[06](06-artist-detail-hero.md), not solved by the migration.

---

## Gap 8 — Artist social links  🟠 blocks the socials row

Do **not** add `InstagramUrl`, `TwitterUrl`, `FacebookUrl`, … as columns. The codebase already has
the right pattern in `StreamingLinkEntity` (`AlbumId`/`LyricsId` + `Platform` enum + `Url`).

Mirror it:

```
ArtistSocialLink { ArtistId, Platform, Url }
EnumSocialPlatform { Instagram, X, Facebook, YouTube, TikTok, Website }
```

Why a child table over columns: adding a platform becomes an enum member rather than a migration,
the unique constraint `(ArtistId, Platform)` is expressible, and ordering is controllable. It also
matches an existing, tested shape in the same module.

Frontend constraints: unknown enum values must be **skipped** by the UI rather than rendered
generically, so adding a platform backend-first is safe. `Url` is display-and-navigate only — never
parsed for a handle.

---

## Summary

| # | Gap | Severity | Blocks |
|---|---|:---:|---|
| 1 | Public artist list endpoint | 🔴 | entire index page |
| 1a | `contentCount` without N+1 | 🔴 | index performance |
| 1b | `availableLetters` | 🟠 | letter disabling (degradable) |
| 1c | Accent-insensitive collation | 🟠 | correct sort/bucket for accented names |
| 2 | `isVerified` on DTOs | 🟠 | verified badge (degradable) |
| 3 | Artist-scoped album query | 🟡 | albums section — **no migration** |
| 4 | Release-type discriminator | 🟠 | mixtapes vs albums |
| 5 | Article → artist join table | 🟠 | News section |
| 6 | `ArtistSlug` on video detail | 🟡 | video→artist entry point |
| 7 | Artist identity fields | 🟠 | identity block (real name, aliases, birthdate, hometown) |
| 8 | Artist social links | 🟠 | socials row |

**Popular songs needs no gap** — `ViewCount`/`LikeCount`/`ShareCount` exist on `LyricsEntity` and
`GET /public/lyrics` already supports `sort=views|likes|shares`.

### Delivery reality

Gap 5 is a **many-to-many migration plus ongoing editorial work** (someone has to tag articles),
not endpoint work, and should not be treated as part of one "artist page" ticket. See
[24](24-implementation-plan.md) — the profile ships in layers, and every section degrades
independently by simply not rendering.

Three gaps were removed outright rather than deferred when merch, tour and featured credits were
cut from v1 ([01](01-overview.md)): a merch domain, a tour-dates domain, and a credits join table.
Those were the three most expensive items here; what remains is dominated by Gap 1's index
endpoint and Gap 5's article tagging.
