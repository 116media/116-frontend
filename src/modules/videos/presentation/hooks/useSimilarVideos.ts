"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";
import {
    SIMILAR_VIDEOS_PAGE_SIZE,
    videoKeys
} from "@/modules/videos/presentation/constants/videoKeys";
import { dummySimilarVideosPage } from "@/modules/videos/presentation/data/video-detail.dummy";
import container from "@/shared/infrastructure/service.locator";

/**
 * Simulated latency for the dummy fallback pages, in milliseconds. Reproduces
 * the network cadence so the infinite-scroll observer can re-measure between
 * pages instead of cascading through the whole in-memory pool in one frame.
 */
const DUMMY_PAGE_LATENCY_MS = 500;

/**
 * useSimilarVideos
 *
 * @description
 * Infinite query for the similar-videos tab. Approximates similarity as same
 * category, newest first via paginated `getPublishedVideos` with the open video
 * excluded; lazy until the tab opens, with a dummy-pool fallback per empty page.
 *
 * @param categoryId - The open video's category, scoping the published page.
 * @param currentVideoId - The video currently open, excluded from the results.
 * @param enabled - Whether the query may run (the similar tab has been opened).
 * @returns The `useInfiniteQuery` result for the similar grid.
 */
export function useSimilarVideos(categoryId: string, currentVideoId: string, enabled: boolean) {
    return useInfiniteQuery<IVideoSummaryEntity[]>({
        queryKey: videoKeys.similar(currentVideoId),
        enabled,
        initialPageParam: 0,
        queryFn: async ({ pageParam }) => {
            const pageIndex = pageParam as number;
            const result = await container.cradle.getPublishedVideosUseCase.execute({
                pageIndex,
                pageSize: SIMILAR_VIDEOS_PAGE_SIZE,
                categoryId
            });
            const real = result.ok
                ? result.value.filter((video) => video.id !== currentVideoId)
                : [];
            if (real.length > 0) return real;
            await new Promise((resolve) => setTimeout(resolve, DUMMY_PAGE_LATENCY_MS));
            return dummySimilarVideosPage(currentVideoId, pageIndex, SIMILAR_VIDEOS_PAGE_SIZE);
        },
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length === SIMILAR_VIDEOS_PAGE_SIZE ? allPages.length : undefined
    });
}
