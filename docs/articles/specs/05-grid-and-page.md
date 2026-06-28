# Spec 05 — Grid, States & Page

Design ref: [../06-articles-grid-and-infinite-scroll.md](../06-articles-grid-and-infinite-scroll.md),
[../04-page-composition.md](../04-page-composition.md),
[../13-loading-empty-error.md](../13-loading-empty-error.md).

---

## 1. `ArticlesGrid` (presentational)

`src/modules/articles/presentation/components/ArticlesGrid/ArticlesGrid.tsx`.

```tsx
import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import { ArticleCard } from "@/modules/articles/presentation/components/ArticleCard";

/**
 * ArticlesGrid
 *
 * @description
 * The responsive grid of article cards — the homepage video-feed layout (1/2/4 columns)
 * without the section title or "view all" link. Purely presentational; the container
 * owns data and paging.
 *
 * @param articles - The accumulated article summaries to render.
 */
export function ArticlesGrid({ articles }: { articles: IArticleSummaryEntity[] }) {
    return (
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {articles.map((article) => (
                <ArticleCard.Feed key={article.id} article={article} />
            ))}
        </div>
    );
}
```

## 2. States

`ArticlesGridLoading.tsx`, `ArticlesGridEmpty.tsx`, `ArticlesGridError.tsx`,
`EndOfFeed.tsx` — per [../13-loading-empty-error.md](../13-loading-empty-error.md). All
use `bg-muted` / `text-muted-foreground` tokens; copy comes from i18n.

### `ArticlesGridLoading.tsx`

```tsx
import { cn } from "@/shared/presentation/utils/cn";
import { ARTICLES_PAGE_SIZE } from "@/modules/articles/presentation/hooks/articleKeys";

/**
 * ArticleCardSkeleton
 *
 * @description
 * A single card-shaped shimmer block matching the article card layout (16:9 media, meta,
 * title, and action lines), so replacing skeletons with real cards causes no layout shift.
 */
function ArticleCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-xl border bg-background">
            <div className="aspect-video animate-pulse bg-muted" />
            <div className="flex flex-col gap-3 p-5">
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
            </div>
        </div>
    );
}

/**
 * ArticlesGridLoading
 *
 * @description
 * Skeleton placeholder in the same 1/2/4-column grid layout as the real feed. Used on
 * first load (a full page of skeletons) and, with `rows={1}`, as the next-page indicator
 * under the grid while the following page loads.
 *
 * @param rows - How many grid rows of skeletons to render (default one page).
 */
export function ArticlesGridLoading({ rows }: { rows?: number }) {
    const count = rows ? rows * 4 : ARTICLES_PAGE_SIZE;
    return (
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: count }, (_, i) => (
                <ArticleCardSkeleton key={i} />
            ))}
        </div>
    );
}
```

### `ArticlesGridEmpty.tsx`

```tsx
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { NewspaperIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * ArticlesGridEmpty
 *
 * @description
 * Empty state for the article grid. With `filtered`, the current search/category/tag
 * matched nothing and a "Clear filters" action is offered; without it, the feed itself
 * has no content ("no articles yet"). Centered, muted, icon-led.
 *
 * @param filtered - Whether the emptiness is due to active filters.
 * @param onClear - Clears all filters (shown only when `filtered`).
 */
export function ArticlesGridEmpty({
    filtered,
    onClear
}: {
    filtered?: boolean;
    onClear?: () => void;
}) {
    const { t } = useTranslation();
    const key = filtered ? "noResults" : "empty";
    return (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
            <NewspaperIcon className="size-10 text-muted-foreground" />
            <p className="font-medium text-foreground">{t(`articles.grid.${key}.title`)}</p>
            <p className="max-w-sm text-muted-foreground text-sm">
                {t(`articles.grid.${key}.body`)}
            </p>
            {filtered && onClear && (
                <Button variant="outline" onClick={onClear}>
                    {t("articles.filters.clear")}
                </Button>
            )}
        </div>
    );
}
```

### `ArticlesGridError.tsx`

```tsx
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { AlertCircleIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * ArticlesGridError
 *
 * @description
 * Retryable error state for the article feed. Renders a short message and a button that
 * re-runs the query. Never falls back to dummy data — a real failure stays visible.
 *
 * @param onRetry - Re-runs the feed query (`refetch`).
 */
export function ArticlesGridError({ onRetry }: { onRetry: () => void }) {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
            <AlertCircleIcon className="size-10 text-muted-foreground" />
            <p className="font-medium text-foreground">{t("articles.grid.error.title")}</p>
            <Button variant="outline" onClick={onRetry}>
                {t("articles.grid.error.retry")}
            </Button>
        </div>
    );
}
```

### `EndOfFeed.tsx`

```tsx
import { useTranslation } from "react-i18next";

/**
 * EndOfFeed
 *
 * @description
 * The terminus shown when the feed has no further pages — a small, centered, muted line
 * giving screen-reader users a clear "end of list" cue that infinite scroll otherwise
 * hides.
 */
export function EndOfFeed() {
    const { t } = useTranslation();
    return (
        <p className="py-8 text-center text-muted-foreground text-sm">
            {t("articles.grid.end")}
        </p>
    );
}
```

## 3. `ArticlesFeedContainer` (client)

`src/modules/articles/presentation/components/ArticlesGrid/index.tsx`. Owns the filter
state, renders the toolbar (specced in
[08-search-and-filters.md](08-search-and-filters.md)), and drives the filtered feed.

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";

