"use client";

import { useQuery } from "@tanstack/react-query";

import type { IShowEntity } from "@/modules/videos/domain/entities/IShowEntity";
import { videoKeys } from "@/modules/videos/presentation/constants/videoKeys";
import { generateDummyShows } from "@/modules/videos/presentation/data/shows.dummy";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useShows
 *
 * @description
 * Fetches the active video categories as shows (poster + colors) for the
 * "browse all shows" modal. Cached under a stable key; while the backend has
 * no seeded categories, an empty response falls back to dummy shows.
 *
 * @returns A TanStack query resolving the shows.
 */
export function useShows() {
    return useQuery<IShowEntity[], Failure>({
        queryKey: videoKeys.shows,
        queryFn: async () => {
            const result = await container.cradle.getShowsUseCase.execute();
            if (!result.ok) throw result.error;
            if (result.value.length === 0) return generateDummyShows();
            return result.value;
        }
    });
}
