# Spec 09 — Popular Sidebar

Design ref: [../11-popular-articles-sidebar.md](../11-popular-articles-sidebar.md). Adds the
`ArticleCard.Horizontal` variant (barrel → `ArticleCard = { Feed, Horizontal }`),
`useArticleDetailPopular`, an `articleKeys.popular` key, and `ArticleDetail.PopularSidebar`.
Sources from `getPromotedArticlesUseCase` with a `getPublishedArticlesUseCase` fallback —
no popularity endpoint exists ([../03-backend-api-reference.md](../03-backend-api-reference.md)
§4).

---

## 1. `ArticleCard.Horizontal`

`src/modules/articles/presentation/components/ArticleCard/ArticleCard.Horizontal.tsx`

Mirrors [`VideoCard.Horizontal`](../../src/modules/videos/presentation/components/VideoCard/VideoCard.Horizontal.tsx):
a bordered `Link` row, left thumbnail (`~w-28`, 16:9), right column with an `h4`
`line-clamp-2` title and a bottom meta row. Entry prop is a single `IArticleSummaryEntity`,
like `ArticleCard.Feed`; it reuses `ArticleCard.Media` for the thumbnail.

```tsx
"use client";

import Link from "next/link";

import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import { RelativeDate } from "@/shared/presentation/components/ui/RelativeDate";
import { Tag } from "@/shared/presentation/components/ui/Tag";

import { ArticleCardMedia } from "./ArticleCard.Media";

/**
 * Props for the ArticleCard.Horizontal component.
 *
 * @interface ArticleCardHorizontalProps
 * @property {IArticleSummaryEntity} article - The article summary to render.
 */
export interface ArticleCardHorizontalProps {
    article: IArticleSummaryEntity;
}

/**
 * ArticleCard.Horizontal
 *
 * @description
 * Compact horizontal article card — a bordered row with a landscape thumbnail on the left
 * and the article content beside it: a two-line title that tints on hover, and a meta row
 * with the category Tag and the relative published date. Used in the article detail page's
 * popular-articles sidebar. The whole row links to the article. Layout mirrors
 * VideoCard.Horizontal; the thumbnail reuses ArticleCard.Media (16:9, hover overlay, and
 * null-cover fallback). All colors are theme tokens.
 *
 * @param article - The article summary to render.
 */
export function ArticleCardHorizontal({ article }: ArticleCardHorizontalProps) {
    return (
        <Link
            href={`/articles/${article.slug}`}
            className="group flex gap-3 rounded-xl border p-3 transition-all hover:bg-muted/50"
        >
            <div className="relative w-28 shrink-0 self-start overflow-hidden rounded-md sm:w-24 md:w-32 lg:w-28">
                <ArticleCardMedia
                    slug={article.slug}
                    title={article.title}
                    coverImageUrl={article.coverImageUrl}
                />
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
                <h4 className="line-clamp-2 font-semibold text-foreground text-sm leading-tight transition-colors group-hover:text-primary dark:group-hover:text-secondary">
                    {article.title}
                </h4>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2 text-muted-foreground text-xs">
                    <Tag
                        as="span"
                        size="sm"
                        variant="outline"
                    >
                        {article.categoryName}
                    </Tag>
                    <RelativeDate date={article.publishedAt} />
                </div>
            </div>
        </Link>
    );
}
```

> `ArticleCard.Media` renders its own 16:9 `aspect-video` box, so the wrapper only fixes the
> width (`w-28` responsive) and lets the aspect ratio drive the height — no `self-stretch`
> needed. If a fixed-height row is preferred over aspect-driven, swap to
> `self-stretch min-h-18` as `VideoCard.Horizontal` does.

---

## 2. Barrel update — `ArticleCard = { Feed, Horizontal }`

`src/modules/articles/presentation/components/ArticleCard/index.ts`

```ts
import { ArticleCardFeed } from "./ArticleCard.Feed";
import { ArticleCardHorizontal } from "./ArticleCard.Horizontal";

/**
 * ArticleCard
 *
 * @description
 * Compound family of article cards. `Feed` is the magazine-style card used in the
 * /articles grid; `Horizontal` is the compact bordered row used in the article detail
 * page's popular-articles sidebar. Extend the family by adding variants here.
 */
export const ArticleCard = {
    Feed: ArticleCardFeed,
    Horizontal: ArticleCardHorizontal
} as const;
```

---

## 3. `articleKeys.popular`

`src/modules/articles/presentation/constants/articleKeys.ts` — add one entry:

```ts
export const articleKeys = {
    all: ["articles"] as const,
    feed: (filters: IArticleFeedFilters = {}) => [...articleKeys.all, "feed", filters] as const,
    categories: ["articles", "categories"] as const,
    popularTags: ["articles", "tags", "popular"] as const,
    allTags: (search: string) => [...articleKeys.all, "tags", "all", search] as const,
    popular: (articleId: string) => [...articleKeys.all, "popular", articleId] as const
};
```

Keying by `articleId` caches each article's exclusion set independently.

---

## 4. `useArticleDetailPopular`

`src/modules/articles/presentation/hooks/useArticleDetailPopular.ts`

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";

import { articleKeys } from "@/modules/articles/presentation/constants/articleKeys";
import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import container from "@/shared/infrastructure/service.locator";

/**
 * POPULAR_SIDEBAR_LIMIT
 *
 * @description
 * The maximum number of popular articles the sidebar shows.
 */
