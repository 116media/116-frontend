# Lyrics Page — Overview

## Current state

### The nav already points at two dead routes

**`src/shared/presentation/layouts/Header/constants.ts`**:

```ts
{ label: "VIDEOS", href: VIDEOS_PATH, hasMegaMenu: true },
{ label: "LYRICS", href: LYRICS_PATH, hasMegaMenu: false },
{ label: "ARTISTES", href: ARTISTES_PATH, hasMegaMenu: false }
```

**`src/shared/presentation/constants/paths.ts`**:

```ts
export const LYRICS_PATH = "/lyrics";
export const ARTISTES_PATH = "/artistes";
export const ARTISTE_DETAIL_PATH = "/artistes/:slug";
```

Both `LYRICS_PATH` and `ARTISTES_PATH` already render as top-level nav links today — and both
404, because neither `app/(public)/lyrics/` nor `app/(public)/artistes/` exists. No other file in
the frontend references either constant; nothing links to a lyrics page or an artist page from
anywhere else.

### Lyrics already exist, but only embedded

The **videos** module already has a partial lyrics feature: `IVideoLyricsEntity`
(`src/modules/videos/domain/entities/IVideoLyricsEntity.ts`) and `VideoDetailLyrics`
(`src/modules/videos/presentation/components/sections/VideoDetailLyrics/`) render a video's linked
lyrics inline, in a tab on the video detail page, sourced from
`GET /api/v1/public/lyrics/by-video/{videoId}`.

That entity's own doc comment is explicit about the boundary this feature respects:

> Maps from `LyricsDto` — drops the author and SEO fields, which belong to the standalone lyrics
> page, not this embedded view.

So `IVideoLyricsEntity` was deliberately scoped down for its one use site. This feature adds the
*other* view of the same backend data — the full, SEO-complete standalone page — as a new,
separate domain entity in a new module.

`IVideoLyricsEntity` and `VideoDetailLyrics` gain **one small addition**, not a rewrite: a `slug`
field and a "View full lyrics" link out to the new standalone page (per
[05-open-questions.md](05-open-questions.md), question 5 — reversed from this doc's original
"unchanged" framing). Everything else about the embedded view — content, layout, the
author/SEO-stripped shape — stays exactly as it is.

### No "Artist" domain exists

There is no `ArtistEntity`, no `ArtistDto`, nothing artist-shaped anywhere in the backend.
`ArtistName` is a plain string field on `LyricsEntity` (and similarly on videos) — an unstructured
label, not a profile with its own id, bio, or catalog. Building a real artist page (bio, avatar,
their songs, their videos) is a distinct, much larger feature with no backend support today.
`/artistes` in this feature is scoped as a **placeholder route only** — see
[04-routes-and-artist-placeholder.md](04-routes-and-artist-placeholder.md).

## Scope

| In scope | Out of scope |
| --- | --- |
| `/lyrics` — public, searchable listing with a language filter | Any per-artist page/profile (`/artistes/:slug`) |
| `/lyrics/{slug}` — standalone detail page, clean slug-based URL | The dashboard's existing admin CRUD flows themselves (only new fields are added to them) |
| Cover/poster art, song credits (album, release year, label, songwriter, producer) | Comments or bookmarks on lyrics (not requested, no backend precedent needed) |
| View, like, and share counts (new interaction system, mirroring `shorts`) | A real artist directory/profile system |
| Similar lyrics (same video category, or latest standalone as fallback) | — |
| New `lyrics` frontend module (domain/application/infrastructure/presentation) | — |
| Backend: `Slug` column, public list endpoint, language filter, video-slug resolution, cover/credits, interactions, similar-lyrics query | — |
| A small, scoped `videos`-module addition: the "View full lyrics" cross-link | — |
| `/artistes` — real route, "coming soon" placeholder | — |

## Why this needs its own module, not a `videos` sub-feature

A lyrics page can exist **linked to a video** or **fully standalone** (per
`LyricsEntity.CreateForVideo` / `CreateStandalone`) — it is not inherently a video concern, and the
backend already models it as its own aggregate under `Content/Domain/Entities/LyricsEntity.cs`,
sibling to `VideoEntity` and `ArticleEntity`, not nested under either. The frontend mirrors that:
a new `src/modules/lyrics/` module, following the same clean-architecture layering as every other
content module (see [03-frontend-module.md](03-frontend-module.md)).
