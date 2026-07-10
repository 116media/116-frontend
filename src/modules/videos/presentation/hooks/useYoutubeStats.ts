"use client";

import { useQuery } from "@tanstack/react-query";

import type { IYoutubeVideoStats } from "@/modules/videos/domain/entities/IYoutubeVideoStats";
import container from "@/shared/infrastructure/service.locator";
import { videoKeys } from "../constants/videoKeys";
import { dummyYoutubeStats } from "../data/video-detail.dummy";

const YOUTUBE_STATS_STALE_TIME_MS = 300_000;

/**
 * The all-null stats shape used when the video has no YouTube id — every
 * chip hides (null means hidden, not 0).
 */
const NULL_STATS: IYoutubeVideoStats = { viewCount: null, likeCount: null, commentCount: null };

/**
 * isAllNull
 *
 * @description
 * Whether every statistic in the shape is null — the signature of an
 * unresolvable upstream (missing `YOUTUBE_API_KEY`, quota, network), since a
 * real public video always exposes at least its view count.
 *
 * @param stats - The stats shape to inspect.
 * @returns True when no statistic carries a value.
 */
function isAllNull(stats: IYoutubeVideoStats): boolean {
    return stats.viewCount === null && stats.likeCount === null && stats.commentCount === null;
}

/**
 * useYoutubeStats
 *
 * @description
 * Query for the YouTube Data API statistics (views, likes, comments) shown as
 * stat chips on the detail page. Calls `getYoutubeVideoStatsUseCase`, which
 * proxies through the internal `/api/youtube/[videoId]` route so the API key
 * stays server-side. Gated on having a YouTube id at all, cached for five
 * minutes, and never error-surfacing.
 *
 * Dummy-data phase: while no `YOUTUBE_API_KEY` is configured, the route
 * resolves to the all-null shape (which would hide every chip), so a failed
 * or all-null result falls back to deterministic dummy stats and the chips
 * stay previewable. Real numbers take over as soon as a key is set.
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
            if (result.ok && !isAllNull(result.value)) return result.value;
            return dummyYoutubeStats(youtubeId);
        }
    });
}
