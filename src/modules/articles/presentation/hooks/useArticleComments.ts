"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type { IArticleCommentPage } from "@/modules/articles/domain/entities/IArticleCommentPage";
import {
    ARTICLE_COMMENTS_PAGE_SIZE,
    articleKeys
} from "@/modules/articles/presentation/constants/articleKeys";
import { dummyArticleCommentPage } from "@/modules/articles/presentation/data/article-detail.dummy";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useArticleComments
 *
 * @description
 * Infinite query for an article's comments via `getArticleCommentsUseCase`, paging on a
 * zero-based `pageIndex` while the mapped `hasNextPage` is true. Dummy-data phase: a
 * failed or empty page falls back to dummy comments so the thread stays previewable.
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
