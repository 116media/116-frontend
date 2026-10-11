# 01 — Overview

## Goal

Give every artist on 116 a real, addressable home page, and a browsable directory to find them.

Today an artist name is dead text. A lyrics page says "Fally Ipupa" and that string goes nowhere.
The artist surface turns that string into a destination that aggregates everything 116 holds
about that artist — lyrics, videos, albums — in one place.

This is the payoff for backend work already done: `ArtistEntity` exists, lyrics and videos already
carry a nullable `ArtistId`, and `PublicGetLyricsBySlugHandler` already resolves `ArtistSlug`.
None of it is reachable by a user yet.

> **Frontend starting point: nothing exists.** `/artistes` 404s — the coming-soon placeholder in
> `docs/lyrics-page/specs/06-artist-coming-soon-page.md` was designed but never built. There is
> also **no `lyrics` frontend module yet**, which is a real dependency — see
> [08](08-catalog-sections.md).

## In scope

- `/artistes` — a browsable directory of every artist with published content.
- `/artistes/{slug}` — a per-artist profile aggregating their **full discography and presence**.
- A–Z alphabet navigation and public artist search on the index.
- **Discography** ([08](08-catalog-sections.md)):
  - **Popular songs** — ranked by view/like/share counts, which already exist.
  - **Latest songs** — ordered by publish date.
  - **Albums** and **mixtapes** — as distinct release types.
- **Videos** by the artist.
- **News** — articles about or tagged to the artist.
- **Artist identity**: real name, aliases, birthdate, hometown — each optional, hidden when absent.
- **Social links** — platform-keyed outbound links.
- A verified badge for claimed artist profiles.
- Linking the existing free-text artist name on lyrics/video pages to the profile.
- Full i18n (`fr` + `en`), SEO metadata, JSON-LD, sitemap entries.
- The backend contract required to serve the above ([16](16-backend-gaps-and-contracts.md)).

## Out of scope (v1)

- **Artist-submitted profile editing.** Claiming a profile grants a badge, not a CMS. Every field
  on the page is entered by staff, not by the artist.
- **Commerce of any kind.** No merch, no ticketing, no cart, no checkout — nothing on this page
  sells anything or links out to a seller.
- **Tour dates and live shows.** Not in v1. Both this and merch were scoped in and then cut; the
  reasoning is recorded in [25](25-open-questions.md) rather than left as dangling sections.
- **Streaming playback.** We link to streaming platforms; we do not host or play audio.

## Locked decisions

1. **Route stays `/artistes`** (French), matching the existing header nav link and
   `ARTISTE_DETAIL_PATH`. Do not rename to `/artists`; the nav already ships this path.
2. **Slug-addressed, not id-addressed** — `/artistes/{slug}`, consistent with lyrics and videos.
3. **The profile page ships before the index page.** Its endpoint already exists; the index's
   does not. See [24](24-implementation-plan.md).
4. **An artist with zero surfaceable content is not listed** on the index and 404s on the profile.
   Unclaimed staff-curated stubs must not become crawlable dead pages.
   "Content" means *any* of the five surfaces — songs, videos, albums, mixtapes, or news. The index's `contentCount` and this 404 rule must use the **same** definition, or a
   listed artist can 404 when clicked.
5. **Tabs are URL-addressable** (`?tab=videos`) so a tab is linkable and survives refresh.
6. **The index is a directory, not a feed.** It is ordered and navigable (A–Z), not ranked by
   popularity — we have no honest popularity signal.
7. **No new "artist" concept is introduced.** This surfaces `ArtistEntity` as it already exists.

## Why now

Three things already landed that this depends on, and which are currently invisible to users:

| Already shipped | Currently unused by any UI |
|---|---|
| `ArtistEntity` (name, slug, bio, avatar, claim/verify) | ✅ |
| `LyricsEntity.ArtistId` / `VideoEntity.ArtistId` | ✅ |
| `GET /public/artists/{slug}` returning artist + lyrics + videos | ✅ |
| `ArtistSlug` resolved on the lyrics detail response | ✅ |

The artist page is the consumer that makes all of it pay off.

## Success criteria

- A reader can go from a lyrics page → artist profile → another song by that artist without search.
- A reader can find an artist by first letter or by typing a partial name.
- Every profile is crawlable, has correct `MusicGroup` JSON-LD, and appears in the sitemap.
- The profile is useful for an artist with 1 song and for one with 200.
