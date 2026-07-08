"use client";

import { useQuery } from "@tanstack/react-query";

import type { IYoutubeVideoStats } from "@/modules/videos/domain/entities/IYoutubeVideoStats";
import { videoKeys } from "@/modules/videos/presentation/constants/videoKeys";
import { dummyYoutubeStats } from "@/modules/videos/presentation/data/video-detail.dummy";
import container from "@/shared/infrastructure/service.locator";

const YOUTUBE_STATS_STALE_TIME_MS = 300_000;

/**
 * The all-null stats shape used when the video has no YouTube id — every
 * chip hides (null means hidden, not 0).
 */
const NULL_STATS: IYoutubeVideoStats = {
    hasStats: false,
    viewCount: null,
    likeCount: null,
    commentCount: null
};

/**
 * useYoutubeStats
 *
 * @description
 * Query for the YouTube Data API stat chips (views, likes, comments), proxied
 * through `/api/youtube/[videoId]` so the API key stays server-side. Falls back
 * to deterministic dummy stats when the upstream result fails or is all-null.
 *
 * @param youtubeId - The 11-character YouTube video id, or null when the video has none.
 * @returns The `useQuery` result whose `data` is the stats shape (fields null when hidden).
 */
export function useYoutubeStats(youtubeId: string | null) {
    return useQuery<IYoutubeVideoStats>({
        enabled: !!youtubeId,
        staleTime: YOUTUBE_STATS_STALE_TIME_MS,
        queryKey: videoKeys.youtubeStats(youtubeId ?? "none"),
        queryFn: async () => {
            if (!youtubeId) return NULL_STATS;
            const result = await container.cradle.getYoutubeVideoStatsUseCase.execute(youtubeId);
            if (result.ok && result.value.hasStats) return result.value;
            return dummyYoutubeStats(youtubeId);
        }
    });
}
