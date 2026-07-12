"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import type { IPlaylistEntity } from "@/modules/videos/domain/entities/IPlaylistEntity";
import { videoKeys } from "@/modules/videos/presentation/constants/videoKeys";
import { PlaylistNotification } from "@/modules/videos/presentation/utils/notification/videos.playlist.notification";
import type { Failure } from "@/shared/domain/failures/failure";
import { unknownFailure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";
import { showNotification } from "@/shared/presentation/utils/notification/notification.utils";

/**
 * useAddToPlaylist
 *
 * @description
 * Mutation that adds the video to every selected playlist. `submit` fans the
 * add use case out over the selection and aggregates: any successful add counts
 * as success (toast, invalidation, `onAdded`); only an all-fail toasts an error.
 *
 * @param videoId - The video being added.
 * @returns `{ submit, isPending }` for the modal's footer button.
 */
export function useAddToPlaylist(videoId: string) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const mutation = useMutation<number, Failure, IPlaylistEntity[]>({
        mutationFn: async (playlists) => {
            const results = await Promise.all(
                playlists.map((playlist) =>
                    container.cradle.addVideoToPlaylistUseCase.execute({
                        playlistId: playlist.id,
                        videoId,
                        sortOrder: playlist.videoCount
                    })
                )
            );
            const added = results.filter((result) => result.ok && result.value).length;
            if (added === 0) {
                const failed = results.find((result) => !result.ok);
                throw failed && !failed.ok ? failed.error : unknownFailure();
            }
            return added;
        },
        onError: () => {
            showNotification(PlaylistNotification.addFailed(t));
        }
    });

    const submit = (playlists: IPlaylistEntity[], onAdded?: () => void) =>
        mutation.mutate(playlists, {
            onSuccess: () => {
                showNotification(PlaylistNotification.videoAdded(t));
                queryClient.invalidateQueries({ queryKey: videoKeys.myPlaylists });
                onAdded?.();
            }
        });

    return { submit, isPending: mutation.isPending };
}
