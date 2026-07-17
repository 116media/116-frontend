"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type { IShortVideoActivityPage } from "@/modules/shorts/domain/entities/IShortVideoActivityPage";
import {
    SHORTS_FAVORITES_PAGE_SIZE,
    shortKeys
} from "@/modules/shorts/presentation/constants/shortKeys";
import { dummySharedShortsPage } from "@/modules/shorts/presentation/data/favorites.dummy";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useMySharedShorts
 *
 * @description
 * Infinite query for the authenticated user's shared shorts via
 * `getOwnSharedShortsUseCase`, newest first. Gated by `enabled` so the list only
 * fetches once the session is known to be authenticated; a failed fetch falls back to
 * a dummy shared-shorts page.
 *
 * @param enabled - Whether the caller is authenticated and the list should fetch.
 * @returns The `useInfiniteQuery` result for the shared-shorts grid.
 */
export function useMySharedShorts(enabled: boolean) {
    return useInfiniteQuery<IShortVideoActivityPage, Failure>({
        queryKey: shortKeys.favorites.shared,
        enabled,
        initialPageParam: 0,
        queryFn: async ({ pageParam }) => {
            const result = await container.cradle.getOwnSharedShortsUseCase.execute({
                pageIndex: pageParam as number,
                pageSize: SHORTS_FAVORITES_PAGE_SIZE
            });
            return result.ok && result.value.items.length > 0
                ? result.value
                : dummySharedShortsPage(pageParam as number);
        },
        getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.pageIndex + 1 : undefined)
    });
}
