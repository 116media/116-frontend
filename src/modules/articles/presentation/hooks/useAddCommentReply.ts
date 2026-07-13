"use client";

import { type QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import type { IArticleCommentEntity } from "@/modules/articles/domain/entities/IArticleCommentEntity";
import type { IArticleCommentPage } from "@/modules/articles/domain/entities/IArticleCommentPage";
import type { IArticleAuthor } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import { articleKeys } from "@/modules/articles/presentation/constants/articleKeys";
import {
    patchCommentInCache,
    prependCommentToCache
} from "@/modules/articles/presentation/utils/comments/comments.utils";
import { ArticleCommentNotification } from "@/modules/articles/presentation/utils/notification/articles.comment.notification";
import { useAuth } from "@/modules/auth/presentation/context/AuthProvider";
import { useRequireAuth } from "@/modules/auth/presentation/hooks/useRequireAuth";
import type { IAuthUserEntity } from "@/shared/domain/entities/IAuthUserEntity";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";
import { showNotification } from "@/shared/presentation/utils/notification/notification.utils";

/**
 * Builds an IArticleAuthor from the authenticated user for a just-posted reply, so the
 * optimistic row shows a byline even when the create response does not project one.
 *
 * @param user - The authenticated user from the auth context, if any.
 * @returns The author projection, or undefined when no user is present.
 */
function authorFromUser(user: IAuthUserEntity | null): IArticleAuthor | undefined {
    if (!user) return undefined;
    return { userName: user.userName, avatarUrl: user.avatar?.storageUrl ?? null };
}

/**
 * Bumps the parent comment's `replyCount` in the article's cached comment list, reading
 * the current value from the cache so repeated replies stack correctly.
 *
 * @param queryClient - The active query client.
 * @param articleId - The article whose comment list cache to patch.
 * @param parentId - The top-level comment that received a reply.
 */
function bumpReplyCount(queryClient: QueryClient, articleId: string, parentId: string): void {
    const key = articleKeys.comments(articleId);
    const data = queryClient.getQueryData<{ pages: IArticleCommentPage[] }>(key);
    const parent = data?.pages
        .flatMap((page) => page.items)
        .find((comment) => comment.id === parentId);
    if (!parent) return;
    patchCommentInCache(queryClient, key, parentId, { replyCount: parent.replyCount + 1 });
}

/**
 * useAddCommentReply
 *
 * @description
 * Auth-gated mutation that replies to a top-level comment; `submit` runs behind
 * `useRequireAuth`. On success it prepends the reply to the cached thread, bumps the
 * parent's `replyCount` in the comment list, and invalidates the reply query.
 *
 * @param articleId - The article the parent comment belongs to.
 * @param commentId - The top-level comment being replied to.
 * @returns `{ submit, isPending }` for the reply composer.
 */
export function useAddCommentReply(articleId: string, commentId: string) {
    const { t } = useTranslation();
    const requireAuth = useRequireAuth();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const mutation = useMutation<IArticleCommentEntity, Failure, string>({
        mutationFn: async (body) => {
            const result = await container.cradle.addCommentReplyUseCase.execute({
                articleId,
                commentId,
                body
            });
            if (!result.ok) throw result.error;
            return result.value;
        },
        onError: () => {
            showNotification(ArticleCommentNotification.replyFailed(t));
        }
    });

    const submit = (body: string, onPosted?: () => void) =>
        requireAuth(() =>
            mutation.mutate(body, {
                onSuccess: (reply) => {
                    prependCommentToCache(queryClient, articleKeys.replies(commentId), {
                        ...reply,
                        author: reply.author ?? authorFromUser(user)
                    });
                    bumpReplyCount(queryClient, articleId, commentId);
                    queryClient.invalidateQueries({ queryKey: articleKeys.replies(commentId) });
                    onPosted?.();
                }
            })
        );

    return { submit, isPending: mutation.isPending };
}
