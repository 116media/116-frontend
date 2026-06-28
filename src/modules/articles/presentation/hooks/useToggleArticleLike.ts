"use client";

import container from "@/shared/infrastructure/service.locator";
import { runInteraction, useToggle } from "./useToggle";

/**
 * useToggleArticleLike
 *
 * @description
 * Optimistic like toggle for one article. Wraps {@link useToggle} over the like / unlike
 * use cases. Returns `{ liked, count, toggle }`.
 *
 * @param articleId - The article to like/unlike.
 * @param initialCount - The entity's `likeCount` baseline.
 * @returns `{ liked, count, toggle }` for the card's like button.
 */
export function useToggleArticleLike(articleId: string, initialCount: number) {
    const { on, count, toggle } = useToggle(initialCount, (next) =>
        runInteraction(() =>
            (next
                ? container.cradle.likeArticleUseCase
                : container.cradle.unlikeArticleUseCase
            ).execute(articleId)
        )
    );
    return { liked: on, count, toggle };
}
