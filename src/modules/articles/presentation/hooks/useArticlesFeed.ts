"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type { IArticlePage } from "@/modules/articles/domain/entities/IArticlePage";
import {
    ARTICLES_PAGE_SIZE,
    articleKeys,
    type IArticleFeedFilters
} from "@/modules/articles/presentation/constants/articleKeys";
import { dummyArticlePage } from "@/modules/articles/presentation/data/articles.dummy";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useArticlesFeed
 *
 * @description
 * Infinite query over the published-articles feed, keyed by the active filters. While the
 * backend has no published content, an empty unfiltered page is served as paged dummy
 * articles; a filtered query never falls back and stays empty.
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
