# Spec 03 — Infinite-Query Hook & Observer

Design ref: [../09-state-management-and-hooks.md](../09-state-management-and-hooks.md),
[../06-articles-grid-and-infinite-scroll.md](../06-articles-grid-and-infinite-scroll.md).

---

## 1. `useIntersectionObserver` (shared, reusable)

`src/shared/presentation/hooks/useIntersectionObserver.ts`.

```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useIntersectionObserver
 *
 * @description
 * Observes a target element and reports whether it currently intersects the viewport
 * (or a given root). Returns a callback ref to attach to the target and the latest
 * intersection state. The observer is recreated only when the options identity changes.
 *
 * @param options - Standard IntersectionObserver options (rootMargin, threshold, root).
 * @returns A tuple `[ref, isIntersecting]` — attach `ref` to the sentinel.
 */
export function useIntersectionObserver(
    options?: IntersectionObserverInit
): [(node: Element | null) => void, boolean] {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const ref = useCallback(
        (node: Element | null) => {
            observerRef.current?.disconnect();
            if (!node) return;
            observerRef.current = new IntersectionObserver(
                ([entry]) => setIsIntersecting(entry.isIntersecting),
                options
            );
            observerRef.current.observe(node);
        },
        [options]
    );

    useEffect(() => () => observerRef.current?.disconnect(), []);

    return [ref, isIntersecting];
}
```

> Pass a **stable** `options` object (module constant or `useMemo`) so the callback ref
> identity is stable; the container defines `{ rootMargin: "200px 0px" }` as a constant.

## 1b. `useDebouncedValue` (shared)

`src/shared/presentation/hooks/useDebouncedValue.ts` — used by the feed container (search)
and the all-tags popover. None exists yet.

```tsx
"use client";

import { useEffect, useState } from "react";

/**
 * useDebouncedValue
 *
 * @description
 * Returns a debounced copy of a rapidly-changing value: it updates to the latest `value`
 * only after `delayMs` has elapsed without a further change. Used so the article feed
 * re-queries once the user pauses typing rather than on every keystroke.
 *
 * @typeParam T - The value type.
 * @param value - The live value (e.g. the raw search string).
 * @param delayMs - Idle time before the debounced value updates.
 * @returns The debounced value.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(id);
    }, [value, delayMs]);

    return debounced;
}
```

## 2. Keys, constant, filters

`src/modules/articles/presentation/hooks/articleKeys.ts` (or alongside the hook).

```ts
/** Filters that scope the article feed (all optional; unset = the full feed). */
export interface IArticleFeedFilters {
    search?: string;
    categoryId?: string;
    tagSlug?: string;
}

/** Query keys for the articles feature. */
export const articleKeys = {
    all: ["articles"] as const,
    feed: (filters: IArticleFeedFilters = {}) =>
        [...articleKeys.all, "feed", filters] as const
};

/** Page size for the article feed (multiple of the 4-column grid). */
export const ARTICLES_PAGE_SIZE = 12;
```

## 3. `useArticlesFeed`

`src/modules/articles/presentation/hooks/useArticlesFeed.ts`.

```tsx
"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { container } from "@/shared/infrastructure/service.locator";
import type { Failure } from "@/shared/domain/results/failure";
import type { IArticlePage } from "@/modules/articles/domain/entities/IArticlePage";
import { dummyArticlePage } from "@/modules/articles/presentation/data/articles.dummy";
import { articleKeys, ARTICLES_PAGE_SIZE, type IArticleFeedFilters } from "./articleKeys";

/**
 * useArticlesFeed
 *
 * @description
 * Infinite query for the public article feed. Each page calls
 * `getPublishedArticlesUseCase` with the next zero-based `pageIndex`; pages accumulate
 * in the TanStack cache. `getNextPageParam` returns the next index while the mapped
 * `hasNextPage` is true, else `undefined` (which sets the query's `hasNextPage` false).
 * Errors surface as the typed `Failure`.
 *
 * Dummy-data phase: while the backend has no published content, an empty **unfiltered**
 * feed is served as paged dummy articles (`dummyArticlePage`) so infinite scroll pages
 * through the full dummy set exactly like real data. Dummy never stands in for a filtered
 * query — an empty filtered result stays empty (the grid shows "no articles match").
 *
 * @param filters - Optional search / category / tag scoping.
 * @returns The `useInfiniteQuery` result for the feed.
 */
export function useArticlesFeed(filters: IArticleFeedFilters = {}) {
    const isUnfiltered = !filters.search && !filters.categoryId && !filters.tagSlug;

    return useInfiniteQuery<IArticlePage, Failure>({
        queryKey: articleKeys.feed(filters),
        initialPageParam: 0,
        queryFn: async ({ pageParam }) => {
            const pageIndex = pageParam as number;
            const result = await container.cradle.getPublishedArticlesUseCase.execute({
                pageIndex,
                pageSize: ARTICLES_PAGE_SIZE,
                ...filters
            });
            if (!result.ok) throw result.error;
            const page = result.value;
            if (page.count === 0 && isUnfiltered) {
                return dummyArticlePage(pageIndex, ARTICLES_PAGE_SIZE);
            }
            return page;
        },
        getNextPageParam: (lastPage) =>
            lastPage.hasNextPage ? lastPage.pageIndex + 1 : undefined
    });
}
```

---

## Tasks

- [x] `useIntersectionObserver` created; disconnects on unmount and on ref change.
- [x] `useDebouncedValue` created.
- [x] `articleKeys`, `IArticleFeedFilters`, `ARTICLES_PAGE_SIZE` added.
- [x] `useArticlesFeed` created; `initialPageParam: 0`; `getNextPageParam` stops at end.
- [x] Dummy fallback is **paged** in the `queryFn` (empty + unfiltered → `dummyArticlePage`),
      so infinite scroll works over the 48 dummy articles; filtered-empty gets no dummy.
- [x] Error path throws the typed `Failure`.
- [x] `tsc` + biome clean.
