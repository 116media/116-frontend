"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type { ICommentedArticlePage } from "@/modules/articles/domain/entities/ICommentedArticleEntity";
import {
    articleKeys,
    FAVORITES_PAGE_SIZE
} from "@/modules/articles/presentation/constants/articleKeys";
import { dummyCommentedArticlePage } from "@/modules/articles/presentation/data/favorites.dummy";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useMyCommentedArticles
 *
 * @description
 * Infinite query for the articles the authenticated user has commented on via
 * `getOwnCommentedArticlesUseCase`, newest activity first. Gated by `enabled` so the list
 * only fetches once the session is known to be authenticated; a failed fetch falls back to
 * a dummy commented-articles page.
 *
 * @param enabled - Whether the caller is authenticated and the list should fetch.
 * @returns The `useInfiniteQuery` result for the commented-articles list.
 */
export function useMyCommentedArticles(enabled: boolean) {
    return useInfiniteQuery<ICommentedArticlePage, Failure>({
        queryKey: articleKeys.favorites.commented,
        enabled,
        initialPageParam: 0,
        queryFn: async ({ pageParam }) => {
            const result = await container.cradle.getOwnCommentedArticlesUseCase.execute({
                pageIndex: pageParam as number,
                pageSize: FAVORITES_PAGE_SIZE
            });
            return result.ok && result.value.items.length > 0
                ? result.value
                : dummyCommentedArticlePage(pageParam as number);
        },
        getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.pageIndex + 1 : undefined)
    });
}
