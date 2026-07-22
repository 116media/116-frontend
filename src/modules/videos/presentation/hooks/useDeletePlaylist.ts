"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { videoKeys } from "@/modules/videos/presentation/constants/videoKeys";
import { PlaylistNotification } from "@/modules/videos/presentation/utils/notification/videos.playlist.notification";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";
import { showNotification } from "@/shared/presentation/utils/notification/notification.utils";

/**
 * useDeletePlaylist
 *
 * @description
 * Mutation that deletes one of the signed-in user's playlists from the favorites
 * view. On success it toasts and invalidates the playlists list so the deleted
 * playlist drops out of the grid.
 *
 * @returns `{ submit, isPending }` for the delete action.
 */
export function useDeletePlaylist() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const mutation = useMutation<boolean, Failure, string>({
        mutationFn: async (id) => {
            const result = await container.cradle.deletePlaylistUseCase.execute(id);
            if (!result.ok) throw result.error;
            return result.value;
        },
        onSuccess: () => {
            showNotification(PlaylistNotification.deleted(t));
            queryClient.invalidateQueries({
                queryKey: videoKeys.favorites.playlists
            });
        },
        onError: () => {
            showNotification(PlaylistNotification.deleteFailed(t));
        }
    });

    const submit = (id: string, onDeleted?: () => void) =>
        mutation.mutate(id, { onSuccess: () => onDeleted?.() });

    return { submit, isPending: mutation.isPending };
}
