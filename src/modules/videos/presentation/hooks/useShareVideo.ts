"use client";

import { useQueryClient } from "@tanstack/react-query";

import type { IVideoDetailEntity } from "@/modules/videos/domain/entities/IVideoDetailEntity";
import { videoKeys } from "@/modules/videos/presentation/constants/videoKeys";
import container from "@/shared/infrastructure/service.locator";

/**
 * useShareVideo
 *
 * @description
 * Records a share event against the video, fire-and-forget: failures are
 * swallowed so telemetry never blocks the share surface, and the cached
 * detail entity's `shareCount` is bumped optimistically.
 *
 * @param videoId - The video the backend share event is recorded against.
 * @param slug - The video slug keying the cached detail entity.
 * @returns A `recordShare(target)` function for the share modal.
 */
export function useShareVideo(videoId: string, slug: string) {
    const queryClient = useQueryClient();

    return (shareChannel: string) => {
        void container.cradle.shareVideoUseCase.execute({ videoId, shareChannel });
        queryClient.setQueryData<IVideoDetailEntity>(videoKeys.detail(slug), (current) =>
            current ? { ...current, shareCount: current.shareCount + 1 } : current
        );
    };
}
