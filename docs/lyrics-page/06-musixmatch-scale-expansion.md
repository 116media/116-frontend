# Lyrics Page — Musixmatch-Scale Expansion

This extends the MVP in docs 01–05 and specs 01–12 toward a full lyrics *platform*, modeled on
[musixmatch.com](https://www.musixmatch.com/): a `/lyrics` homepage with curated discovery
sections, a redesigned detail page (artist links, community-reviewed translations, an album-mates
card, a streaming-platform launcher), plus the domain concepts needed to support it — a real
**Artist** entity, a **tag** system, and an **Album** entity. The MVP's `/lyrics` and
`/lyrics/{slug}` routes stay; this doc describes what's added on top, not a rewrite.

Two new domain concepts are introduced because the expanded scope needs them, not speculatively:

- **`ArtistEntity`** — was explicitly out of scope in 01-overview.md ("no artist domain exists").
  It's now required: "the artist name links to the artist page" and "artist uploads their own
  lyrics" both need a real, addressable artist with an id, not a free-text string.
- **`AlbumEntity`** — needed to group tracks for the "more from this album" card and to attach
  streaming-platform links at the album level (one link set per album, not duplicated per song).
- **`TagEntity`** — needed because "similar lyrics" for a standalone (no-video) song currently
  falls back to "10 latest standalone lyrics," which isn't actually similar to anything. Tags give
  standalone songs a real similarity signal (genre, mood, theme), mirroring how the video module
  already uses categories for the same purpose.

Full schema for all three: [08-db-schema.md](08-db-schema.md). Backend specs:
[specs/13](specs/13-backend-artist-and-album-entities.md),
[specs/14](specs/14-backend-tags-and-similar-lyrics-v2.md).

---

## 1. `/lyrics` homepage — three new sections

The listing page (spec 04) gains curated sections above the searchable grid, in this order:

### a. Lyrics videos (3-column)

A dedicated video category, **"116 Lyrics"** — created as an ordinary manual row in the existing
`CategoryEntity` table (the same table that backs every other video category), no schema change.
An admin tags specific videos into it exactly as they'd tag any video into any other category.

The homepage renders a "Lyrics Videos" section pulling from the existing
`GET /api/v1/public/videos?categoryId={116LyricsCategoryId}` endpoint (already exists, used by
every other category rail) — the only new work is a **3-column grid variant** of the existing
`VideoCard`/`VideosGrid`, versus this app's usual video-grid column count. This is a display
variant, not a new component: `VideosGrid` gains a `columns?: 3 | 4` prop (default unchanged),
consumed only here.

The target category id is a config value (`NEXT_PUBLIC_LYRICS_VIDEO_CATEGORY_ID` or a constant
resolved server-side), not hardcoded per-environment — the category is a manually-curated data
row, and its id differs across environments.

### b. Top Lyrics

A section heading ("Top Lyrics") followed by a 3-tab control — **Most Viewed / Most Liked / Most
Shared** — each tab rendering a `LyricsGrid` of the top 10 *ordinary* lyrics (standalone or
video-linked, not the 116-Lyrics videos above) sorted by the corresponding counter, descending.

Backend: the existing public list endpoint (spec 01) gains a `sort` query param —
`?sort=views|likes|shares` (default: unset = `createdAt desc`, the current behavior) — backed by
`OrderByDescending(l => l.ViewCount / LikeCount / ShareCount)` in `LyricsQueryBuilder`, capped to
`pageSize=10` from the frontend for this section specifically (it reuses the same endpoint the
main grid uses, just with different query params — no new endpoint needed).

Frontend: `useTopLyrics(metric: "views" | "likes" | "shares")`, three small `useQuery` calls (not
`useInfiniteQuery` — fixed top-10, no pagination), switched by a `Tabs` control (reuse whatever
tab primitive `VideoDetail`'s existing tabbed sections use, if one exists in the shared UI library
— else `DropdownMenu`-style single-select tabs, consistent with the rest of this doc set's "no new
primitive without checking first" rule).

### c. New Lyrics

"New Lyrics" heading, a single `LyricsGrid` of the 10 most recently created lyrics
(`?sort=createdAt&pageSize=10`, i.e. today's default order, just capped and unpaginated for this
rail). No new backend work — this is the existing list endpoint's default sort, sliced to 10.

---

## 2. `/lyrics/{slug}` — detail page redesign

The page composition in specs 04/05 (cover hero → credits card → engagement bar → lyrics →
video link → similar lyrics) is restructured:

```text
┌─────────────────────────────────────────────┬───────────────────┐
│  Banner: cover/album art, song title,        │                   │
│  artist name (→ /artistes/{artistSlug})      │   Similar Lyrics  │
├─────────────────────────────────────────────┤   (sidebar,       │
│  Engagement bar (views · like · share)       │   sticky)         │
├─────────────────────────────────────────────┤                   │
│  Language switch (translations)              │                   │
├─────────────────────────────────────────────┤                   │
│  Lyrics body                                 │                   │
├─────────────────────────────────────────────┤                   │
│  Watch the video (if linked)                 │                   │
├─────────────────────────────────────────────┤                   │
│  Writers (songwriter / producer)               │                   │
├─────────────────────────────────────────────┤                   │
│  More from this album (card)                 │                   │
└─────────────────────────────────────────────┴───────────────────┘
```

Two-column on desktop (main column + a sticky "Similar Lyrics" sidebar), single column stacked on
mobile with the sidebar content moved below the album card.

### a. Banner — artist link

The hero banner's artist name becomes a link to `/artistes/{artistSlug}` **when the song's
`ArtistName` resolves to a claimed `ArtistEntity`** (i.e. `artistId` is non-null on the DTO); when
unclaimed (the common case at launch — most artists have no profile yet), it renders as plain text
exactly as today. This turns the `/artistes` placeholder (spec 06) into a real per-artist page for
claimed artists only — see [specs/13](specs/13-backend-artist-and-album-entities.md) for the
`ArtistEntity` shape and `/artistes/{slug}` becoming a real route for claimed artists, while
staying the "coming soon" `EmptyState` for the index (`/artistes`) until a directory is warranted.

### b. AI-translated lyrics with community review

A language switcher above the lyrics body: the original language (always available) plus any
language a translation exists for. Selecting an untranslated language triggers (or queues) an AI
translation; once generated it's saved as a `LyricsTranslationEntity` row tagged
`Source = Ai`, `Status = Published` (AI output is shown immediately, labeled "Machine translated" —
Musixmatch's own model — not gated behind review before being visible at all).

Community review is a **Wikipedia-style revision system**, not a single edit box:

- Any signed-in user can propose a correction to a translation. This creates a new
  `LyricsTranslationRevisionEntity` row (the proposed text + an edit summary), status `Pending` —
  the published translation text is untouched until the revision is accepted.
- Other users vote on pending revisions (`LyricsTranslationVoteEntity`: approve/reject + optional
  comment). A revision auto-applies once it crosses a net-approval threshold (e.g. +3), or an
  admin/moderator can apply or reject it directly at any time, same as the platform's existing
  admin-override pattern elsewhere.
- Every accepted revision becomes the new published text; the full history (every revision, who
  proposed it, its vote tally, and its outcome) stays queryable — a real edit history, not
  overwritten state.

Full workflow and schema: [07-community-and-monetization.md](07-community-and-monetization.md),
[specs/15](specs/15-backend-translations-and-review.md).

### c. Writers — moved to the bottom

The credits card (spec 05) is split: **Album / Release year / Label** stay in the top-of-page
info area (or fold into the banner itself as small metadata under the title), while **Songwriter /
Producer** move to a dedicated "Writers" section directly below the lyrics body — reads as a
credits footer, matching how Musixmatch and Genius both place songwriter credit *after* the lyrics
rather than before them.

### d. Similar lyrics — sidebar, tag-aware fallback

Moves from a below-the-fold full-width grid to a sticky right-hand sidebar (mirrors Musixmatch's
own layout). Sourcing logic gains a second signal:

1. **Video-linked and that video has a category** → same-category lyrics (unchanged from spec 12).
2. **Not video-linked (or the video has no category)** → lyrics sharing at least one **tag** with
   this song, ranked by number of shared tags then recency — **replaces** the old "10 latest
   standalone lyrics" fallback, which wasn't actually similar to anything.
3. **No tags and not video-linked** → falls back to the original "10 latest standalone" behavior,
   unchanged, so a song with zero tags still shows *something* rather than an empty sidebar.

Tags are also why a `TagEntity`/`LyricsTagEntity` many-to-many is now required — see
[08-db-schema.md](08-db-schema.md) and
[specs/14-backend-tags-and-similar-lyrics-v2.md](specs/14-backend-tags-and-similar-lyrics-v2.md).

### e. More from this album

A card at the bottom of the page listing every other `LyricsEntity` sharing the same `AlbumId`
(when the song has one), each a small row link to `/lyrics/{slug}` — reuses the summary shape, not
a new card component. Renders nothing when the song has no album or is the album's only tracked
song, same "absence is normal" rule as the similar-lyrics section.

### f. "Go to album" — streaming platform modal

A button ("Listen on…") opens a small modal listing Spotify, Apple Music, YouTube Music, and
Tidal. Each platform resolves to:

1. A stored `StreamingLinkEntity` URL for this album, if an admin/artist has set one, or
2. A generated search-query deep link (`https://open.spotify.com/search/{artist} {album}`, etc.)
   as a fallback, so the button always does something useful even for un-curated albums.

Schema and endpoint: [specs/16-backend-album-and-streaming-links.md](specs/16-backend-album-and-streaming-links.md).

---

## Frontend module impact

All of the above stays inside `src/modules/lyrics/` (plus a small new `src/modules/artists/`
module for the claimed-artist page — see specs/13) — no change to the module boundaries described
in [03-frontend-module.md](03-frontend-module.md), only additions:

- `sections/LyricsHomepageSections/` (new) — the three homepage rails (a/b/c above), each an
  island container (`LyricsVideosRail`, `TopLyricsRail`, `NewLyricsRail`).
- `sections/LyricsDetailBody/` gains `.Writers.tsx`, `.AlbumTracks.tsx`,
  `.StreamingModal.tsx`; `.Credits.tsx` is trimmed to album/year/label only.
- `sections/LyricsTranslation/` (new) — language switcher, revision proposal form, revision
  history list, vote buttons.
- `sections/LyricsSimilarSection/` becomes `LyricsSimilarSidebar` (layout change, same data
  shape plus the tag-based sourcing above).
- New module `src/modules/artists/` — `ArtistDetailEntity`, `getArtistBySlug`, the artist detail
  page (bio, avatar, their songs, their videos) — genuinely new, not a stub this time, for claimed
  artists only.
