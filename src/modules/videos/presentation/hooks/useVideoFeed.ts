"use client";

import { useQuery } from "@tanstack/react-query";

import type { IVideoFeedEntity } from "@/modules/videos/domain/entities/IVideoFeedEntity";
import { videoKeys } from "@/modules/videos/presentation/constants/videoKeys";
import { generateDummyVideoFeed } from "@/modules/videos/presentation/data/video-feed.dummy";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useVideoFeed
 *
 * @description
 * Fetches the homepage's pinned-category video sections. While the backend holds no
 * sections, or refuses the request, the dummy feed stands in so the homepage still has
 * a band to show.
 *
 * @returns A TanStack query resolving the feed sections.
 */
export function useVideoFeed() {
    return useQuery<IVideoFeedEntity[], Failure>({
        queryKey: videoKeys.homeFeed,
        queryFn: async () => {
            const result = await container.cradle.getVideoFeedUseCase.execute();
            if (result.ok && result.value.length > 0) return result.value;
            return generateDummyVideoFeed();
        }
    });
}
