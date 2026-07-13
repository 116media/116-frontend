"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type { IArticlePage } from "@/modules/articles/domain/entities/IArticlePage";
import {
    articleKeys,
    BOOKMARKS_PAGE_SIZE
} from "@/modules/articles/presentation/constants/articleKeys";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useMyArticleBookmarks
 *
 * @description
 * Infinite query for the authenticated user's bookmarked articles via
 * `getMyArticleBookmarksUseCase`, newest first. Gated by `enabled` so the page only
 * fetches once the session is known to be authenticated; errors surface through the
 * query state with no dummy fallback.
 *
 * @param enabled - Whether the caller is authenticated and the list should fetch.
 * @returns The `useInfiniteQuery` result for the bookmarks grid.
 */
export function useMyArticleBookmarks(enabled: boolean) {
    return useInfiniteQuery<IArticlePage, Failure>({
        queryKey: articleKeys.bookmarks,
        enabled,
        initialPageParam: 0,
        queryFn: async ({ pageParam }) => {
            const result = await container.cradle.getMyArticleBookmarksUseCase.execute({
                pageIndex: pageParam as number,
                pageSize: BOOKMARKS_PAGE_SIZE
            });
            if (!result.ok) throw result.error;
            return result.value;
        },
        getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.pageIndex + 1 : undefined)
    });
}
