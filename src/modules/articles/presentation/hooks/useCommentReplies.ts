"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type { IArticleCommentPage } from "@/modules/articles/domain/entities/IArticleCommentPage";
import {
    articleKeys,
    COMMENT_REPLIES_PAGE_SIZE
} from "@/modules/articles/presentation/constants/articleKeys";
import { dummyCommentRepliesPage } from "@/modules/articles/presentation/data/article-detail.dummy";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useCommentReplies
 *
 * @description
 * Infinite query for a top-level comment's reply thread via `getCommentRepliesUseCase`,
 * gated by `enabled` so replies load only once the thread is expanded. Dummy-data phase:
 * a failed page falls back to the dummy thread (dummy comment ids never exist
 * server-side), keeping the nested design previewable.
 *
 * @param commentId - The comment whose replies to page through.
 * @param enabled - Whether the thread is expanded and should fetch.
 * @returns The `useInfiniteQuery` result for the reply list.
 */
export function useCommentReplies(commentId: string, enabled: boolean) {
    return useInfiniteQuery<IArticleCommentPage, Failure>({
        queryKey: articleKeys.replies(commentId),
        enabled,
        initialPageParam: 0,
        queryFn: async ({ pageParam }) => {
            const pageIndex = pageParam as number;
            const result = await container.cradle.getCommentRepliesUseCase.execute({
                commentId,
                pageIndex,
                pageSize: COMMENT_REPLIES_PAGE_SIZE
            });
            if (!result.ok) {
                return dummyCommentRepliesPage(commentId, pageIndex, COMMENT_REPLIES_PAGE_SIZE);
            }
            return result.value;
        },
        getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.pageIndex + 1 : undefined)
    });
}
