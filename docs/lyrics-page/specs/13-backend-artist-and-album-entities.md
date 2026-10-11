# Spec 13 — Backend: Artist & Album Entities

Design rationale: [../06-musixmatch-scale-expansion.md](../06-musixmatch-scale-expansion.md).

**The authoritative, implementation-ready version of this spec now lives in the backend's own docs
folder** — [`apps/backend/docs/lyrics-page/specs/08-artist-and-album-entities.md`](../../../../backend/docs/lyrics-page/specs/08-artist-and-album-entities.md).
This file is kept as a short pointer from here on, not a second copy — an earlier draft here used
`OwnerUserId` as the field name and left the verified-artist matching logic underspecified; both
were corrected on the backend side (renamed to `UserId`, and the matching logic made explicit:
gated by that user id directly, never by comparing artist-name text — see backend spec 11). Read
the backend spec for the real entity code, endpoints, and task checklist.

## Summary

- `ArtistEntity` — real, addressable artist profile. `UserId` (nullable) is set only once a
  verified artist account claims the profile; `null` is the common case (staff-curated, unclaimed).
- `AlbumEntity` — same pattern, no ownership/claiming concept (albums aren't claimed, artists are).
- `LyricsEntity`/`VideoEntity` gain nullable `ArtistId` — coexisting with the existing free-text
  `ArtistName`, never replacing it.
- `PublicGetLyricsBySlugHandler` resolves `ArtistSlug` alongside the existing `VideoSlug`, so the
  frontend's artist-name link (06a) needs no second fetch.

## Task checklist

Tracked in the backend spec's own checklist — not duplicated here.
