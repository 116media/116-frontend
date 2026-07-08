"use client";

import { useQuery } from "@tanstack/react-query";

import type { IPlaylistEntity } from "@/modules/videos/domain/entities/IPlaylistEntity";
import { videoKeys } from "@/modules/videos/presentation/constants/videoKeys";
import { dummyPlaylists } from "@/modules/videos/presentation/data/video-detail.dummy";
import container from "@/shared/infrastructure/service.locator";

/**
 * useMyPlaylists
 *
 * @description
 * Query for the signed-in user's playlists, driving the add-to-playlist
 * modal's checkbox list. Lazy — fetches only once the modal opens, cached
 * under `videoKeys.myPlaylists`; a failed fetch falls back to dummy playlists.
 *
 * @param enabled - Whether the query may run (the modal is open).
 * @returns The `useQuery` result whose `data` is the user's playlists.
 */
export function useMyPlaylists(enabled: boolean) {
    return useQuery<IPlaylistEntity[]>({
        queryKey: videoKeys.myPlaylists,
        enabled,
        queryFn: async () => {
            const result = await container.cradle.getMyPlaylistsUseCase.execute();
            return result.ok ? result.value : dummyPlaylists();
        }
    });
}
