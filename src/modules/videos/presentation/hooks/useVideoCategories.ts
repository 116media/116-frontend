"use client";

import { useQuery } from "@tanstack/react-query";

import type { IVideoCategoryEntity } from "@/modules/videos/domain/entities/IVideoCategoryEntity";
import { videoKeys } from "@/modules/videos/presentation/constants/videoKeys";
import { generateDummyVideoCategories } from "@/modules/videos/presentation/data/videos-browse.dummy";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useVideoCategories
 *
 * @description
 * Fetches the active video categories (shows) for the browse chips and the
 * "browse all shows" modal. Cached under a stable key; while the backend has
 * no seeded categories, an empty response falls back to dummy categories.
 *
 * @returns A TanStack query resolving the active video categories.
 */
export function useVideoCategories() {
    return useQuery<IVideoCategoryEntity[], Failure>({
        queryKey: videoKeys.categories,
        queryFn: async () => {
            const result = await container.cradle.getVideoCategoriesUseCase.execute();
            if (!result.ok) throw result.error;
            if (result.value.length === 0) return generateDummyVideoCategories();
            return result.value;
        }
    });
}
