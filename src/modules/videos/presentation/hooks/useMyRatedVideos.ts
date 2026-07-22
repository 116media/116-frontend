"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type { IVideoActivityPage } from "@/modules/videos/domain/entities/IVideoActivityPage";
import {
    FAVORITES_VIDEOS_PAGE_SIZE,
    videoKeys
} from "@/modules/videos/presentation/constants/videoKeys";
import { dummyRatedVideoPage } from "@/modules/videos/presentation/data/favorites.dummy";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useMyRatedVideos
 *
 * @description
 * Infinite query for the authenticated user's rated videos via
 * `getOwnRatedVideosUseCase`, newest interaction first. Gated by `enabled` so the
 * page only fetches once the session is known to be authenticated; a failed fetch
 * falls back to a dummy rated-videos page.
 *
 * @param enabled - Whether the caller is authenticated and the list should fetch.
 * @returns The `useInfiniteQuery` result for the rated-videos grid.
 */
export function useMyRatedVideos(enabled: boolean) {
    return useInfiniteQuery<IVideoActivityPage, Failure>({
        queryKey: videoKeys.favorites.rated,
        enabled,
        initialPageParam: 0,
        queryFn: async ({ pageParam }) => {
            const result = await container.cradle.getOwnRatedVideosUseCase.execute({
                pageIndex: pageParam as number,
                pageSize: FAVORITES_VIDEOS_PAGE_SIZE
            });
            return result.ok && result.value.items.length > 0
                ? result.value
                : dummyRatedVideoPage(pageParam as number);
        },
        getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.pageIndex + 1 : undefined)
    });
}
