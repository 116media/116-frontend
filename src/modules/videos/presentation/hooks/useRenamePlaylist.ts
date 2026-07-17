"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import type { IRenamePlaylistInput } from "@/modules/videos/application/repositories/videos.repository.port";
import { videoKeys } from "@/modules/videos/presentation/constants/videoKeys";
import { PlaylistNotification } from "@/modules/videos/presentation/utils/notification/videos.playlist.notification";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";
import { showNotification } from "@/shared/presentation/utils/notification/notification.utils";

/**
 * useRenamePlaylist
 *
 * @description
 * Mutation that renames one of the signed-in user's playlists from the favorites
 * view. On success it toasts and invalidates the playlists list plus the affected
 * playlist detail so the new name comes back.
 *
 * @returns `{ submit, isPending }` for the rename field.
 */
export function useRenamePlaylist() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const mutation = useMutation<boolean, Failure, IRenamePlaylistInput>({
        mutationFn: async (input) => {
            const result = await container.cradle.renamePlaylistUseCase.execute(input);
            if (!result.ok) throw result.error;
            return result.value;
        },
        onSuccess: (_data, input) => {
            showNotification(PlaylistNotification.renamed(t));
            queryClient.invalidateQueries({
                queryKey: videoKeys.favorites.playlists
            });
            queryClient.invalidateQueries({
                queryKey: videoKeys.favorites.playlist(input.id)
            });
        },
        onError: () => {
            showNotification(PlaylistNotification.renameFailed(t));
        }
    });

    const submit = (input: IRenamePlaylistInput, onRenamed?: () => void) =>
        mutation.mutate(input, { onSuccess: () => onRenamed?.() });

    return { submit, isPending: mutation.isPending };
}
