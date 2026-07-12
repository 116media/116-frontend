"use client";

import { useQuery } from "@tanstack/react-query";

import type { IVideoLyricsEntity } from "@/modules/videos/domain/entities/IVideoLyricsEntity";
import { videoKeys } from "@/modules/videos/presentation/constants/videoKeys";
import { dummyVideoLyrics } from "@/modules/videos/presentation/data/video-detail.dummy";
import container from "@/shared/infrastructure/service.locator";

/**
 * useVideoLyrics
 *
 * @description
 * Query for the lyrics linked to a video, driving the detail page's lyrics
 * tab. Lazy — fetches only once the tab opens; a missing-lyrics 404 resolves
 * to `null` (the tab's empty state) and a failed fetch falls back to dummies.
 *
 * @param videoId - The video whose lyrics to fetch.
 * @param enabled - Whether the query may run (the lyrics tab has been opened).
 * @returns The `useQuery` result whose `data` is the lyrics entity, or null when none exist.
 */
export function useVideoLyrics(videoId: string, enabled: boolean) {
    return useQuery<IVideoLyricsEntity | null>({
        queryKey: videoKeys.lyrics(videoId),
        enabled,
        queryFn: async () => {
            const result = await container.cradle.getVideoLyricsUseCase.execute(videoId);
            return result.ok ? result.value : dummyVideoLyrics(videoId);
        }
    });
}
