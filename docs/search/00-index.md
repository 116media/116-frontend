# Site Search — Frontend Spec Index

Implementation specs for the `/search` route and the resolution of the duplicated
search fields.

**Read [`../../../../docs/search/`](../../../../docs/search/README.md) first** — the
monorepo docs carry the product requirement, the API contract and the ranking design.
These specs are the frontend implementation of that contract and do not restate it.

The backend counterpart is [`apps/backend/docs/search/`](../../../backend/docs/search/00-index.md).

---

## Specs

| File | What it covers |
| --- | --- |
| [01-phase-0-hygiene.md](01-phase-0-hygiene.md) | Debounce, URL state, relabelling and removing the duplicate field — ships before the backend |
| [02-architecture-and-ports.md](02-architecture-and-ports.md) | Domain entities, port, use case, repository, DI, query hook |
| [03-route-and-containers.md](03-route-and-containers.md) | The `/search` route, its container, URL state, scope tabs |
| [04-components.md](04-components.md) | Every component, folder, props and full source |
| [05-header-integration.md](05-header-integration.md) | The header entry point, per-route visibility |
| [06-recent-searches.md](06-recent-searches.md) | `localStorage` history, guarded reads, the idle state |
| [07-i18n-and-a11y.md](07-i18n-and-a11y.md) | Catalog additions both locales, live region, targets, contrast |
| [08-tests-and-acceptance.md](08-tests-and-acceptance.md) | What to verify and how, with the acceptance checklist |

---

## Implementation order

1. Phase 0 hygiene (spec 01) — independent, ship first
2. Architecture: entities, port, use case, DI, hook (spec 02)
3. Components (spec 04)
4. Route and container (spec 03)
5. Header integration (spec 05)
6. Recent searches (spec 06)
7. i18n and accessibility (spec 07)
8. Verification (spec 08)

Specs 02 and 04 are both prerequisites of 03, so build them before wiring the route.

---

## Where the code lives

A new module, because search owns entities, a port and a use case of its own:

```text
src/modules/search/
├── domain/entities/
│   ├── ISearchHitEntity.ts
│   └── ISearchResultsEntity.ts
├── domain/enums/
│   └── ESearchScope.ts
├── application/
│   ├── repositories/search.repository.port.ts
│   └── usecases/searchcontent.usecase.ts
├── infrastructure/
│   ├── mappers/search.mapper.ts
│   ├── repositories/search.repository.impl.ts
│   └── dependencies/search.dependencies.ts
└── presentation/
    ├── components/
    │   ├── pages/SearchPage/
    │   ├── sections/SearchResults/
    │   ├── cards/SearchHitCard/
    │   └── navigation/SearchScopeTabs/
    ├── constants/searchKeys.ts
    ├── containers/SearchContainer/
    ├── hooks/
    │   ├── useSearch.ts
    │   └── useRecentSearches.ts
    ├── i18n/locales/{fr,en}/
    └── utils/search/search.utils.ts

app/(public)/search/page.tsx
```

---

## Conventions these specs follow

`AGENTS.md`, in full. The ones that bite here:

- One component per folder; kind buckets (`pages/`, `sections/`, `cards/`, `navigation/`).
- Containers own the query and are named `<Surface>Container`.
- Tokens only — no hex, no arbitrary colour values.
- Variants belong to `cva` on the component, never a one-off `className` at a call site.
- JSDoc on every export, at most 3 lines, developer-to-developer voice.
- Promote to `shared/` only on the second module import.
