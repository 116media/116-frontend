# Lyrics Page — Design & Implementation Docs

Design and implementation documentation for the web frontend's **lyrics** feature — a public,
SEO-optimised lyrics catalog (`/lyrics` listing + `/lyrics/{slug}` detail, Genius-style clean URLs)
with cover art, song credits, view/like/share counts, and a similar-lyrics section — plus two
things it required along the way: a small **`videos`-module cross-link** (the embedded lyrics tab
now links out to the full page), and a companion fix for the **"ARTISTES"** nav link, which
already exists and is already wired into the header but points at a route that has never been
built. It gets a real `/artistes` page with a "coming soon" placeholder.

These docs mirror the structure of [`../short-videos/`](../short-videos/) and
[`../page-titles/`](../page-titles/): numbered design docs (the *why* and the *what*), a `specs/`
folder of implementation-ready, JSDoc'd, checklist-tracked specs (the *how*).

This is **documentation only** — no code is written into the codebase from these files. The
`specs/` snippets are the contract an implementer copies from once the go-ahead is given.

---

## The feature at a glance

Lyrics start from a partial backend model — entity, DTO, admin CRUD, and two public lookups
(`GET /public/lyrics/{songTitle}/{artistName}`, `GET /public/lyrics/by-video/{videoId}`) — but
there is **no public listing endpoint, no stored slug, no language filter, no cover image, no song
credits beyond artist name, and no view/like/share tracking**. The frontend has **no lyrics module
at all**. What already exists on the frontend is narrower than it looks:

- The header nav already renders **"LYRICS" → `/lyrics`** and **"ARTISTES" → `/artistes`**
  (`Header/constants.ts`) — both links 404 today, since neither route exists.
- The video detail page already renders lyrics **inline**, in a tab, via `VideoDetailLyrics` and
  `IVideoLyricsEntity` — that view stays, but gains a link out to the new standalone page.
- No "Artist" domain exists anywhere in the backend — `ArtistName` is a plain string field on
  `LyricsEntity` (and on videos), not a profile. `/artistes` is scoped as a placeholder only.

1. **`/lyrics`** — a public, searchable listing with a language filter (full ISO 639-1 list, not a
   fixed handful — see decision 6), paginated
   ([04-routes-and-artist-placeholder.md](04-routes-and-artist-placeholder.md)).
2. **`/lyrics/{slug}`** — the standalone SEO detail page: cover art, song credits, engagement bar
   (views/likes/shares), full lyrics text, a "watch the video" cross-link when linked, a
   similar-lyrics section, JSON-LD structured data
   ([04-routes-and-artist-placeholder.md](04-routes-and-artist-placeholder.md)).
3. **New `lyrics` module** — its own domain/application/infrastructure/presentation layers, sized
   between `videos` (read-only) and `articles` (comments + bookmarks) — it has view/like/share, the
   three simplest interactions `shorts` has, and nothing more ([03-frontend-module.md](03-frontend-module.md)).
4. **Backend changes** — a stored `Slug` column, cover image + song credits, a full view/like/share
   interaction system, a similar-lyrics query, a public list endpoint with a language filter, and
   the by-slug lookup resolving a linked video's slug server-side
   ([02-backend-contract.md](02-backend-contract.md), and specs
   [10](specs/10-backend-song-metadata-and-cover.md), [11](specs/11-backend-interactions.md),
   [12](specs/12-backend-similar-lyrics.md)).
5. **A small `videos`-module addition** — `VideoDetailLyrics` gains a "View full lyrics" link
   ([specs/09-video-cross-link.md](specs/09-video-cross-link.md)).
6. **`/artistes`** — a real route, "coming soon" placeholder, reusing the existing `EmptyState`
   component ([04-routes-and-artist-placeholder.md](04-routes-and-artist-placeholder.md)).

---

## What the backend supports (and does not)

| Capability | Supported today | Auth |
| --- | --- | --- |
| Get by song title + artist name (two raw segments, not a slug) | Yes | Anonymous |
| Get by linked video id | Yes | Anonymous |
| **List / search (paginated)** | **No — admin-only today** | — |
| **Stored, unique slug** | **No** | — |
| **Language filter** | **No** | — |
| **Cover image** | **No** | — |
| **Song credits** (album, release year, label, songwriter, producer) | **No — only artist name** | — |
| **View / like / share tracking** | **No — zero interaction tracking today** | — |
| **Similar lyrics** | **No** | — |
| Create / update / delete / update SEO | Yes | Admin |
| "Artist" as a domain concept | **No — doesn't exist** | — |

