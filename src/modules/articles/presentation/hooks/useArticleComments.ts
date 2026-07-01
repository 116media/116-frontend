"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type { IArticleCommentPage } from "@/modules/articles/domain/entities/IArticleCommentPage";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";
import { ARTICLE_COMMENTS_PAGE_SIZE, articleKeys } from "../constants/articleKeys";
import { dummyArticleCommentPage } from "../data/article-detail.dummy";

/**
 * useArticleComments
 *
 * @description
 * Infinite query for an article's comments. Each page calls `getArticleCommentsUseCase`
 * with the next zero-based `pageIndex`; pages accumulate in the TanStack cache.
 * `getNextPageParam` returns the next index while the mapped `hasNextPage` is true, else
 * `undefined` (which sets the query's `hasNextPage` false).
 *
 * Dummy-data phase: while the backend has no published content, a failed or empty page
 * falls back to a page of dummy comments so the thread and its infinite scroll are
 * previewable exactly like real data.
 *
 * @param articleId - The article whose comments to page through.
 * @returns The `useInfiniteQuery` result for the comment list.
 */
export function useArticleComments(articleId: string) {
    return useInfiniteQuery<IArticleCommentPage, Failure>({
        queryKey: articleKeys.comments(articleId),
        initialPageParam: 0,
        queryFn: async ({ pageParam }) => {
            const pageIndex = pageParam as number;
            const result = await container.cradle.getArticleCommentsUseCase.execute({
                articleId,
                pageIndex,
                pageSize: ARTICLE_COMMENTS_PAGE_SIZE
            });
            if (!result.ok) return dummyArticleCommentPage(pageIndex, ARTICLE_COMMENTS_PAGE_SIZE);
            if (result.value.count === 0) {
                return dummyArticleCommentPage(pageIndex, ARTICLE_COMMENTS_PAGE_SIZE);
            }
            return result.value;
        },
        getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.pageIndex + 1 : undefined)
    });
}
