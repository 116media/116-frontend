# Favorites Page — Design & Implementation Docs

Design and implementation documentation for the authenticated reader's **Favorites** page
under `/favorites`. A settings-style side menu separates Favorite articles, Favorite videos,
and Favorite short videos; those three containers expose ten user-specific collections:
bookmarked articles, commented articles, liked articles, video playlists, rated videos,
shared articles, shared videos, bookmarked short videos, liked short videos, and shared
short videos.

These docs mirror [`../article-detail/`](../article-detail/): numbered design documents
capture the *why* and *what*, while [`specs/`](specs/) contains implementation-ready
contracts and checklists for the *how*.

The backend portion was implemented on **2026-07-19**. The generated API client and Favorites
frontend have not yet been regenerated/implemented, so backend availability must not be confused
with frontend completion.

## Feasibility at a glance

| Collection | Stored by backend | Backend read API | Generated client | Frontend page |
|---|:---:|:---:|:---:|---|
| Bookmarked articles | yes | yes, with bookmark date | regeneration pending | `/bookmarks` legacy UI |
| Commented articles | yes | yes | regeneration pending | pending |
| Liked articles | yes | yes | regeneration pending | pending |
| Video playlists | yes | yes, with collage/detail fields | regeneration pending | modal only |
| Rated videos | yes | yes | regeneration pending | pending |
| Shared articles | yes | yes | regeneration pending | pending |
| Shared videos | yes | yes | regeneration pending | pending |
| Bookmarked short videos | yes | yes | regeneration pending | pending |
| Liked short videos | yes | yes | regeneration pending | pending |
| Shared short videos | yes | yes | regeneration pending | pending |

The full page is feasible and its backend dependency is complete. The next dependency is generated
client regeneration, followed by frontend repositories/use cases, presentation, navigation, and
rollout. See [03](03-feasibility-matrix.md), [05](05-backend-current-state.md), and
[06](06-backend-required-contracts.md).

## Design docs

| File | Purpose |
|---|---|
| [01-overview.md](01-overview.md) | Goal, scope, product decisions |
| [02-product-model.md](02-product-model.md) | What “favorites” means and collection semantics |
| [03-feasibility-matrix.md](03-feasibility-matrix.md) | Current support and exact gaps |
| [04-architecture.md](04-architecture.md) | Module boundaries and reuse map |
| [05-backend-current-state.md](05-backend-current-state.md) | Existing entities, queries, and indexes |
| [06-backend-required-contracts.md](06-backend-required-contracts.md) | Required endpoints and DTOs |
| [07-route-auth-and-metadata.md](07-route-auth-and-metadata.md) | Route, auth gate, redirect, noindex |
| [08-page-composition.md](08-page-composition.md) | Responsive page hierarchy |
| [09-tabs-and-url-state.md](09-tabs-and-url-state.md) | Side navigation, inner collections, URL state |
| [10-bookmarked-articles.md](10-bookmarked-articles.md) | Bookmark dates, removal, migration |
| [11-commented-articles.md](11-commented-articles.md) | Latest comment, drawer, edit/delete |
| [12-liked-articles.md](12-liked-articles.md) | Liked article collection |
| [13-video-playlists.md](13-video-playlists.md) | 2×2 collage, detail, and management |
| [14-rated-videos.md](14-rated-videos.md) | Rating history and own-star display |
| [15-shared-articles.md](15-shared-articles.md) | Authenticated article share history |
| [16-shared-videos.md](16-shared-videos.md) | Authenticated video share history |
| [17-domain-entities-and-mappers.md](17-domain-entities-and-mappers.md) | Frontend entities and DTO mapping |
| [18-repositories-usecases-and-di.md](18-repositories-usecases-and-di.md) | Data-layer additions |
| [19-state-management-and-query-keys.md](19-state-management-and-query-keys.md) | TanStack Query contracts |
| [20-components-and-reuse.md](20-components-and-reuse.md) | Existing grids/cards and new components |
| [21-loading-empty-error.md](21-loading-empty-error.md) | Per-collection and detail states |
| [22-i18n-accessibility-and-responsive.md](22-i18n-accessibility-and-responsive.md) | en/fr, keyboard, mobile |
| [23-performance-and-pagination.md](23-performance-and-pagination.md) | Lazy loading, indexes, page sizes |
| [24-security-and-privacy.md](24-security-and-privacy.md) | Ownership and private-history rules |
| [25-testing-strategy.md](25-testing-strategy.md) | Backend/frontend test matrix |
| [26-migration-and-rollout.md](26-migration-and-rollout.md) | `/bookmarks` compatibility and rollout |
| [27-implementation-plan.md](27-implementation-plan.md) | Dependency-ordered phases |
| [28-open-questions.md](28-open-questions.md) | Locked decisions and remaining product input |
| [29-acceptance-criteria.md](29-acceptance-criteria.md) | End-to-end completion checklist |
| [30-short-video-collections.md](30-short-video-collections.md) | Liked, saved, and shared shorts |
| [31-account-dropdown-entry.md](31-account-dropdown-entry.md) | Favorite group with three destinations |

## Specs

Start at [specs/00-index.md](specs/00-index.md). Completed backend tasks remain recorded there so
the generated client and frontend can be implemented against the as-built contracts.
