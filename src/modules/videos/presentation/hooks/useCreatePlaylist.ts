"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import type { IPlaylistEntity } from "@/modules/videos/domain/entities/IPlaylistEntity";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";
import { showNotification } from "@/shared/presentation/utils/notification";
import { videoKeys } from "../constants/videoKeys";
import { playlistCreatedNotification } from "../notifications/playlist.notification";

/**
 * useCreatePlaylist
 *
 * @description
 * Mutation that creates a new playlist from the add-to-playlist modal's inline
 * create field. On success it toasts, appends the created playlist to the
 * cached `myPlaylists` list (so the row appears without a refetch), and hands
 * the entity to the caller's `onCreated` so the modal can auto-select it.
 *
 * @returns `{ submit, isPending }` for the inline create field.
 */
export function useCreatePlaylist() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const mutation = useMutation<IPlaylistEntity, Failure, string>({
        mutationFn: async (name) => {
            const result = await container.cradle.createPlaylistUseCase.execute(name);
            if (!result.ok) throw result.error;
            return result.value;
        }
    });

    const submit = (name: string, onCreated?: (playlist: IPlaylistEntity) => void) =>
        mutation.mutate(name, {
            onSuccess: (playlist) => {
                showNotification(playlistCreatedNotification(t));
                queryClient.setQueryData<IPlaylistEntity[]>(videoKeys.myPlaylists, (current) =>
                    current ? [...current, playlist] : [playlist]
                );
                onCreated?.(playlist);
            }
        });

    return { submit, isPending: mutation.isPending };
}
