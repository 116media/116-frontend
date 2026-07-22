# Favorites Page — Implementation Specs

Implementation-ready work breakdown for the private Favorites library. Read the
[design documentation](../README.md) first. These checklists deliberately span backend and
frontend. The backend work is complete; generated-client and frontend phases remain.

## Specs

| File | Scope |
|---|---|
| [01-backend-dtos-and-indexes.md](01-backend-dtos-and-indexes.md) | Activity projections, playlist DTO, read indexes |
| [02-backend-article-queries.md](02-backend-article-queries.md) | Bookmark activity, grouped articles, own comments |
| [03-backend-video-queries.md](03-backend-video-queries.md) | Rated/shared reads and playlist collage/detail |
| [04-backend-endpoints-and-tests.md](04-backend-endpoints-and-tests.md) | HTTP contracts, auth, validation, integration tests |
| [05-generated-client.md](05-generated-client.md) | API regeneration and schema verification |
| [06-frontend-article-data.md](06-frontend-article-data.md) | Article entities, repository, use cases, hooks |
| [07-frontend-video-and-playlist-data.md](07-frontend-video-and-playlist-data.md) | Video activity and full playlist data paths |
| [08-favorites-module-and-route.md](08-favorites-module-and-route.md) | Three-route settings-style shell, metadata, auth |
| [09-tabs-and-article-sections.md](09-tabs-and-article-sections.md) | Four article collections and comment drawer |
| [10-playlists-section.md](10-playlists-section.md) | 2×2 collage, detail, and mutations |
| [11-video-sections.md](11-video-sections.md) | Rated/re-rate and personal share counts |
| [12-states-i18n-and-accessibility.md](12-states-i18n-and-accessibility.md) | States, English/French, responsive/a11y |
| [13-testing-rollout-and-file-manifest.md](13-testing-rollout-and-file-manifest.md) | Verification, migration, likely file set |
| [14-short-video-data-and-sections.md](14-short-video-data-and-sections.md) | Three short reads, frontend data, and panels |
| [15-account-dropdown-entry.md](15-account-dropdown-entry.md) | Favorite menu group with three destinations |

## Implementation order

1. Backend DTOs/indexes and repository queries (01–03 and backend portions of 14)
2. Endpoints and backend verification (04 and backend portions of 14)
3. Generated client (05)
4. Frontend article, video, and shorts data layers (06–07 and frontend portions of 14)
5. Route shell, collection panels, and cross-cutting presentation (08–12)
6. Account-dropdown Favorite group (15)
7. Full verification and rollout (13)

## Global progress

- [x] 01 — Backend DTOs & indexes
- [x] 02 — Backend article queries
- [x] 03 — Backend video queries
- [x] 04 — Backend endpoints & tests
- [ ] 05 — Generated client
- [ ] 06 — Frontend article data
- [ ] 07 — Frontend video & playlist data
- [ ] 08 — Favorites module & route
- [ ] 09 — Article sections & comment drawer
- [ ] 10 — Playlists section
- [ ] 11 — Video sections
- [ ] 12 — States, i18n & accessibility
- [ ] 13 — Testing, rollout & manifest
- [ ] 14 — Short-video data & sections (backend complete; frontend pending)
- [ ] 15 — Account dropdown Favorite group

Check a task only after its code and proportional verification have landed. Documentation
completion does not complete an implementation task.
