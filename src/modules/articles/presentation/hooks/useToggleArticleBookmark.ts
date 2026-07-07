"use client";

import container from "@/shared/infrastructure/service.locator";
import { runInteraction, useToggle } from "./useToggle";

/**
 * useToggleArticleBookmark
 *
 * @description
 * Optimistic bookmark toggle for one article. Wraps {@link useToggle} over the bookmark /
 * unbookmark use cases. `initialBookmarked` seeds the toggle from the entity's per-user
 * `isBookmarked` flag where the DTO provides one (the article detail); it defaults to
 * false on surfaces without the flag. Returns `{ bookmarked, count, toggle }`.
 *
 * @param articleId - The article to bookmark/unbookmark.
 * @param initialCount - The entity's `bookmarkCount` baseline.
 * @param initialBookmarked - The entity's per-user `isBookmarked` baseline. Defaults to false.
 * @returns `{ bookmarked, count, toggle }` for the bookmark button.
 */
export function useToggleArticleBookmark(
    articleId: string,
    initialCount: number,
    initialBookmarked = false
) {
    const { on, count, toggle } = useToggle(
        initialCount,
        (next) =>
            runInteraction(() =>
                (next
                    ? container.cradle.bookmarkArticleUseCase
                    : container.cradle.unbookmarkArticleUseCase
                ).execute(articleId)
            ),
        initialBookmarked
    );
    return { bookmarked: on, count, toggle };
}
