"use client";

import container from "@/shared/infrastructure/service.locator";
import { runInteraction, useToggle } from "./useToggle";

/**
 * useToggleArticleLike
 *
 * @description
 * Optimistic like toggle for one article. Wraps {@link useToggle} over the like / unlike
 * use cases. `initialLiked` seeds the toggle from the entity's per-user `isLiked` flag
 * where the DTO provides one (the article detail); it defaults to false on surfaces
 * without the flag. Returns `{ liked, count, toggle }`.
 *
 * @param articleId - The article to like/unlike.
 * @param initialCount - The entity's `likeCount` baseline.
 * @param initialLiked - The entity's per-user `isLiked` baseline. Defaults to false.
 * @returns `{ liked, count, toggle }` for the like button.
 */
export function useToggleArticleLike(
    articleId: string,
    initialCount: number,
    initialLiked = false
) {
    const { on, count, toggle } = useToggle(
        initialCount,
        (next) =>
            runInteraction(() =>
                (next
                    ? container.cradle.likeArticleUseCase
                    : container.cradle.unlikeArticleUseCase
                ).execute(articleId)
            ),
        initialLiked
    );
    return { liked: on, count, toggle };
}
