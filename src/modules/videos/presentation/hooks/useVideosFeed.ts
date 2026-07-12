"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type { IVideoPage } from "@/modules/videos/domain/entities/IVideoPage";
import {
    type IVideoFeedFilters,
    VIDEOS_PAGE_SIZE,
    videoKeys
} from "@/modules/videos/presentation/constants/videoKeys";
import { paddedVideoPage } from "@/modules/videos/presentation/data/videos-browse.dummy";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useVideosFeed
 *
 * @description
 * Infinite query over the published-videos feed, keyed by the active filters.
 * While the backend holds less than one full page, the real videos are padded
 * with paged dummy videos (filters applied), so browsing stays previewable.
 *
 * @param filters - Optional search / category / tag scoping.
 * @returns The `useInfiniteQuery` result for the feed.
 */
export function useVideosFeed(filters: IVideoFeedFilters = {}) {
    return useInfiniteQuery<IVideoPage, Failure>({
        queryKey: videoKeys.feed(filters),
        initialPageParam: 0,
        queryFn: async ({ pageParam }) => {
            const pageIndex = pageParam as number;
            const result = await container.cradle.getPublishedVideosUseCase.execute({
                pageIndex,
                pageSize: VIDEOS_PAGE_SIZE,
                ...filters
            });
            if (!result.ok) throw result.error;
            const page = result.value;
            if (page.count >= VIDEOS_PAGE_SIZE) return page;
            return paddedVideoPage(page, filters);
        },
        getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.pageIndex + 1 : undefined)
    });
}
