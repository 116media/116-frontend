"use client";

import container from "@/shared/infrastructure/service.locator";
import { runInteraction, useToggle } from "@/shared/presentation/hooks/useToggle";

/**
 * useToggleShortBookmark
 *
 * @description
 * Optimistic bookmark toggle for one short, wrapping {@link useToggle} over the
 * bookmark / unbookmark use cases. `initialBookmarked` seeds the state from the
 * entity's per-viewer `isBookmarked` flag; it defaults to false for anonymous readers.
 *
 * @param shortId - The short to bookmark/unbookmark.
 * @param initialCount - The entity's `bookmarkCount` baseline.
 * @param initialBookmarked - The entity's per-viewer `isBookmarked` baseline. Defaults to false.
 * @returns `{ bookmarked, count, toggle }` for the bookmark button.
 */
export function useToggleShortBookmark(
    shortId: string,
    initialCount: number,
    initialBookmarked = false
) {
    const { on, count, toggle } = useToggle(
        initialCount,
        (next) =>
            runInteraction(() =>
                (next
                    ? container.cradle.bookmarkShortUseCase
                    : container.cradle.unbookmarkShortUseCase
                ).execute(shortId)
            ),
        initialBookmarked
    );
    return { bookmarked: on, count, toggle };
}
