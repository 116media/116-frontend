"use client";

import { type QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import type { IArticleCommentEntity } from "@/modules/articles/domain/entities/IArticleCommentEntity";
import type { IArticleCommentPage } from "@/modules/articles/domain/entities/IArticleCommentPage";
import type { IArticleDetailEntity } from "@/modules/articles/domain/entities/IArticleDetailEntity";
import type { IArticleAuthor } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import { articleKeys } from "@/modules/articles/presentation/constants/articleKeys";
import { ArticleCommentNotification } from "@/modules/articles/presentation/utils/notification/articles.comment.notification";
import { useAuth } from "@/modules/auth/presentation/context/AuthProvider";
import { useRequireAuth } from "@/modules/auth/presentation/hooks/useRequireAuth";
import type { IAuthUserEntity } from "@/shared/domain/entities/IAuthUserEntity";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";
import { showNotification } from "@/shared/presentation/utils/notification/notification.utils";

/**
 * Builds an IArticleAuthor from the authenticated user for a just-posted comment, so the
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
 * Prepends a comment to the first cached comment page and bumps its `count`, so a new
 * comment appears immediately at the top of the list.
 *
 * @param queryClient - The active query client.
 * @param articleId - The article whose comment cache to update.
 * @param comment - The comment to prepend.
 */
function prependComment(
    queryClient: QueryClient,
    articleId: string,
    comment: IArticleCommentEntity
): void {
    queryClient.setQueryData<{ pages: IArticleCommentPage[]; pageParams: unknown[] }>(
        articleKeys.comments(articleId),
        (current) => {
            if (!current) return current;
            const [first, ...rest] = current.pages;
            if (!first) return current;
            const nextFirst: IArticleCommentPage = {
                ...first,
                items: [comment, ...first.items],
                count: first.count + 1
            };
            return { ...current, pages: [nextFirst, ...rest] };
        }
    );
}

/**
 * Adjusts the cached detail entity's `commentCount` by a delta, keeping the header count
 * in step with an optimistic comment insert.
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
 * useAddArticleComment
 *
 * @description
 * Auth-gated mutation that posts a comment; `submit` runs behind `useRequireAuth`. On
 * success it prepends the comment to the first cached page, bumps the cached article's
 * `commentCount`, invalidates the comments query, and runs the caller's `onPosted`.
 *
 * @param articleId - The article to comment on.
 * @param slug - The article slug, to bump `commentCount` on the cached detail entity.
 * @returns `{ submit, isPending }` for the composer.
 */
export function useAddArticleComment(articleId: string, slug: string) {
    const { t } = useTranslation();
    const requireAuth = useRequireAuth();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const mutation = useMutation<IArticleCommentEntity, Failure, string>({
        mutationFn: async (body) => {
            const result = await container.cradle.addArticleCommentUseCase.execute({
                articleId,
                body
            });
            if (!result.ok) throw result.error;
            return result.value;
        },
        onError: () => {
            showNotification(ArticleCommentNotification.postFailed(t));
        }
    });

    const submit = (body: string, onPosted?: () => void) =>
        requireAuth(() =>
            mutation.mutate(body, {
                onSuccess: (comment) => {
                    prependComment(queryClient, articleId, {
                        ...comment,
                        author: comment.author ?? authorFromUser(user)
                    });
                    bumpCommentCount(queryClient, slug, 1);
                    queryClient.invalidateQueries({ queryKey: articleKeys.comments(articleId) });
                    onPosted?.();
                }
            })
        );

    return { submit, isPending: mutation.isPending };
}
