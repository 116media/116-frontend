# 25 — Testing Strategy

## Backend

Each new query receives repository/integration coverage for ownership, pagination, stable
ordering, published-content filtering, distinct grouping, deleted comments, anonymous shares,
and empty results. Endpoint tests cover authentication, validation, response envelopes, and
cross-user isolation. Playlist tests additionally cover ownership for detail and every mutation.

## Frontend

- Mapper tests verify every backend DTO field and nullable activity field.
- Repository tests verify generated-client parameters and `ProblemMapper` failures.
- Hook tests verify keys, disabled anonymous queries, pagination, and mutation invalidation.
- Component tests verify three side routes, all ten inner collections, URL synchronization,
  keyboard navigation, per-collection
  loading/empty/error states, and collection-specific activity metadata.
- Route tests verify authentication behavior, `/bookmarks` redirect, and robots metadata.
- Account-control tests verify the Favorite group and exactly three content destinations.
- Playlist flows cover create, rename, delete, open, and remove-video confirmation.
- Playlist collage tests cover zero through four-plus videos and missing thumbnails without
  per-card detail requests.
- Comment drawer tests cover lazy own-comment pagination, latest preview, edit, delete, last-comment
  card removal, View article, focus restoration, and cross-user isolation.
- Short collection tests cover bookmark/like removal, grouped shares, inactive shorts, and
  opening the existing short detail/player experience.
- English and French catalogs must contain identical key shapes.

## End-to-end critical path

Sign in, open each content route/collection directly by URL, paginate, navigate to a content item,
return without losing selection, mutate a bookmark/comment/rating/playlist, and confirm updates.
Repeat an ownership check with a second user and verify no private history leaks.
