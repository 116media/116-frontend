# 27 — Implementation Plan

## Dependency-ordered phases

1. **Backend contracts — complete (2026-07-19):** DTOs, read indexes, repositories, handlers,
   endpoints, authorization, unit tests, and integration tests are implemented.
2. **Generated client:** regenerate and confirm the eight operations and DTO schemas.
3. **Article data:** add liked, commented, and shared repository/use-case/hook paths; reuse the
   existing bookmarks path.
4. **Video data:** add rated/shared reads and complete playlist detail/mutation frontend paths.
5. **Short data:** add saved/liked/shared reads to the existing shorts module.
6. **Favorites presentation:** build layout, three-route sidebar, inner selectors, collection renderers, and
   activity metadata using existing cards/grids.
7. **Compatibility and navigation:** redirect `/bookmarks`, fix path constants, and add the
   Favorite account-menu group with three content destinations.
8. **Hardening:** translations, accessibility, responsive behavior, tests, telemetry, and
   staged verification.

Each phase is independently type-checked and tested. Generated-client regeneration is now the
critical path; the UI must not fabricate liked/commented/rated/shared collections from aggregate
counts or browser storage.

The file-by-file execution order is in [specs/00-index.md](specs/00-index.md).