import { useArticlesFeed } from "@/modules/articles/presentation/hooks/useArticlesFeed";
import { useDebouncedValue } from "@/shared/presentation/hooks/useDebouncedValue";
import { useIntersectionObserver } from "@/shared/presentation/hooks/useIntersectionObserver";
import { ArticlesToolbar } from "@/modules/articles/presentation/components/ArticlesToolbar";
import { ArticlesGrid } from "./ArticlesGrid";
import { ArticlesGridLoading } from "./ArticlesGridLoading";
import { ArticlesGridEmpty } from "./ArticlesGridEmpty";
import { ArticlesGridError } from "./ArticlesGridError";
import { EndOfFeed } from "./EndOfFeed";

/** Pre-load the next page ~200px before the sentinel is visible. */
const SENTINEL_OPTIONS: IntersectionObserverInit = { rootMargin: "200px 0px" };

/**
 * ArticlesFeedContainer
 *
 * @description
 * Owns the article feed's filter state (search / category / tag), renders
 * {@link ArticlesToolbar} above the grid, and drives {@link useArticlesFeed} with the
 * debounced filters. Flattens the query's pages and renders {@link ArticlesGrid} with a
 * sentinel observed by {@link useIntersectionObserver} that requests the next page as it
 * enters the viewport. Shows skeleton / filtered-empty / error / end-of-feed states.
 * The dummy-data fallback lives in {@link useArticlesFeed} (paged), so an empty
 * unfiltered feed pages through the dummy set here with no special branch.
 */
export function ArticlesFeedContainer() {
    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
    const [tagSlug, setTagSlug] = useState<string | undefined>(undefined);

    const debouncedSearch = useDebouncedValue(search, 300);
    const filters = useMemo(
        () => ({ search: debouncedSearch || undefined, categoryId, tagSlug }),
        [debouncedSearch, categoryId, tagSlug]
    );
    const hasActiveFilters = Boolean(filters.search || categoryId || tagSlug);

    const {
        data, isLoading, isError, refetch,
        fetchNextPage, hasNextPage, isFetchingNextPage
    } = useArticlesFeed(filters);

    const [sentinelRef, isSentinelVisible] = useIntersectionObserver(SENTINEL_OPTIONS);

    const articles = data?.pages.flatMap((page) => page.items) ?? [];

    useEffect(() => {
        if (isSentinelVisible && hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, [isSentinelVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const clear = () => { setSearch(""); setCategoryId(undefined); setTagSlug(undefined); };

    const grid = () => {
        if (isLoading) return <ArticlesGridLoading />;
        if (isError) return <ArticlesGridError onRetry={refetch} />;
        if (articles.length === 0) {
            return hasActiveFilters
                ? <ArticlesGridEmpty filtered onClear={clear} />
                : <ArticlesGridEmpty />;
        }
        return (
            <div className="flex flex-col gap-8">
                <ArticlesGrid articles={articles} />
                {isFetchingNextPage && <ArticlesGridLoading rows={1} />}
                {hasNextPage ? (
                    <div ref={sentinelRef} aria-hidden className="h-px" />
                ) : (
                    <EndOfFeed />
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-6">
            <ArticlesToolbar
                search={search}
                onSearchChange={setSearch}
                categoryId={categoryId}
                onCategoryChange={setCategoryId}
                tagSlug={tagSlug}
                onTagChange={setTagSlug}
                hasActiveFilters={hasActiveFilters}
                onClear={clear}
            />
            {grid()}
        </div>
    );
}
```

> `useDebouncedValue` is a tiny shared hook (`useState` + `useEffect` + `setTimeout`);
> the raw `search` keeps the input instant while only the debounced value re-queries.

## 4. The page

`app/(public)/articles/page.tsx`.

```tsx
import { Suspense } from "react";

import { ArticlePromotionFeedContainer }
    from "@/modules/articles/presentation/components/ArticlePromotionFeed";
import { ArticlePromotionFeedLoading }
    from "@/modules/articles/presentation/components/ArticlePromotionFeed/ArticlePromotionFeedLoading";
import { ArticlesFeedContainer }
    from "@/modules/articles/presentation/components/ArticlesGrid";

/**
 * ArticlesPage
 *
 * @description
 * The public articles listing: the promoted-articles feed (reused from the homepage,
 * server-rendered) above the filter toolbar and an infinite-scrolling grid of every
 * published article.
 */
export default function ArticlesPage() {
    return (
        <div className="flex flex-col gap-8 lg:gap-12">
            <Suspense fallback={<ArticlePromotionFeedLoading />}>
                <ArticlePromotionFeedContainer />
            </Suspense>
            <ArticlesFeedContainer />
        </div>
    );
}
```

> Check `node_modules/next/dist/docs/` for any route-segment conventions (this Next is
> customized — see `apps/frontend/AGENTS.md`) before adding `metadata` etc.

---

## Tasks

- [x] `ArticlesGrid` — video-feed layout, no title/view-all.
- [x] `ArticlesGridLoading` / `Empty` (with `filtered` variant) / `Error` / `EndOfFeed`.
- [x] `useDebouncedValue` shared hook.
- [x] `ArticlesFeedContainer` — owns filter state, renders `ArticlesToolbar`, drives the
      filtered feed, wires the sentinel, guards double-fetch.
- [x] Empty + **unfiltered** feed pages through the dummy set (fallback in
      `useArticlesFeed`, not the container); empty + **filtered** feed renders the
      filtered-empty state with clear-filters.
- [x] `app/(public)/articles/page.tsx` composes promoted feed + feed container.
- [x] Scroll loads more; end-of-feed shows at the end; `tsc` + biome clean.
