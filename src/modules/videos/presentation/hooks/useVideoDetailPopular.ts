"use client";

import { useQuery } from "@tanstack/react-query";

import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";
import container from "@/shared/infrastructure/service.locator";
import { POPULAR_VIDEOS_LIMIT, videoKeys } from "../constants/videoKeys";
import { dummyPopularVideos } from "../data/video-detail.dummy";

/**
 * useVideoDetailPopular
 *
 * @description
 * Sources the popular-videos sidebar. There is no popular-videos endpoint, so
 * the list is derived client-side: promoted videos first (the editorial
 * "popular" signal), falling back to the first published page when promoted
 * yields nothing usable; the open video is excluded and the list capped at
 * `POPULAR_VIDEOS_LIMIT`. Failures degrade to an empty list so the sidebar
 * disappears quietly rather than erroring.
 *
 * Dummy-data phase: while the backend has no published content, a failed or
 * empty result falls back to dummy popular videos (each with a thumbnail, the
 * open video excluded) so the sidebar is previewable.
 *
 * @param currentVideoId - The video currently open, excluded from the results.
 * @returns The `useQuery` result whose `data` is up to five `IVideoSummaryEntity`.
 */
export function useVideoDetailPopular(currentVideoId: string) {
    return useQuery<IVideoSummaryEntity[]>({
        queryKey: videoKeys.popular(currentVideoId),
        queryFn: async () => {
            const promoted = await container.cradle.getPromotedVideosUseCase.execute();
            let popular = promoted.ok
                ? promoted.value.filter((video) => video.id !== currentVideoId)
                : [];

            if (popular.length === 0) {
                const published = await container.cradle.getPublishedVideosUseCase.execute({
                    pageIndex: 0,
                    pageSize: POPULAR_VIDEOS_LIMIT + 1
                });
                popular = published.ok
                    ? published.value.filter((video) => video.id !== currentVideoId)
                    : [];
            }

            if (popular.length > 0) return popular.slice(0, POPULAR_VIDEOS_LIMIT);
            return dummyPopularVideos(currentVideoId, POPULAR_VIDEOS_LIMIT);
        }
    });
}