const POPULAR_SIDEBAR_LIMIT = 5;

/**
 * useArticleDetailPopular
 *
 * @description
 * Sources the popular-articles sidebar. There is no popularity endpoint, so this reads
 * promoted articles (editorially boosted, treated as "popular") via
 * `getPromotedArticlesUseCase`, excludes the current article, and returns up to five. When
 * promoted yields nothing usable it falls back to the first page of published articles via
 * `getPublishedArticlesUseCase`, also excluding the current article. Both use cases return
 * `Result`, which is unwrapped to an empty list on failure so the sidebar degrades quietly.
 *
 * @param currentArticleId - The article currently open, excluded from the results.
 * @returns The TanStack Query result whose `data` is up to five `IArticleSummaryEntity`.
 */
export function useArticleDetailPopular(currentArticleId: string) {
    return useQuery<IArticleSummaryEntity[]>({
        queryKey: articleKeys.popular(currentArticleId),
        queryFn: async () => {
            const promoted = await container.cradle.getPromotedArticlesUseCase.execute();
            const promotedList = promoted.ok ? promoted.value : [];
            const fromPromoted = promotedList.filter(
                (article) => article.id !== currentArticleId
            );
            if (fromPromoted.length > 0) {
                return fromPromoted.slice(0, POPULAR_SIDEBAR_LIMIT);
            }

            const page = await container.cradle.getPublishedArticlesUseCase.execute({
                pageIndex: 0,
                pageSize: POPULAR_SIDEBAR_LIMIT + 1
            });
            const publishedList = page.ok ? page.value.items : [];
            return publishedList
                .filter((article) => article.id !== currentArticleId)
                .slice(0, POPULAR_SIDEBAR_LIMIT);
        }
    });
}
```

---

## 5. `ArticleDetail.PopularSidebar`

`src/modules/articles/presentation/components/ArticleDetail/ArticleDetail.PopularSidebar.tsx`

Scoped prop: `currentArticleId` (the sidebar owns the hook, not the entity).

```tsx
"use client";

import { useTranslation } from "react-i18next";

import { useArticleDetailPopular } from "@/modules/articles/presentation/hooks/useArticleDetailPopular";
import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

import { ArticleCard } from "../ArticleCard";

/**
 * Props for ArticleDetail.PopularSidebar.
 *
 * @interface ArticleDetailPopularSidebarProps
 * @property {string} currentArticleId - The article currently open, excluded from the list.
 */
export interface ArticleDetailPopularSidebarProps {
    currentArticleId: string;
}

/**
 * PopularSkeleton
 *
 * @description
 * One placeholder row matching the ArticleCard.Horizontal footprint (a thumbnail block and
 * two title lines), shown while the popular query resolves so the column does not shift.
 */
function PopularSkeleton() {
    return (
        <div className="flex gap-3 rounded-xl border p-3">
            <Skeleton className="aspect-video w-28 shrink-0 rounded-md" />
            <div className="flex flex-1 flex-col gap-2 pt-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        </div>
    );
}

/**
 * ArticleDetail.PopularSidebar
 *
 * @description
 * The detail page's popular-articles column: a titled list of up to five
 * ArticleCard.Horizontal rows sourced from `useArticleDetailPopular`. While loading it
 * shows skeleton rows; when the resolved list is empty it renders nothing (no heading, no
 * empty-state box) so an empty column never occupies the layout.
 *
 * @param currentArticleId - The article currently open, excluded from the list.
 */
export function ArticleDetailPopularSidebar({
    currentArticleId
}: ArticleDetailPopularSidebarProps) {
    const { t } = useTranslation();
    const { data, isPending } = useArticleDetailPopular(currentArticleId);

    if (isPending) {
        return (
            <aside className="flex flex-col gap-3">
                <h2 className="font-semibold text-lg">{t("articles.sidebar.popular")}</h2>
                {Array.from({ length: 5 }, (_, index) => (
                    <PopularSkeleton key={`popular-skeleton-${index}`} />
                ))}
            </aside>
        );
    }

    if (!data || data.length === 0) return null;

    return (
        <aside className="flex flex-col gap-3">
            <h2 className="font-semibold text-lg">{t("articles.sidebar.popular")}</h2>
            {data.map((article) => (
                <ArticleCard.Horizontal
                    key={article.id}
                    article={article}
                />
            ))}
        </aside>
    );
}
```

> **Open question — approximate popularity.** "Promoted" is an editorial signal, not an
> engagement ranking. When a real trending/most-popular endpoint lands, replace the primary
> source and drop the published fallback. Tracked in
> [../19-open-questions.md](../19-open-questions.md).

---

## Tasks

- [ ] `ArticleCard.Horizontal` — bordered `Link` row, `~w-28` 16:9 thumbnail via `ArticleCard.Media`, `h4` `line-clamp-2` title, category Tag + date meta row; entry prop `IArticleSummaryEntity`.
- [ ] Barrel → `ArticleCard = { Feed, Horizontal }` with updated JSDoc.
- [ ] `articleKeys.popular(articleId)` key.
- [ ] `useArticleDetailPopular(currentArticleId)` — promoted primary, published fallback, exclude current, cap at 5, `Result` unwrap to empty on failure.
- [ ] `ArticleDetail.PopularSidebar` — titled column, loading skeletons, empty guard returns `null`; scoped prop `currentArticleId`.
- [ ] i18n `articles.sidebar.popular` heading key.
- [ ] `tsc` + biome clean.
