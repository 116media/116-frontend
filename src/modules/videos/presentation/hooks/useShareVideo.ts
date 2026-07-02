"use client";

import { useQueryClient } from "@tanstack/react-query";

import type { IVideoDetailEntity } from "@/modules/videos/domain/entities/IVideoDetailEntity";
import container from "@/shared/infrastructure/service.locator";
import { videoKeys } from "../constants/videoKeys";

/**
 * useShareVideo
 *
 * @description
 * Records a share event against the video, fire-and-forget: the use case
 * promise is not awaited and its failure is swallowed so telemetry never
 * blocks or breaks the share surface. The cached detail entity's `shareCount`
 * is bumped optimistically so the header pill updates immediately.
 *
 * @param videoId - The video the backend share event is recorded against.
 * @param slug - The video slug keying the cached detail entity.
 * @returns A `recordShare(platform)` function for the share modal.
 */
export function useShareVideo(videoId: string, slug: string) {
    const queryClient = useQueryClient();

    return (platform: string) => {
        void container.cradle.shareVideoUseCase.execute(videoId, platform);
        queryClient.setQueryData<IVideoDetailEntity>(videoKeys.detail(slug), (current) =>
            current ? { ...current, shareCount: current.shareCount + 1 } : current
        );
    };
}
