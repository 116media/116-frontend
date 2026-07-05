# Architecture & Folder Structure

The articles page extends the **existing `articles` vertical slice** (domain →
application → infrastructure → presentation), wired through Awilix DI and returning
`Result<T>` from every repository/use case — the same shape as `videos` and `auth`.

Nothing about the slice is rebuilt: the page adds **one paged read** (list published
articles) and **presentation** (the grid, the card, the infinite-scroll hook, the
page route). The promoted section is pure reuse.

---

## Layer responsibilities (what this module touches)

- **domain/** — add `IArticlePage` (a page of summaries + paging cursor). Extend
  `IArticleSummaryEntity` with an optional `readTimeInMinutes`. No axios, no React.
- **application/** — add `getpublishedarticles.usecase.ts` and one method on the
  repository **port**. Use cases stay thin: call the port, return `Result<T>`.
- **infrastructure/** — implement the new port method against the generated client
  (`api.getPublishedArticles`), add the page mapper, register the use case in DI.
- **presentation/** — the `ArticleCard` compound, the `ArticlesGrid` + its container,
  the `useArticlesFeed` infinite-query hook, loading/empty/error views, dummy data,
  and the `/articles` route composition.

The repository impl depends only on the generated `Api` client injected through the
Awilix cradle (`{ client }`), exactly like the existing `ArticlesRepositoryImpl`.

---

## Folder structure

New files are marked `＋`; everything else already exists and is extended.

```text
src/modules/articles/
├── domain/entities/
│   ├── IArticleSummaryEntity.ts          # ＋ add optional readTimeInMinutes
│   ├── IArticlePage.ts                   # ＋ { items, pageIndex, pageSize, count, hasNextPage }
│   ├── IArticlePromotionFeedEntity.ts    # (reused, unchanged)
│   ├── IArticleCategoryEntity.ts         # (reused)
│   └── IArticleTagEntity.ts              # (reused)
├── application/
│   ├── repositories/
│   │   └── articles.repository.port.ts   # ＋ getPublishedArticles(query): Result<IArticlePage>
│   └── usecases/
│       ├── getpublishedarticles.usecase.ts   # ＋
│       ├── getpromotedarticles.usecase.ts    # (reused)
│       └── getarticlepromotionfeed.usecase.ts# (reused)
├── infrastructure/
│   ├── dependencies/
│   │   └── articles.dependencies.ts      # ＋ register getPublishedArticlesUseCase
│   ├── repositories/
│   │   └── articles.repository.impl.ts   # ＋ getPublishedArticles()
│   └── mappers/
│       └── articles.mapper.ts            # ＋ articlePageFromDto()
└── presentation/
    ├── components/
    │   ├── ArticleCard/                   # ＋ compound: { Feed } (+ sub-composers)
    │   │   ├── ArticleCard.Feed.tsx
    │   │   ├── ArticleCardMedia.tsx
    │   │   ├── ArticleCardMeta.tsx
    │   │   ├── ArticleCardAuthor.tsx
    │   │   ├── ArticleCardEngagement.tsx
    │   │   └── index.ts                   # export const ArticleCard = { Feed }
    │   ├── ArticlesGrid/                   # ＋ the infinite grid (view + container)
    │   │   ├── ArticlesGrid.tsx
    │   │   ├── ArticlesGridLoading.tsx
    │   │   ├── ArticlesGridEmpty.tsx
    │   │   └── index.tsx                   # ArticlesGridContainer (client)
    │   ├── ArticlePromotionFeed/           # (reused at the top of the page)
    │   └── … (existing promotion / mega-menu components)
    ├── hooks/
    │   └── useArticlesFeed.ts             # ＋ useInfiniteQuery wrapper
    ├── data/
    │   └── articles.dummy.ts              # ＋ generateDummyArticles()
    └── i18n/
        └── locales/{en,fr}/articles.ts    # ＋ grid/card keys

src/shared/presentation/
├── hooks/
│   └── useIntersectionObserver.ts        # ＋ generic sentinel hook (reusable)
└── components/ui/
    ├── Separator/                        # ＋ new primitive (none exists today)
    └── Icon/lucide.ts                    # ＋ Bookmark / BookmarkPlus re-export

app/(public)/articles/
└── page.tsx                              # ＋ promoted feed + ArticlesGridContainer
```

---

## Shared infrastructure reused (not rebuilt)

| Piece | File | Reuse |
|---|---|---|
| Generated API client | `src/shared/infrastructure/api/generated/116.api.ts` | `getPublishedArticles`, interaction methods |
| Browser API client (Awilix `client`) | `src/shared/infrastructure/api/client.ts` | Injected into the repo impl |
| Server API client | `src/shared/infrastructure/api/server-client.ts` | If the first page is ever prefetched (RSC) |
| DI container + Cradle | `src/shared/infrastructure/service.locator.ts` | Register the new use case |
| Result / Failure / ProblemMapper | `src/shared/domain/results`, `…/mappers/problem.mapper.ts` | Error mapping |
| QueryProvider | `src/shared/presentation/providers/QueryProvider.tsx` | `useInfiniteQuery` runs under it |
| `Tag`, `Button`, `Avatar`, `Card` | `src/shared/presentation/components/ui/*` | Card building blocks |
| `useRequireAuth` | `src/modules/auth/presentation/…` | Gate like / bookmark |
| `RelativeDate` + `formatRelativeDate` | `src/shared/presentation/components/ui/RelativeDate`, `…/utils/formatRelativeDate` | Card published date (locale-aware relative) — same as `VideoCard.Vertical` |

## New shared pieces to add

- **`Separator`** UI primitive (`src/shared/presentation/components/ui/Separator/`) —
  a thin themed rule used in the card meta row (`orientation="vertical"`). None exists
  today; build on `@radix-ui/react-separator` (verify latest before pinning) or a bare
  `role="separator"` span. See [05-article-card.md](05-article-card.md).
- **Bookmark icon** — add `Bookmark`/`BookmarkPlus as BookmarkPlusIcon` to
  `src/shared/presentation/components/ui/Icon/lucide.ts` (the barrel currently has no
  bookmark glyph).
- **`useIntersectionObserver`** — a generic hook returning a `ref` + `isIntersecting`,
  reusable for any lazy-load / infinite-scroll surface. See
  [06-articles-grid-and-infinite-scroll.md](06-articles-grid-and-infinite-scroll.md).

See [14-implementation-plan.md](14-implementation-plan.md) for the build order.
