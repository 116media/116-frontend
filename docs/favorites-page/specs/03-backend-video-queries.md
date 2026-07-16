# 03 — Backend Video Queries & Playlist Projections

## Activity reads

Add `GetRatedVideosAsync` and `GetSharedVideosAsync`. Ratings return one published video with the
current user's stars and `UpdatedAt ?? CreatedAt`. Shares group only authenticated current-user
events and return own count/latest channel/time. Totals count distinct videos.

## Playlist summary collage

Upgrade `GetByUserIdAsync`/its projection so each `PlaylistDto` contains the first four available
nullable thumbnail URL slots in playlist `SortOrder`. Load required video/thumbnail file data through one
projection or batched file lookup. Do not call `IFileRepository.GetByIdAsync` once per cell.

The returned list contains zero to four slots; a missing thumbnail is `null` so subsequent videos
do not shift position. Frontend fills unused positions to four. Keep video count independent from
thumbnail availability.

## Playlist detail

Keep existing ownership/mutations. Add slug/category/publication fields to ordered items and filter
unpublished videos according to the product access rule. Retain `SortOrder` as authoritative.

## Tasks

- [x] Implement rated/shared projections and stable distinct pagination.
- [x] Add first-four playlist thumbnail projection without N+1 queries.
- [x] Complete playlist detail route/card fields.
- [x] Test re-rating order/stars, own share counts, missing thumbnails, 0/1/2/3/4/5-video lists,
  unpublished videos, and cross-user playlist access.
