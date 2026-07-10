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
 * Sources the popular-videos sidebar from the popularity-ranked endpoint
 * (`getPopularVideosUseCase`), which orders published videos by weighted
 * engagement server-side and excludes the video currently open via `excludeId`.
 * The endpoint is fixed-size (capped at ten) and not paginated, so this is a
 * single `useQuery`, not an infinite query.
 *
 * Dummy-data phase: while the backend has no published content, a failed or
 * empty result falls back to the ten-item dummy popular pool (the current video
 * excluded) so the sidebar is previewable.
 *
 * @param currentVideoId - The video currently open, excluded from the results.
 * @returns The TanStack Query result whose `data` is up to ten `IVideoSummaryEntity`.
 */
export function useVideoDetailPopular(currentVideoId: string) {
    return useQuery<IVideoSummaryEntity[]>({
        queryKey: videoKeys.popular(currentVideoId),
        queryFn: async () => {
            const result = await container.cradle.getPopularVideosUseCase.execute({
                limit: POPULAR_VIDEOS_LIMIT,
                excludeId: currentVideoId
            });
            if (result.ok && result.value.length > 0) return result.value;
            return dummyPopularVideos(currentVideoId, POPULAR_VIDEOS_LIMIT);
        }
    });
}
