# 09 — Side Navigation & Collection URL State

## Primary navigation

The three side-menu links use pathnames, exactly like settings:

```text
/favorites/articles
/favorites/videos
/favorites/shorts
```

`FavoritesSidebar` uses `usePathname()` for active-route styling. On mobile the same links become
a horizontal strip; do not replace them with an inaccessible custom dropdown.

## Inner collection state

Each route validates its own `collection` allow-list:

```text
articles: bookmarked | commented | liked | shared
videos:   playlists | rated | shared
shorts:   liked | saved | shared
```

Use `router.replace` for ordinary inner switching and preserve the pathname. Back/forward,
refresh, and direct links must restore the route and collection. Invalid values resolve to the
route default without leaking arbitrary strings into query keys.

## Fetch behavior

- Enable only the active collection query.
- Preserve collection caches when switching within a route or between side-menu routes.
- Opening comment/playlist detail enables only that detail query.
- Never fetch all ten collections or every comment/playlist detail on initial render.

The inner selector may use shared accessible Tabs or segmented links. It is not the primary page
navigation and should remain compact at four options or fewer.

