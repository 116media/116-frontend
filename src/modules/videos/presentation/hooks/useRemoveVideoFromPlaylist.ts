"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import type { IRemoveVideoFromPlaylistInput } from "@/modules/videos/application/repositories/videos.repository.port";
import { videoKeys } from "@/modules/videos/presentation/constants/videoKeys";
import { PlaylistNotification } from "@/modules/videos/presentation/utils/notification/videos.playlist.notification";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";
import { showNotification } from "@/shared/presentation/utils/notification/notification.utils";

/**
 * useRemoveVideoFromPlaylist
 *
 * @description
 * Mutation that removes one video from one of the signed-in user's playlists. On
 * success it toasts and invalidates the affected playlist detail plus the
 * playlists list so the video count and cover collage refresh.
 *
 * @returns `{ submit, isPending }` for the remove action.
 */
export function useRemoveVideoFromPlaylist() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const mutation = useMutation<boolean, Failure, IRemoveVideoFromPlaylistInput>({
        mutationFn: async (input) => {
            const result = await container.cradle.removeVideoFromPlaylistUseCase.execute(input);
            if (!result.ok) throw result.error;
            return result.value;
        },
        onSuccess: (_data, input) => {
            showNotification(PlaylistNotification.videoRemoved(t));
            queryClient.invalidateQueries({
                queryKey: videoKeys.favorites.playlist(input.playlistId)
            });
            queryClient.invalidateQueries({
                queryKey: videoKeys.favorites.playlists
            });
        },
        onError: () => {
            showNotification(PlaylistNotification.removeFailed(t));
        }
    });

    const submit = (input: IRemoveVideoFromPlaylistInput, onRemoved?: () => void) =>
        mutation.mutate(input, { onSuccess: () => onRemoved?.() });

    return { submit, isPending: mutation.isPending };
}
