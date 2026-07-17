"use client";

import { useQuery } from "@tanstack/react-query";

import type { IPlaylistDetailEntity } from "@/modules/videos/domain/entities/IPlaylistDetailEntity";
import { videoKeys } from "@/modules/videos/presentation/constants/videoKeys";
import { dummyPlaylistDetail } from "@/modules/videos/presentation/data/favorites.dummy";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * usePlaylist
 *
 * @description
 * Query for one of the signed-in user's playlists with its ordered videos via
 * `getPlaylistByIdUseCase`. Lazy — fetches only once the detail view is open
 * (`enabled`), cached under `videoKeys.favorites.playlist(id)`; a failed fetch falls
 * back to a dummy playlist detail.
 *
 * @param id - The playlist to fetch (UUID).
 * @param enabled - Whether the query may run (the detail view is open).
 * @returns The `useQuery` result whose `data` is the playlist detail.
 */
export function usePlaylist(id: string, enabled: boolean) {
    return useQuery<IPlaylistDetailEntity, Failure>({
        queryKey: videoKeys.favorites.playlist(id),
        enabled,
        queryFn: async () => {
            const result = await container.cradle.getPlaylistByIdUseCase.execute(id);
            return result.ok ? result.value : dummyPlaylistDetail(id);
        }
    });
}
