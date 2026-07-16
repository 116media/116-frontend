# 28 — Decisions & Open Questions

## Locked

- Favorites has three content routes and a settings-style responsive side menu.
- The account dropdown has a Favorite group with three matching destinations.
- Ten interaction collections exist only as inner controls within their content container.
- Commented cards show the latest own comment; the drawer shows all remaining own comments for
  that article and supports edit/delete.
- Playlist cards use a fixed 2×2 first-four collage; one video occupies only the top-left cell.
- Rated cards display only the user's rating in the personal-rating control and support re-rating.
- Bookmark/save cards expose interaction date and removal.
- Share cards expose the current user's grouped share count, distinct from global totals.
- Favorites owns presentation; articles/videos/shorts own data.

## Non-blocking product choices

1. Should the comment detail surface be a right-side sheet on desktop or a centered modal? The
   recommended responsive contract is side sheet desktop, full-height bottom sheet mobile.
2. Should playlist detail use the same sheet pattern or a nested route later? Start with a sheet,
   retaining a route-ready entity/query boundary.
3. Should a deleted comment with public replies remain visible in this private drawer as a deleted
   tombstone? Recommended: remove it from “my comments”; public thread behavior remains unchanged.

