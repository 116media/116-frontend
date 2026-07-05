"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type { IArticlePage } from "@/modules/articles/domain/entities/IArticlePage";
import { dummyArticlePage } from "@/modules/articles/presentation/data/articles.dummy";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";
import {
    ARTICLES_PAGE_SIZE,
    articleKeys,
    type IArticleFeedFilters
} from "../constants/articleKeys";

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
        getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.pageIndex + 1 : undefined)
    });
}
