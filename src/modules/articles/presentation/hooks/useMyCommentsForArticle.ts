"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type { IMyArticleCommentsPage } from "@/modules/articles/domain/entities/IMyArticleCommentsPage";
import {
    articleKeys,
    FAVORITES_MY_COMMENTS_PAGE_SIZE
} from "@/modules/articles/presentation/constants/articleKeys";
import { dummyMyArticleCommentsPage } from "@/modules/articles/presentation/data/favorites.dummy";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useMyCommentsForArticle
 *
 * @description
 * Infinite query for the authenticated user's own comments on one article via
 * `getOwnCommentsForArticleUseCase`, newest first. Gated by `enabled` so it only fetches
 * when the drawer is open and the session is authenticated; a failed fetch falls back to a
 * dummy per-article comments page.
 *
 * @param articleId - The article whose own-comments to page through.
 * @param enabled - Whether the drawer is open, the caller is authenticated, and the list should fetch.
 * @returns The `useInfiniteQuery` result for the per-article own-comments list.
 */
export function useMyCommentsForArticle(articleId: string, enabled: boolean) {
    return useInfiniteQuery<IMyArticleCommentsPage, Failure>({
        queryKey: articleKeys.favorites.myComments(articleId),
        enabled,
        initialPageParam: 0,
        queryFn: async ({ pageParam }) => {
            const result = await container.cradle.getOwnCommentsForArticleUseCase.execute({
                articleId,
                pageIndex: pageParam as number,
                pageSize: FAVORITES_MY_COMMENTS_PAGE_SIZE
            });
            return result.ok && result.value.items.length > 0
                ? result.value
                : dummyMyArticleCommentsPage(pageParam as number);
        },
        getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.pageIndex + 1 : undefined)
    });
}
