"use client";

import container from "@/shared/infrastructure/service.locator";
import { runInteraction, useToggle } from "@/shared/presentation/hooks/useToggle";

/**
 * useToggleShortLike
 *
 * @description
 * Optimistic like toggle for one short, wrapping {@link useToggle} over the like /
 * unlike use cases. `initialLiked` seeds the heart from the entity's per-viewer
 * `isLiked` flag; it defaults to false for anonymous readers.
 *
 * @param shortId - The short to like/unlike.
 * @param initialCount - The entity's `likeCount` baseline.
 * @param initialLiked - The entity's per-viewer `isLiked` baseline. Defaults to false.
 * @returns `{ liked, count, toggle }` for the like button.
 */
export function useToggleShortLike(shortId: string, initialCount: number, initialLiked = false) {
    const { on, count, toggle } = useToggle(
        initialCount,
        (next) =>
            runInteraction(() =>
                (next
                    ? container.cradle.likeShortUseCase
                    : container.cradle.unlikeShortUseCase
                ).execute(shortId)
            ),
        initialLiked
    );
    return { liked: on, count, toggle };
}
