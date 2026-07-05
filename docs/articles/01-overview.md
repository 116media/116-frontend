# Articles Page — Overview

This documents the web frontend's **public articles page** at `/articles`: how a
visitor sees the promoted articles at the top, then browses every published article
in an infinite-scrolling grid of rich cards, and how that page is wired to the same
backend the homepage already uses.

The page is a **composition of one existing feature and one new one**:

1. The **promoted-articles feed** already built for the homepage
   (`ArticlePromotionFeedContainer`) is reused verbatim at the top.
2. A **new infinite article grid** is added below it — the substance of this module.

---

## Goals

- **Promoted strip on top, parity with the homepage.** The same promotion feed
  (hero / side / pair / gossip strip) that opens the homepage opens the articles
  page. No new promoted component — reuse. See
  [04-page-composition.md](04-page-composition.md).
- **Infinite article grid below.** Every published article, paged from
  `GET /api/v1/public/articles`, rendered in a responsive grid that loads the next
  page as the visitor scrolls. See
  [06-articles-grid-and-infinite-scroll.md](06-articles-grid-and-infinite-scroll.md).
- **Grid layout = the homepage video feed, minus chrome.** Reuse the
  `VideoFeedSection` grid classes (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`,
  `gap-x-4 gap-y-8`) but **without** the section title and the "view all" link.
- **A reusable `ArticleCard` compound.** The card in the brief becomes a compound
  component in the `articles` slice, alongside the existing `ArticlePromotionCard`
  and `ArticlesMegaMenuCard` families. See [05-article-card.md](05-article-card.md).
- **Clean architecture, `Result<T>`, TanStack Query v5.** The new paged read extends
  the existing `articles` slice: repository port + impl, a use case, DI registration,
  and a `useInfiniteQuery` hook. See [02-architecture.md](02-architecture.md).
- **Dummy-data first.** The grid renders realistic dummy articles until the backend
  has published, promotable content — the same fallback the promotion feed uses
  today. See [11-dummy-data.md](11-dummy-data.md).

## Non-goals (for this phase)

- **The article detail page** (`/articles/[slug]`). This module is the **listing**
  page only. The detail view (body, tags, comments) is a separate effort;
  `GET /api/v1/public/articles/{slug}` is documented in
  [03-backend-api-reference.md](03-backend-api-reference.md) for reference.
- **Multi-select filtering & sort.** The backend list endpoint filters by a **single**
  `categoryId` and a **single** `tagSlug` (plus `search`), with no sort param — so the
  filter UI is single-select and unsorted. Multi-tag/category and sorting are future
  backend work. (The filter UI itself **is** in scope — see below.)
- **Writing comments.** Like / bookmark / share from the card are in scope (optimistic
  local state); the comment thread is part of the detail page.

---

## The core decisions at a glance

| Concern | Decision | Why |
|---|---|---|
| Promoted section | Reuse `ArticlePromotionFeedContainer` (RSC) unchanged | Already built, server-rendered, dummy-data-backed |
| Article list source | `GET /api/v1/public/articles` (`pageIndex`/`pageSize`) | The backend's paged published-articles endpoint |
| Feed state | TanStack Query **`useInfiniteQuery`** | Page accumulation, dedup, caching, `hasNextPage` |
| Next-page trigger | `IntersectionObserver` sentinel at the grid's end | Infinite scroll without a "load more" button |
| Grid layout | `VideoFeedSection` classes **without** title/view-all | Visual parity with the homepage feed |
| Card | New `ArticleCard.Feed` compound in the `articles` slice | Compound family, matches existing card patterns |
| Category chip | The shared **`Tag`** component (not `Badge`) | Per the brief; consistent app-wide tag styling |
| Reading time on cards | Dummy for now; request `ReadTimeInMinutes` on the summary DTO | Not present on `ArticleSummaryDto` today — see [15](15-open-questions.md) |
| `isLiked` / `isBookmarked` | Local optimistic state | Backend summary DTO exposes neither flag |
| Filtering | Toolbar: category dropdown (left) + search (right) + tag pill strip / all-tags popover | Server-side `categoryId` / `search` / `tagSlug`; single-select |
| Empty / offline | Fall back to dummy articles (unfiltered); filtered-empty shows "no results + clear" | Same pattern as the promotion feed container |

## What ships in this module

- A `/articles` route (`app/(public)/articles/page.tsx`) composing the promoted feed
  and the new grid.
- A new **`getPublishedArticles`** paginated read across the `articles` slice:
  repository port method, impl (generated client), use case, DI registration, mapper
  update, and an `IArticlePage` domain entity for the page envelope.
- A **`useArticlesFeed`** `useInfiniteQuery` hook + reusable `useIntersectionObserver`
  and `useDebouncedValue` hooks.
- A **filter toolbar** — `ArticlesToolbar` (category `Select` + debounced search) and a
  `ArticlesTagStrip` (popular pills + searchable "All tags" popover) — plus a new
  `getAllTags` read and `useArticleCategories` / `useArticlePopularTags` / `useAllTags`
  hooks. See [16-search-and-filters.md](16-search-and-filters.md).
- An **`ArticleCard`** compound component (`{ Feed }`, extensible) with its
  sub-composers.
- The **article grid** + its loading / empty / error / end-of-feed states.
- A **dummy article generator**.
- Two shared additions: a **`Separator`** UI primitive and a **`BookmarkPlus`** icon
  in the icon barrel (neither exists yet — see
  [05-article-card.md](05-article-card.md)).
- `articles` **i18n** additions (en/fr).

## Account states

The listing is **public** — a guest sees the full grid. Only the card's *actions*
gate on auth (mirrors the rest of the app):

- **guest** — reads the grid; tapping like / bookmark opens the auth modal
  (`useRequireAuth`), then resumes. See [10-interactions.md](10-interactions.md).
- **unverified / authenticated** — like / bookmark / share act immediately with
  optimistic local state.

## Reading order

1. [02-architecture.md](02-architecture.md) — layering & folder structure
2. [03-backend-api-reference.md](03-backend-api-reference.md) — the API contract
3. [04-page-composition.md](04-page-composition.md) — the page shell
4. [05-article-card.md](05-article-card.md) — the card
5. [06-articles-grid-and-infinite-scroll.md](06-articles-grid-and-infinite-scroll.md) — the grid + infinite scroll
6. [07-domain-entities-and-mappers.md](07-domain-entities-and-mappers.md) → [09-state-management-and-hooks.md](09-state-management-and-hooks.md) — the data layer
7. Then the remaining reference docs (10–15).
