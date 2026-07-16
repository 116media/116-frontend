# 01 — Overview

## Goal

Build Favorites as a signed-in user's private content library with three clear content
destinations rather than one overloaded ten-item navigation row:

1. **Favorite articles** — bookmarked, commented, liked, and shared articles;
2. **Favorite videos** — playlists, rated videos, and shared videos;
3. **Favorite short videos** — liked, saved, and shared shorts.

## In scope

- A settings-style Favorites shell with a responsive three-item side menu.
- Three account-dropdown destinations under a dedicated `Favorite` section.
- URL-addressable collection controls inside each content container.
- Auth-gated, private, user-owned data with independent pagination/cache state.
- Comment preview on each commented-article card and a lazy comments drawer/modal.
- Editing and deleting the user's comments from that drawer.
- Playlist collage cards, detail, rename, delete, and remove-video management.
- User-only rating display and re-rating from a rated-video card.
- Per-user share counts for articles, videos, and shorts.
- Saved timestamps and removal actions for bookmarked articles and saved shorts.
- Required backend projections, endpoints, indexes, generated-client regeneration, frontend
  ports/use cases/hooks, i18n, tests, and rollout.

## Out of scope

- A mixed chronological activity feed.
- Admin moderation or access to another user's library.
- Reconstructing anonymous shares and attaching them after login.
- Putting all ten collection controls in the account dropdown or side menu.
- Cross-device offline persistence beyond the query cache.

## Locked decisions

- `/favorites` redirects to `/favorites/articles`.
- The side menu mirrors the settings navigation: vertical at `md+`, horizontal on mobile.
- The account dropdown has one `Favorite` section with three child destinations.
- Each content route owns its smaller inner collection selector: 4 article, 3 video, or
  3 short-video collections.
- Only the active inner collection fetches; cached inactive collections are retained.
- Comment/share histories deduplicate by content and expose count/latest activity.
- Commented cards show the latest current-user comment; all of that user's remaining comments
  load only after opening the drawer.
- Personal routes emit `noindex, nofollow`.

## Backend dependency status

The database persists all requested interactions and the backend contract work is complete:
ten collection reads, current-user comment detail, activity timestamps/counts, and playlist
collage/detail projections are implemented. Generated-client regeneration and frontend delivery
are the remaining dependencies. See
[06-backend-required-contracts.md](06-backend-required-contracts.md).
