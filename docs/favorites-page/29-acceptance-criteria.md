# 29 — Acceptance Criteria

## Navigation

- [ ] The account dropdown has a Favorite section with Favorite articles, Favorite videos, and
  Favorite short videos, followed by Sign out.
- [ ] The Favorites shell mirrors settings: vertical three-item side menu on desktop and horizontal
  navigation on mobile.
- [ ] Each route exposes only its 4/3/3 relevant inner collections and preserves URL state.
- [ ] `/favorites` and `/bookmarks` redirect to their documented canonical destinations.

## Collection behavior

- [ ] Bookmarked articles and saved shorts display the actual interaction date and removable action.
- [ ] Commented cards display the user's latest comment/count/date plus View comments/View article.
- [ ] The comment drawer lists all remaining own comments/replies and supports edit/delete safely.
- [ ] Deleting the last own comment removes the commented-article card.
- [ ] Playlist cards render deterministic 2×2 collages; one thumbnail stays in the top-left corner.
- [ ] Playlist open, rename, delete, and remove-video flows work with ownership checks.
- [ ] Rated cards show the user's own 1–5 rating separately and support re-rating.
- [ ] Shared article/video/short cards display the current user's grouped share count.
- [ ] All collections have accurate loading, empty, error, pagination, and cache-convergence states.

## Quality/security

- [ ] Backend projections expose timestamps/counts without N+1 playlist thumbnail resolution.
- [ ] Cross-user, unpublished/inactive content, soft-deleted comment, and anonymous-share tests pass.
- [ ] Type checking, lint/format, unit/integration tests, English/French, accessibility, responsive,
  and `noindex` checks pass.

Checkboxes are completed only after implementation and verification, not documentation alone.

