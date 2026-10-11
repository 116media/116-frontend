# Artist Page — Design & Implementation Docs

Design documentation for the public **artist** surface: the `/artistes` index and the
`/artistes/{slug}` profile.

These docs are **frontend-first and frontend-led**. We design the page we want, state exactly
what data each section needs, and only then derive the backend contract required to serve it.
The backend is treated as a dependency of the design — not the other way round.

Today **neither route exists** — `/artistes` 404s. `docs/lyrics-page/specs/06-artist-coming-soon-page.md`
designed a "coming soon" placeholder but it was never implemented, and `ARTISTE_DETAIL_PATH`
(`/artistes/:slug`) is declared but unrouted. These docs describe building both from scratch.

Structured like [`../favorites-page/`](../favorites-page/) and [`../video-detail/`](../video-detail/):
numbered design docs capture the *why* and *what*; [`specs/`](specs/) holds implementation-ready
contracts and checklists for the *how*.

Product inspiration: [hotnewhiphop.com/artists](https://www.hotnewhiphop.com/artists) — see
[02](02-inspiration-benchmark.md) for the teardown and what we adopt, adapt, or reject.

> **Status: design only. Nothing here is implemented.**

## The one blocker worth knowing up front

The profile page (`/artistes/{slug}`) is **already servable** — `GET /public/artists/{slug}`
exists and returns the artist plus paginated lyrics and videos.

The index page (`/artistes`) is **not**. There is no public artist-list endpoint; only an
admin-scoped one. Everything the index needs — listing, A–Z bucketing, public search — is a
backend gap derived in [14](14-data-requirements.md) and specified in
[16](16-backend-gaps-and-contracts.md).

**Consequence:** the profile page can ship first, independently. See [24](24-implementation-plan.md).

## Feasibility at a glance

The profile aggregates **five content types** ([01](01-overview.md)). They do not all cost the
same, and every one of them degrades independently by simply not rendering
([07](07-artist-detail-tabs.md)).

| Capability | Tab / section | Servable today | Gap | Cost |
|---|---|:---:|:---:|---|
| Artist identity, bio, avatar | Hero | ✅ | — | none |
| Verified badge | Hero | ❌ | 2 | DTO + mapper |
| Artist directory, A–Z, search | `/artistes` | ❌ | 1, 1a–1c | new endpoint + aggregate + collation |
| **Popular songs** | Musique | ✅ | **none** | `sort=views` already exists |
| **Latest songs** | Musique | ✅ | — | already in the profile payload |
| **Albums** | Musique | ❌ | 3 | repository + endpoint — **no migration** |
| **Mixtapes** | Musique | ❌ | 3 + 4 | one column + admin surface + backfill |
| **Videos** | Vidéos | ✅ | — | already in the profile payload |
| **News / articles** | Actualités | ❌ | 6 | join table + tagging + editorial backfill |
| Video → artist link | entry point | ❌ | 7 | DTO field |

Two things worth internalising before planning:

- **Popular songs is free.** `LyricsEntity` already carries `ViewCount`/`LikeCount`/`ShareCount` and
  `GET /public/lyrics` already supports `sort=views|likes|shares`. It needs no gap at all.
- **Gap 5 is a many-to-many migration plus ongoing editorial cost** — someone has to tag every
  article — not just a build cost. It should not be scheduled as part of one "artist page"
  ticket; see [16](16-backend-gaps-and-contracts.md).

**Nothing on this page sells anything.** No merch, no ticketing, no tour dates, no cart, no
checkout — locked in [01](01-overview.md).

## Design docs — the page first

| File | Purpose |
|---|---|
| [01-overview.md](01-overview.md) | Goal, scope, locked decisions |
| [02-inspiration-benchmark.md](02-inspiration-benchmark.md) | HotNewHipHop teardown; adopt / adapt / reject |
| [03-information-architecture.md](03-information-architecture.md) | Routes, hierarchy, entry points |
| [04-artists-index-page.md](04-artists-index-page.md) | Grid, card anatomy, responsive behaviour |
| [05-alphabet-search-and-filters.md](05-alphabet-search-and-filters.md) | A–Z rail, search, URL state |
| [06-artist-detail-hero.md](06-artist-detail-hero.md) | Identity block, stat row, actions |
| [07-artist-detail-tabs.md](07-artist-detail-tabs.md) | Tab model, deep-linking, empty tabs, mobile overflow |
| [08-catalog-sections.md](08-catalog-sections.md) | Every section: cards, ordering, grids, page sizes |
| [09-loading-empty-error.md](09-loading-empty-error.md) | Every non-happy state |
| [10-components-and-reuse.md](10-components-and-reuse.md) | What to reuse vs build |
| [11-accessibility-and-responsive.md](11-accessibility-and-responsive.md) | A11y contract, breakpoints |
| [12-i18n.md](12-i18n.md) | Namespaces and key inventory |
| [13-seo-and-metadata.md](13-seo-and-metadata.md) | Titles, OG, JSON-LD, sitemap |

## Data & contract — derived from the design above

| File | Purpose |
|---|---|
| [14-data-requirements.md](14-data-requirements.md) | Per-section: exactly what fields the UI needs |
| [15-backend-current-state.md](15-backend-current-state.md) | Entity, endpoints, DTOs that exist today |
| [16-backend-gaps-and-contracts.md](16-backend-gaps-and-contracts.md) | Every missing endpoint, field, index |

## Frontend implementation

| File | Purpose |
|---|---|
| [17-frontend-module.md](17-frontend-module.md) | `artists` module layout, folder rules |
| [18-domain-entities-and-mappers.md](18-domain-entities-and-mappers.md) | `IArtist*` entities, `ArtistMapper` |
| [19-repository-usecases-and-di.md](19-repository-usecases-and-di.md) | Port, impl, use cases, container |
| [20-state-management-and-query-keys.md](20-state-management-and-query-keys.md) | Query keys, caching, infinite scroll |
| [21-performance-and-pagination.md](21-performance-and-pagination.md) | Budgets, image strategy, paging |
| [22-verified-artists-and-claiming.md](22-verified-artists-and-claiming.md) | Claim flow, verified badge |
| [23-testing-strategy.md](23-testing-strategy.md) | Unit, integration, e2e split |
| [24-implementation-plan.md](24-implementation-plan.md) | Phased delivery order |
| [25-open-questions.md](25-open-questions.md) | Unresolved product decisions |
| [26-acceptance-criteria.md](26-acceptance-criteria.md) | Done means this |

## Reading order

- **New to the feature:** [01](01-overview.md) → [02](02-inspiration-benchmark.md) → [04](04-artists-index-page.md) → [06](06-artist-detail-hero.md)
- **Understanding the profile's content:** [07](07-artist-detail-tabs.md) → [08](08-catalog-sections.md) → [14](14-data-requirements.md)
- **Implementing frontend:** [17](17-frontend-module.md) → [19](19-repository-usecases-and-di.md) → [24](24-implementation-plan.md) → `specs/`
- **Implementing backend:** [14](14-data-requirements.md) → [16](16-backend-gaps-and-contracts.md)
