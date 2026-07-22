"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type { IArticleActivityPage } from "@/modules/articles/domain/entities/IArticleActivityEntity";
import {
    articleKeys,
    FAVORITES_PAGE_SIZE
} from "@/modules/articles/presentation/constants/articleKeys";
import { dummySharedArticlePage } from "@/modules/articles/presentation/data/favorites.dummy";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useMySharedArticles
 *
 * @description
 * Infinite query for the articles the authenticated user has shared via
 * `getOwnSharedArticlesUseCase`, newest share first. Gated by `enabled` so the list only
 * fetches once the session is known to be authenticated; a failed fetch falls back to a
 * dummy shared-articles page.
 *
 * @param enabled - Whether the caller is authenticated and the list should fetch.
 * @returns The `useInfiniteQuery` result for the shared-articles list.
 */
export function useMySharedArticles(enabled: boolean) {
    return useInfiniteQuery<IArticleActivityPage, Failure>({
        queryKey: articleKeys.favorites.shared,
        enabled,
        initialPageParam: 0,
        queryFn: async ({ pageParam }) => {
            const result = await container.cradle.getOwnSharedArticlesUseCase.execute({
                pageIndex: pageParam as number,
                pageSize: FAVORITES_PAGE_SIZE
            });
            return result.ok && result.value.items.length > 0
                ? result.value
                : dummySharedArticlePage(pageParam as number);
        },
        getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.pageIndex + 1 : undefined)
    });
}
