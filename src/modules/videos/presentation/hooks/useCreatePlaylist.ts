"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import type { IPlaylistEntity } from "@/modules/videos/domain/entities/IPlaylistEntity";
import { videoKeys } from "@/modules/videos/presentation/constants/videoKeys";
import { PlaylistNotification } from "@/modules/videos/presentation/utils/notification/videos.playlist.notification";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";
import { showNotification } from "@/shared/presentation/utils/notification/notification.utils";

/**
 * useCreatePlaylist
 *
 * @description
 * Mutation that creates a new playlist from the add-to-playlist modal's inline
 * create field. On success it toasts, appends the playlist to the cached
 * `myPlaylists` list, and hands the entity to the caller's `onCreated`.
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
                showNotification(PlaylistNotification.created(t));
                queryClient.setQueryData<IPlaylistEntity[]>(videoKeys.myPlaylists, (current) =>
                    current ? [...current, playlist] : [playlist]
                );
                onCreated?.(playlist);
            }
        });

    return { submit, isPending: mutation.isPending };
}
