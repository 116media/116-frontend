"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { articleKeys } from "@/modules/articles/presentation/constants/articleKeys";
import { patchCommentInCache } from "@/modules/articles/presentation/utils/comments/comments.utils";
import { ArticleCommentNotification } from "@/modules/articles/presentation/utils/notification/articles.comment.notification";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";
import { showNotification } from "@/shared/presentation/utils/notification/notification.utils";

/**
 * Variables for one edit: the comment, its replacement body, and the parent id when the
 * edited row is a reply (so the right cache is patched).
 *
 * @interface IEditCommentVariables
 *
 * @property {string} commentId - The comment being edited
 * @property {string} body - The replacement text
 * @property {string | null} parentCommentId - The parent comment id when editing a reply, else null
 */
export interface IEditCommentVariables {
    commentId: string;
    body: string;
    parentCommentId: string | null;
}

/**
 * useEditArticleComment
 *
 * @description
 * Mutation that edits the caller's own comment. On success it patches the new body into
 * the cached comment list (or the reply thread for a reply) — no refetch, since the body
 * is the only change. Failures toast and leave the composer's text intact.
 *
 * @param articleId - The article the comment belongs to.
 * @returns `{ submit, isPending }` for the inline edit form.
 */
export function useEditArticleComment(articleId: string) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const mutation = useMutation<boolean, Failure, IEditCommentVariables>({
        mutationFn: async ({ commentId, body }) => {
            const result = await container.cradle.editArticleCommentUseCase.execute({
                articleId,
                commentId,
                body
            });
            if (!result.ok) throw result.error;
            return result.value;
        },
        onError: () => {
            showNotification(ArticleCommentNotification.editFailed(t));
        }
    });

    const submit = (variables: IEditCommentVariables, onEdited?: () => void) =>
        mutation.mutate(variables, {
            onSuccess: () => {
                const key = variables.parentCommentId
                    ? articleKeys.replies(variables.parentCommentId)
                    : articleKeys.comments(articleId);
                patchCommentInCache(queryClient, key, variables.commentId, {
                    body: variables.body
                });
                onEdited?.();
            }
        });

    return { submit, isPending: mutation.isPending };
}
