# 21 — Loading, Empty & Error States

Every collection owns its asynchronous state. Switching routes/inner collections must never
replace the whole shell with a spinner or erase successfully cached content elsewhere.

## State contract

| State | Required presentation |
|---|---|
| Initial auth resolution | page skeleton; do not flash the signed-out prompt |
| Initial collection load | card/grid skeleton matching that collection |
| Empty | collection-specific explanation and useful next action |
| First-page error | `StateRenderer` error with retry |
| Next-page load | append skeletons; preserve existing cards |
| Next-page error | inline retry after existing cards |
| End of results | quiet end-of-list marker, not an empty state |
| Comment drawer load | drawer-local skeleton; article card/page remain usable |
| Playlist detail load | detail-local skeleton; playlist summaries remain visible |

## Empty-state actions

| Tab | Action |
|---|---|
| Bookmarked, commented, liked, shared articles | browse articles |
| Playlists, rated, shared videos | browse videos |
| Bookmarked, liked, shared shorts | browse short videos |
| Playlists | create playlist, with browse videos as secondary action |

Errors from one collection must not block route/collection navigation. A playlist mutation error stays within
the playlist surface and preserves the last confirmed server state.