The entity already has `MetaTitle`, `MetaDescription`, and `StructuredData` fields specifically for
its SEO-landing-page use case (see the entity's own doc comment: *"Lyrics pages are SEO-optimised
standalone pages that target keyword searches"*), and no publish/draft workflow at all — unlike
articles and videos, every lyrics record is public the moment it's created, so the new list
endpoint is a thin wrapper over the exact `GetAllAsync` the admin endpoint already calls, no status
filter needed. Everything else in the table above is new backend work, specced in full in
[specs/01](specs/01-backend-public-list-endpoint.md), [10](specs/10-backend-song-metadata-and-cover.md),
[11](specs/11-backend-interactions.md), and [12](specs/12-backend-similar-lyrics.md).

## Decisions already made

All resolved in [05-open-questions.md](05-open-questions.md) — only the JSON-LD schema type
(question 3) is still open:

1. **URL shape**: a real stored `Slug` column, not the existing two-segment route reused as-is —
   `/lyrics/{artist}-{title}-lyrics` (e.g. `/lyrics/fally-ipupa-mayday-lyrics`), Genius-style,
   generated via this codebase's normal `generateSlug(text, { unique: true })` convention, no
   special-cased collision handling.
2. **Author / songwriter**: `LyricsDto.Author` (CMS attribution — who entered the record) is never
   surfaced publicly. The requested songwriter credit is a distinct new field, named `Songwriter` —
   not `Author` — specifically to avoid colliding with that existing, unrelated field.
3. *(open)* JSON-LD schema type — `MusicComposition` (+ nested `MusicRecording` for
   artist/album/label/year) recommended.
4. **Video cross-link (lyrics → video)**: resolved server-side, no second frontend fetch.
5. **Video cross-link (video → lyrics)**: implemented now, not deferred — `VideoDetailLyrics`
   gains a link.
6. **Language filter**: added. A field nobody could act on was dead data.

## Design docs

| File | What it covers |
| --- | --- |
| [01-overview.md](01-overview.md) | Current state audit, scope, and what's already half-built (nav links, embedded video lyrics) |
| [02-backend-contract.md](02-backend-contract.md) | Full inventory of the existing backend contract + all required changes |
| [03-frontend-module.md](03-frontend-module.md) | The new `lyrics` module's layers, why it's sized between `videos` and `articles` |
| [04-routes-and-artist-placeholder.md](04-routes-and-artist-placeholder.md) | Route tree, the slug decision, the full page composition (cover/credits/engagement/similar), JSON-LD, both video cross-links, the `/artistes` placeholder |
| [05-open-questions.md](05-open-questions.md) | All six decisions — five resolved, one (JSON-LD schema) still open |

### Phase 2 — Musixmatch-scale expansion

A larger, separate phase on top of the MVP above: homepage discovery sections, a redesigned detail
page (artist links, community-reviewed AI translations, album-mates card, streaming-platform
launcher), an `Artist`/`Album`/`Tag` domain, community-submitted lyrics and corrections, and a
monetization model. Not required for the MVP to ship.

| File | What it covers |
| --- | --- |
| [06-musixmatch-scale-expansion.md](06-musixmatch-scale-expansion.md) | Homepage rails (lyrics videos, top lyrics, new lyrics), detail-page redesign, why `Artist`/`Album`/`Tag` entities are now needed |
| [07-community-and-monetization.md](07-community-and-monetization.md) | Who can add content (admin / verified artist / community queue), the review workflow, revenue streams, illustrative pricing |
| [08-db-schema.md](08-db-schema.md) | Full schema for every new/changed table, and why no explicit multi-statement transactions are needed anywhere in this feature |
| [09-view-count-algorithm.md](09-view-count-algorithm.md) | The read-time-based algorithm that decides when a page view actually counts |

## Specs

Implementation-ready, in [specs/](specs/) — start at [specs/00-index.md](specs/00-index.md).
Eighteen specs total: the MVP (three frontend specs for the read path (02, 03) and pages (04, 05),
one the artist placeholder (06), one i18n (07), one verification (08), one the `videos`-module
cross-link (09), and four the backend (01, 10, 11, 12)) plus the phase-2 expansion (13–18: artist/
album entities, tags, translations & review, album/streaming links, community submissions &
monetization, and the frontend homepage/detail redesign).

## Reference material

The backend contract lives in `apps/backend`
(`Modules/Content/Content/Application/Editorial/UseCases/Public/Queries/GetLyricsBySlug` and
`GetLyricsByVideoId` for what exists today; `GetPublishedArticles` and `AdminCreateArticleHandler`
are the structural templates for the new public list endpoint and the slug-uniqueness check;
`ShortVideoEntity` and its like/share/view-event system is the structural template for the new
interaction tracking; `ArticleEntity.CoverImageFileId` is the template for the cover image). The
**videos** module (`apps/frontend/src/modules/videos`) is the frontend template the new `lyrics`
module's read path mirrors most closely, and is also the one existing module this feature edits
directly (spec 09); the **shorts** module is the template for the interaction hooks
(`useToggleShortLike`, `useShareShort`, `useRecordShortView`). The **page-titles** feature
(`../page-titles/`) is reused as-is for this feature's route titles — `getServerTranslation()` and
the `generateMetadata` pattern it establishes apply unchanged.
