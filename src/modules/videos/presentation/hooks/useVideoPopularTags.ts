"use client";

import { useQuery } from "@tanstack/react-query";

import type { IVideoTagEntity } from "@/modules/videos/domain/entities/IVideoTagEntity";
import { videoKeys } from "@/modules/videos/presentation/constants/videoKeys";
import { generateDummyVideoTags } from "@/modules/videos/presentation/data/videos-browse.dummy";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useVideoPopularTags
 *
 * @description
 * Fetches the popular video tags shown inline in the tag strip. While the
 * backend has no seeded tags, an empty response falls back to dummy tags.
 *
 * @returns A TanStack query resolving the popular video tags.
 */
export function useVideoPopularTags() {
    return useQuery<IVideoTagEntity[], Failure>({
        queryKey: videoKeys.popularTags,
        queryFn: async () => {
            const result = await container.cradle.getVideoPopularTagsUseCase.execute();
            if (!result.ok) throw result.error;
            if (result.value.length === 0) return generateDummyVideoTags();
            return result.value;
        }
    });
}
