"use client";

import { useQuery } from "@tanstack/react-query";

import type { IPlaylistEntity } from "@/modules/videos/domain/entities/IPlaylistEntity";
import container from "@/shared/infrastructure/service.locator";
import { videoKeys } from "../constants/videoKeys";
import { dummyPlaylists } from "../data/video-detail.dummy";

/**
 * useMyPlaylists
 *
 * @description
 * Query for the signed-in user's playlists, driving the add-to-playlist
 * modal's checkbox list. Lazy — `enabled` is passed by the modal so the fetch
 * only fires once the modal opens (behind the auth gate), then stays cached
 * under `videoKeys.myPlaylists`.
 *
 * Dummy-data phase: while the backend has no account data to serve, a failed
 * fetch falls back to three dummy playlists so the modal is previewable. Once
 * the backend is wired this fallback is removed so a failure surfaces as
 * `isError` and the modal shows its inline retry line.
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
