# 11 — Rated & Shared Video Collections

## Rated

Render a standard video card plus “Your rating: N of 5” sourced only from `ratedStars`. Community
rating remains separately labelled. Add `Rate again` using the existing `VideoRatingModal`, seeded
with the user's current stars. Re-rating updates the list value/order and affected aggregate caches.

## Shared

Render “You shared this N times” plus latest date and optional channel. This is the authenticated
user's grouped count, never the global `shareCount`. Anonymous shares do not appear.

## Tasks

- [ ] Build both panels under `/favorites/videos?collection=`.
- [ ] Reuse normal video cards without deriving slugs from titles.
- [ ] Reuse rating modal and synchronize personal/aggregate caches.
- [ ] Render own share count/date/channel with accessible localized copy.
- [ ] Test re-rating, absent channel, long content, pagination, and empty/error states.

