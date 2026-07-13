"use client";

import { type QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import type { IArticleDetailEntity } from "@/modules/articles/domain/entities/IArticleDetailEntity";
import { articleKeys } from "@/modules/articles/presentation/constants/articleKeys";
import { patchCommentInCache } from "@/modules/articles/presentation/utils/comments/comments.utils";
import { ArticleCommentNotification } from "@/modules/articles/presentation/utils/notification/articles.comment.notification";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";
import { showNotification } from "@/shared/presentation/utils/notification/notification.utils";

/**
 * Variables for one delete: the comment and the parent id when the deleted row is a
 * reply (so the right cache is patched).
 *
 * @interface IDeleteCommentVariables
 *
 * @property {string} commentId - The comment being deleted
 * @property {string | null} parentCommentId - The parent comment id when deleting a reply, else null
 */
export interface IDeleteCommentVariables {
    commentId: string;
    parentCommentId: string | null;
}

/**
 * Adjusts the cached detail entity's `commentCount` by a delta, keeping the header count
 * in step with a deleted top-level comment.
 *
 * @param queryClient - The active query client.
 * @param slug - The article slug keying the detail cache.
 * @param delta - The amount to add to `commentCount`.
 */
function bumpCommentCount(queryClient: QueryClient, slug: string, delta: number): void {
    queryClient.setQueryData<IArticleDetailEntity>(articleKeys.detail(slug), (current) =>
        current ? { ...current, commentCount: current.commentCount + delta } : current
    );
}

/**
 * useDeleteArticleComment
 *
 * @description
 * Mutation that soft-deletes the caller's own comment. On success the cached row flips
 * to its deleted presentation (`isDeleted: true`, `body: null`) — mirroring the backend's
 * soft delete — and a deleted top-level comment decrements the article's comment count.
 *
 * @param articleId - The article the comment belongs to.
 * @param slug - The article slug, to adjust `commentCount` on the cached detail entity.
 * @returns `{ submit, isPending }` for the delete action.
 */
export function useDeleteArticleComment(articleId: string, slug: string) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const mutation = useMutation<boolean, Failure, IDeleteCommentVariables>({
        mutationFn: async ({ commentId }) => {
            const result = await container.cradle.deleteArticleCommentUseCase.execute({
                articleId,
                commentId
            });
            if (!result.ok) throw result.error;
            return result.value;
        },
        onError: () => {
            showNotification(ArticleCommentNotification.deleteFailed(t));
        }
    });

    const submit = (variables: IDeleteCommentVariables) =>
        mutation.mutate(variables, {
            onSuccess: () => {
                const key = variables.parentCommentId
                    ? articleKeys.replies(variables.parentCommentId)
                    : articleKeys.comments(articleId);
                patchCommentInCache(queryClient, key, variables.commentId, {
                    isDeleted: true,
                    body: null,
                    author: undefined
                });
                if (!variables.parentCommentId) bumpCommentCount(queryClient, slug, -1);
            }
        });

    return { submit, isPending: mutation.isPending };
}
