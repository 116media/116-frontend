"use client";

import { useQuery } from "@tanstack/react-query";

import type { IVideoLyricsEntity } from "@/modules/videos/domain/entities/IVideoLyricsEntity";
import container from "@/shared/infrastructure/service.locator";
import { videoKeys } from "../constants/videoKeys";
import { dummyVideoLyrics } from "../data/video-detail.dummy";

/**
 * useVideoLyrics
 *
 * @description
 * Query for the lyrics linked to a video, driving the detail page's lyrics
 * tab. Lazy — `enabled` is passed by the tab so the fetch only fires once the
 * lyrics tab has been opened, then stays cached. A missing-lyrics 404 resolves
 * to `null`, which the tab renders as its empty state.
 *
 * Dummy-data phase: while the backend has no linked lyrics, a failed fetch
 * falls back to dummy lyrics so the tab is previewable; the `null` empty seam
 * stays in place for when the backend is wired.
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
