"use client";

import { useQuery } from "@tanstack/react-query";

import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";
import container from "@/shared/infrastructure/service.locator";
import { SIMILAR_VIDEOS_LIMIT, videoKeys } from "../constants/videoKeys";
import { dummySimilarVideos } from "../data/video-detail.dummy";

/**
 * useSimilarVideos
 *
 * @description
 * Query for the similar-videos tab. There is no similar-videos endpoint, so
 * similarity is approximated client-side as same category, newest first: one
 * published page scoped to the video's category (`SIMILAR_VIDEOS_LIMIT + 1`
 * items so three survive the exclusion), the open video filtered out, capped
 * at `SIMILAR_VIDEOS_LIMIT`. Lazy — `enabled` is passed by the tab so the
 * fetch only fires once the similar tab has been opened, then stays cached.
 * Failures degrade to an empty list (supplementary content, no error surface).
 *
 * Dummy-data phase: while the backend has no published content, a failed or
 * empty result falls back to dummy feed videos (thumbnails included, the open
 * video excluded) so the tab always previews.
 *
 * @param categoryId - The open video's category, scoping the published page.
 * @param currentVideoId - The video currently open, excluded from the results.
 * @param enabled - Whether the query may run (the similar tab has been opened).
 * @returns The `useQuery` result whose `data` is up to three `IVideoSummaryEntity`.
 */
export function useSimilarVideos(categoryId: string, currentVideoId: string, enabled: boolean) {
    return useQuery<IVideoSummaryEntity[]>({
        queryKey: videoKeys.similar(currentVideoId),
        enabled,
        queryFn: async () => {
            const result = await container.cradle.getPublishedVideosUseCase.execute({
                pageIndex: 0,
                pageSize: SIMILAR_VIDEOS_LIMIT + 1,
                categoryId
            });
            const similar = result.ok
                ? result.value
                      .filter((video) => video.id !== currentVideoId)
                      .slice(0, SIMILAR_VIDEOS_LIMIT)
                : [];
            if (similar.length > 0) return similar;
            return dummySimilarVideos(currentVideoId, SIMILAR_VIDEOS_LIMIT);
        }
    });
}
