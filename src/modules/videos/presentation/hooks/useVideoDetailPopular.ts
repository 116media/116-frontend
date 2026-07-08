"use client";

import { useQuery } from "@tanstack/react-query";

import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";
import { POPULAR_VIDEOS_LIMIT, videoKeys } from "@/modules/videos/presentation/constants/videoKeys";
import { dummyPopularVideos } from "@/modules/videos/presentation/data/video-detail.dummy";
import container from "@/shared/infrastructure/service.locator";

/**
 * useVideoDetailPopular
 *
 * @description
 * Sources the popular-videos sidebar from the popularity-ranked endpoint,
 * excluding the open video. The endpoint is fixed-size (not paginated), so this
 * is a single query; a failed or empty result falls back to the dummy pool.
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
