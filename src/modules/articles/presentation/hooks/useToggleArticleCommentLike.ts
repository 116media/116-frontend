"use client";

import container from "@/shared/infrastructure/service.locator";
import { runInteraction, useToggle } from "@/shared/presentation/hooks/useToggle";

/**
 * useToggleArticleCommentLike
 *
 * @description
 * Optimistic like toggle for one comment, wrapping {@link useToggle} over the comment
 * like / unlike use cases. Seeds from the comment's per-user `isLiked` flag; the caller
 * gates the toggle behind `useRequireAuth` like the article like button.
 *
 * @param commentId - The comment to like/unlike.
 * @param initialCount - The comment's `likeCount` baseline.
 * @param initialLiked - The comment's per-user `isLiked` baseline.
 * @returns `{ liked, count, toggle }` for the comment like button.
 */
export function useToggleArticleCommentLike(
    commentId: string,
    initialCount: number,
    initialLiked: boolean
) {
    const { on, count, toggle } = useToggle(
        initialCount,
        (next) =>
            runInteraction(() =>
                (next
                    ? container.cradle.likeArticleCommentUseCase
                    : container.cradle.unlikeArticleCommentUseCase
                ).execute(commentId)
            ),
        initialLiked
    );
    return { liked: on, count, toggle };
}
