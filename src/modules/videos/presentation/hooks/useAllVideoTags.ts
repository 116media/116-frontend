"use client";

import { useQuery } from "@tanstack/react-query";

import type { IVideoTagEntity } from "@/modules/videos/domain/entities/IVideoTagEntity";
import { videoKeys } from "@/modules/videos/presentation/constants/videoKeys";
import { generateDummyVideoTags } from "@/modules/videos/presentation/data/videos-browse.dummy";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useAllVideoTags
 *
 * @description
 * Fetches every video tag for the "All tags" popover, filtered by a (debounced)
 * search term, enabled only while the popover is open. While the backend has no
 * seeded tags, an empty response falls back to dummy tags.
 *
 * @param search - The popover's tag search term.
 * @param enabled - Whether the popover is open.
 * @returns A TanStack query resolving the matching tags.
 */
export function useAllVideoTags(search: string, enabled: boolean) {
    return useQuery<IVideoTagEntity[], Failure>({
        queryKey: videoKeys.allTags(search),
        enabled,
        queryFn: async () => {
            const result = await container.cradle.getAllVideoTagsUseCase.execute(
                search || undefined
            );
            if (!result.ok) throw result.error;
            if (result.value.length === 0) return generateDummyVideoTags(search);
            return result.value;
        }
    });
}
