"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";
import container from "@/shared/infrastructure/service.locator";
import { SIMILAR_VIDEOS_PAGE_SIZE, videoKeys } from "../constants/videoKeys";
import { dummySimilarVideosPage } from "../data/video-detail.dummy";

/**
 * Simulated latency for the dummy fallback pages, in milliseconds. The real
 * paginated feed resolves over the network, which lets the infinite-scroll
 * IntersectionObserver re-measure between pages and stop once the viewport is
 * filled. The in-memory dummy pool would otherwise resolve every page within a
 * single frame, cascading through the whole pool before the observer can react
 * — so the grid would load all similar videos at once instead of on scroll.
 * This delay reproduces the network cadence so the dummy grid pages on scroll.
 */
const DUMMY_PAGE_LATENCY_MS = 500;

/**
 * useSimilarVideos
 *
 * @description
 * Infinite query for the similar-videos tab. There is no similar-videos
 * endpoint, so similarity is approximated as same category, newest first: each
 * page calls the paginated `getPublishedVideos` scoped to the open video's
 * category with the next zero-based `pageIndex`, the open video filtered out.
 * Lazy — `enabled` is passed by the tab so the first page only fetches once the
 * similar tab has been opened, then pages accumulate in the cache.
 * `getNextPageParam` returns the next index while the last page came back full,
 * else `undefined`. A real relatedness signal (shared tags, co-watch) is a
 * backend follow-up.
 *
 * Dummy-data phase: while the backend has no same-category content, each page
 * falls back to a slice of a rich dummy pool (feed dummies plus the popular
 * pool), so the grid infinite-scrolls through the dummies exactly like real
 * data and stops when the pool is exhausted.
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
