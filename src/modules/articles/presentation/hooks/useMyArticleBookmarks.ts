"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type { IArticleBookmarkPage } from "@/modules/articles/domain/entities/IArticleBookmarkEntity";
import {
    articleKeys,
    FAVORITES_PAGE_SIZE
} from "@/modules/articles/presentation/constants/articleKeys";
import { dummyArticleBookmarkPage } from "@/modules/articles/presentation/data/favorites.dummy";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useMyArticleBookmarks
 *
 * @description
 * Infinite query for the authenticated user's bookmarked articles via
 * `getOwnArticleBookmarksUseCase`, newest first. Gated by `enabled` so the list only
 * fetches once the session is known to be authenticated; a failed fetch falls back to a
 * dummy bookmarks page.
 *
 * @param enabled - Whether the caller is authenticated and the list should fetch.
 * @returns The `useInfiniteQuery` result for the bookmarked-articles list.
 */
export function useMyArticleBookmarks(enabled: boolean) {
    return useInfiniteQuery<IArticleBookmarkPage, Failure>({
        queryKey: articleKeys.favorites.bookmarked,
        enabled,
        initialPageParam: 0,
        queryFn: async ({ pageParam }) => {
            const result = await container.cradle.getOwnArticleBookmarksUseCase.execute({
                pageIndex: pageParam as number,
                pageSize: FAVORITES_PAGE_SIZE
            });
            return result.ok && result.value.items.length > 0
                ? result.value
                : dummyArticleBookmarkPage(pageParam as number);
        },
        getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.pageIndex + 1 : undefined)
    });
}
