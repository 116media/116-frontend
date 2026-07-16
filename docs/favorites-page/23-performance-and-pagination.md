# 23 — Performance & Pagination

## Fetch policy

- Resolve authentication once, then fetch only the active route's selected collection.
- Use infinite queries for every content collection and normal queries for the small playlist
  list and selected playlist detail.
- Preserve inactive collection caches with stable module-owned query keys.
- Cancel or ignore superseded page requests through TanStack Query's signal support.
- Load the next page through the existing intersection observer with a manual fallback.

The default server page size is `12`; clients may request up to `50`. Ordering is deterministic:
`lastInteractedAt DESC` followed by the content id, or playlist ordering where applicable.

## Database requirements

The existing unique indexes support bookmark, like, and rating reads by user. Add user-first
indexes for comment and share history as listed in [03](03-feasibility-matrix.md). Queries
must project summary DTOs in SQL rather than load full aggregates and map them in memory.

## Rendering

Images continue through the existing optimized card image path. Do not prefetch all ten
collections, comment drawers, or playlist details on mount. Prefetching on deliberate hover/focus is optional and should be added
only after measurement. No collection requires a client-side global store.

Playlist collage URLs are returned with summaries in one read. The backend batches file
resolution and never performs four queries per playlist. My-comment rows load only when their
drawer opens.
