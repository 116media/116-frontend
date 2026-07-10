# 01 — Overview

## Goal

Build the public **single video page** at `/videos/[slug]`. It is the playback surface
for every video card in the app and must:

- Embed the video's YouTube source in a **Plyr player** themed to the brand colors
  (primary in light mode, secondary accents in dark).
- Show the video's **title**, **category** (e.g. "116 Music Video"), **star rating**
  (average + count, with an authenticated 1–5 rating action), and **tags**.
- Surface live **YouTube statistics** — view count, like count, comment count — from the
  YouTube Data API, alongside the backend's own share count.
- Offer a **share modal**: the brand social button group (Facebook, X, WhatsApp, copy
  URL) laid out horizontally inside a dialog, recording each share against the backend.
- Offer an **add-to-playlist modal**: the viewer's playlists as a checkbox list plus an
  add action (auth-gated).
- Show a one-column **popular videos** sidebar on the right (thumbnail, title, published
  date, rating stars, share count) using the exclusive-section horizontal card inside the
  gossip-strip muted block — visually the twin of the articles page's popular sidebar.
- Below the player, an animated **tab set**: Description (default), Lyrics (only when
  `hasLyrics`), and Similar — a grid of three feed cards (thumbnail, title, rating,
  relative date, share count).
- **No author display** anywhere on the page.

## Inputs

- `VideoDetailDto` from `GET /api/v1/public/videos/{slug}` — see
  [03-backend-api-reference.md](03-backend-api-reference.md). Carries everything above
  except YouTube stats (external) and lyrics text (separate endpoint).
- `LyricsDto` from `GET /api/v1/public/lyrics/videos/{videoId}` when `hasLyrics`.
- `PlaylistDto[]` from `GET /api/v1/public/playlists` (auth).
- YouTube Data API v3 `videos?part=statistics` for views/likes/comments.

## Constraints

- Reuse before rebuild: `VideoCard.Vertical` (similar grid), `VideoCard.Horizontal`
  (popular sidebar), `VideoCard.Rating` / `.Date` / `.ShareCount`, `SectionHeader`,
  `ButtonGroup`, `Dialog`, `StarRating`, the share notification configs pattern.
- Same hexagonal slice discipline as the article detail: domain entities → mappers →
  port/impl → use cases → hooks → composers, all inside the existing `videos` module.
- Dummy-data phase parity: every query falls back to deterministic dummies so the page
  is fully previewable without a running backend.
- Dark/light support throughout; all colors from theme tokens.

## Reference

The article detail page (`docs/article-detail/`) is the structural blueprint: this page
mirrors its route pattern (RSC + `initialData` hydration), its state selection, its i18n
layout, and its documentation format.
