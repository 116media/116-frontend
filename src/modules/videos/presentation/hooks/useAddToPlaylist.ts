"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import type { IPlaylistEntity } from "@/modules/videos/domain/entities/IPlaylistEntity";
import type { Failure } from "@/shared/domain/failures/failure";
import { unknownFailure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";
import { showNotification } from "@/shared/presentation/utils/notification";
import { videoKeys } from "../constants/videoKeys";
import {
    playlistAddFailedNotification,
    playlistVideoAddedNotification
} from "../notifications/playlist.notification";

/**
 * useAddToPlaylist
 *
 * @description
 * Mutation that adds the video to every selected playlist. `submit` fans the
 * add use case out over the selection (each add appended at the playlist's
 * end via `sortOrder: videoCount`) and aggregates the results: any successful
 * add counts as a success (toast + `myPlaylists` invalidation + the caller's
 * `onAdded`, so the modal can close and reset); when every add fails, the
 * error toast fires and the modal keeps the selection for a retry.
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
            showNotification(playlistAddFailedNotification(t));
        }
    });

    const submit = (playlists: IPlaylistEntity[], onAdded?: () => void) =>
        mutation.mutate(playlists, {
            onSuccess: () => {
                showNotification(playlistVideoAddedNotification(t));
                queryClient.invalidateQueries({ queryKey: videoKeys.myPlaylists });
                onAdded?.();
            }
        });

    return { submit, isPending: mutation.isPending };
}
