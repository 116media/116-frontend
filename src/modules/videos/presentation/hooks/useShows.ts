"use client";

import { useQuery } from "@tanstack/react-query";

import type { IShowEntity } from "@/modules/videos/domain/entities/IShowEntity";
import { SHOWS_PAGE_SIZE, videoKeys } from "@/modules/videos/presentation/constants/videoKeys";
import { generateDummyShows } from "@/modules/videos/presentation/data/shows.dummy";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useShows
 *
 * @description
 * Fetches the active video categories as shows (poster + colors) for the
 * shows surfaces. Cached under a stable key; while the backend holds less
 * than one grid window, the real shows are padded with dummy shows.
 *
 * @returns A TanStack query resolving the shows.
 */
export function useShows() {
    return useQuery<IShowEntity[], Failure>({
        queryKey: videoKeys.shows,
        queryFn: async () => {
            const result = await container.cradle.getShowsUseCase.execute();
            if (!result.ok) throw result.error;
            if (result.value.length >= SHOWS_PAGE_SIZE) return result.value;
            return [...result.value, ...generateDummyShows()];
        }
    });
}
