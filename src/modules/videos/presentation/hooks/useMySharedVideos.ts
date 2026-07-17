"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type { IVideoActivityPage } from "@/modules/videos/domain/entities/IVideoActivityPage";
import {
    FAVORITES_VIDEOS_PAGE_SIZE,
    videoKeys
} from "@/modules/videos/presentation/constants/videoKeys";
import { dummySharedVideoPage } from "@/modules/videos/presentation/data/favorites.dummy";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useMySharedVideos
 *
 * @description
 * Infinite query for the authenticated user's shared videos via
 * `getOwnSharedVideosUseCase`, newest share first. Gated by `enabled` so the page
 * only fetches once the session is known to be authenticated; a failed fetch falls
 * back to a dummy shared-videos page.
 *
 * @param enabled - Whether the caller is authenticated and the list should fetch.
 * @returns The `useInfiniteQuery` result for the shared-videos grid.
 */
export function useMySharedVideos(enabled: boolean) {
    return useInfiniteQuery<IVideoActivityPage, Failure>({
        queryKey: videoKeys.favorites.shared,
        enabled,
        initialPageParam: 0,
        queryFn: async ({ pageParam }) => {
            const result = await container.cradle.getOwnSharedVideosUseCase.execute({
                pageIndex: pageParam as number,
                pageSize: FAVORITES_VIDEOS_PAGE_SIZE
            });
            return result.ok && result.value.items.length > 0
                ? result.value
                : dummySharedVideoPage(pageParam as number);
        },
        getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.pageIndex + 1 : undefined)
    });
}
