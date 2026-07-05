# Articles Page Module

Design documentation for the web frontend's **public articles page** (`/articles`)
— a promoted-articles feature strip at the top (the same promotion feed used on the
homepage) followed by an **infinite-scrolling grid** of every published article
rendered as rich `ArticleCard` compound cards.

Built on the existing `articles` vertical slice (clean architecture, Awilix DI,
`Result<T>`), **TanStack Query v5** (`useInfiniteQuery`) for the paged feed, and the
shared UI primitives. Connected to the same backend as the homepage and mobile app.

> Status: **design / documentation**. Implementation begins after sign-off
> (see [14-implementation-plan.md](14-implementation-plan.md)).

## Documents

| # | Doc | What it covers |
|---|---|---|
| 01 | [Overview](01-overview.md) | Goals, decisions at a glance, what ships, reading order |
| 02 | [Architecture](02-architecture.md) | Clean-architecture layering, folder structure, reuse map |
| 03 | [Backend API Reference](03-backend-api-reference.md) | Endpoints, DTOs, pagination envelope, gaps vs. the card |
| 04 | [Page Composition](04-page-composition.md) | The `/articles` route: promoted strip + infinite grid, RSC vs client |
| 05 | [Article Card](05-article-card.md) | The `ArticleCard` compound, exact markup, meta row, tokens |
| 06 | [Grid & Infinite Scroll](06-articles-grid-and-infinite-scroll.md) | Video-feed grid minus title/view-all, `useInfiniteQuery` + observer |
| 07 | [Domain Entities & Mappers](07-domain-entities-and-mappers.md) | `IArticleSummaryEntity` (+ `readTimeInMinutes`), `IArticlePage`, mappers |
| 08 | [Repositories & Use Cases](08-repositories-and-usecases.md) | `getPublishedArticles` paginated port/impl/use case, DI |
| 09 | [State Management & Hooks](09-state-management-and-hooks.md) | `useArticlesFeed` infinite query, query keys, caching |
| 10 | [Interactions](10-interactions.md) | Like / bookmark / share from the card, local state, gating |
| 11 | [Dummy Data](11-dummy-data.md) | The dummy article generator matching the entity |
| 12 | [i18n](12-i18n.md) | `articles` namespace additions (en/fr) |
| 13 | [Loading, Empty & Error](13-loading-empty-error.md) | Skeletons, empty state, error, end-of-feed |
| 14 | [Implementation Plan](14-implementation-plan.md) | Phased build order + verification checklist |
| 15 | [Open Questions](15-open-questions.md) | Reading time on summaries, isLiked/isBookmarked, deferred scope |
| 16 | [Search & Filters](16-search-and-filters.md) | Category dropdown + search + tag pill strip / all-tags popover |

**Implementation specs** (TODO-tracked, full JSDoc'd code) live in
[specs/](specs/00-index.md).

## The short version

- **Top of the page** reuses the existing homepage `ArticlePromotionFeedContainer`
  (RSC) — the promoted-articles grid — with no code changes. See
  [04](04-page-composition.md).
- **Below it** is a new **infinite-scrolling grid** of published articles. Layout is
  the homepage `VideoFeedSection` grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`)
  **without** the section title and the "view all" link. See
  [06](06-articles-grid-and-infinite-scroll.md).
- **Each card** is a new `ArticleCard.Feed` compound — the magazine card style
  supplied in the brief (media with hover "Read Article" overlay; author + date row;
  a meta row of **category `Tag` · published date · reading time** above the title;
  engagement bar). The image category badge overlay is **removed**. See
  [05](05-article-card.md).
- **The feed uses `useInfiniteQuery`** over `GET /api/v1/public/articles`
  (`pageIndex`/`pageSize`), with an `IntersectionObserver` sentinel to fetch the next
  page. See [06](06-articles-grid-and-infinite-scroll.md) and
  [09](09-state-management-and-hooks.md).
- **A filter toolbar** sits between the promoted feed and the grid: a **category
  dropdown** (left) + **search** (right), and a **tag pill strip + searchable "All tags"
  popover** below. All three (`search` / `categoryId` / `tagSlug`) are server-side
  filters that reset the feed to page 0. See [16](16-search-and-filters.md).
- **Dummy data** backs the grid until the backend has published content, exactly like
  the promotion feed does today. See [11](11-dummy-data.md).
