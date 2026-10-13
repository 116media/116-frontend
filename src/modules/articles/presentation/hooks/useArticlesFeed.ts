"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type { IArticlePage } from "@/modules/articles/domain/entities/IArticlePage";
import {
    ARTICLES_PAGE_SIZE,
    articleKeys,
    type IArticleFeedFilters
} from "@/modules/articles/presentation/constants/articleKeys";
import {
    dummyArticlePage,
    paddedArticlePage
} from "@/modules/articles/presentation/data/articles.dummy";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useArticlesFeed
 *
 * @description
 * Infinite query over the published-articles feed, keyed by the active filters. While the
 * backend holds less than one full page, the real articles are padded with paged dummy
 * articles so browsing stays previewable; a filtered query never falls back and stays
 * empty, so a filter's real result count is always honest.
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

            if (!isUnfiltered || page.count >= ARTICLES_PAGE_SIZE) return page;
            if (page.count === 0) return dummyArticlePage(pageIndex, ARTICLES_PAGE_SIZE);

            return paddedArticlePage(page);
        },
        getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.pageIndex + 1 : undefined)
    });
}
