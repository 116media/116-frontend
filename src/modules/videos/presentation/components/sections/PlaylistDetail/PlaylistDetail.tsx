"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { IPlaylistVideoEntity } from "@/modules/videos/domain/entities/IPlaylistVideoEntity";
import { PlaylistRenameDialog } from "@/modules/videos/presentation/components/forms/PlaylistRenameDialog";
import {
    PlaylistVideoList,
    PlaylistVideoListEmpty,
    PlaylistVideoListLoading
} from "@/modules/videos/presentation/components/lists/PlaylistVideoList";
import { PlaylistDetailHeader } from "@/modules/videos/presentation/components/navigation/PlaylistDetailHeader";
import { useDeletePlaylist } from "@/modules/videos/presentation/hooks/useDeletePlaylist";
import { usePlaylist } from "@/modules/videos/presentation/hooks/usePlaylist";
import { useRemoveVideoFromPlaylist } from "@/modules/videos/presentation/hooks/useRemoveVideoFromPlaylist";
import { useRenamePlaylist } from "@/modules/videos/presentation/hooks/useRenamePlaylist";
import { ConfirmDialog } from "@/shared/presentation/components/ui/ConfirmDialog";
import { ErrorState } from "@/shared/presentation/components/ui/ErrorState";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";

/**
 * Props for PlaylistDetail.
 *
 * @interface PlaylistDetailProps
 * @property {string} id - The playlist to show (UUID).
 * @property {() => void} onClose - Returns to the playlists grid (also called after delete).
 */
export interface PlaylistDetailProps {
    id: string;
    onClose: () => void;
}

/**
 * PlaylistDetail
 *
 * @description
 * Orchestrates one playlist's detail view: reads {@link usePlaylist} and composes the
 * header, the video list, and the rename/delete/remove confirmations, driving the matching
 * mutation hooks. Presentation lives in the header, list, and row components.
 */
export function PlaylistDetail({ id, onClose }: PlaylistDetailProps) {
    const { t } = useTranslation();

    const { data, isLoading, isError, refetch } = usePlaylist(id, true);
    const renamePlaylist = useRenamePlaylist();
    const deletePlaylist = useDeletePlaylist();
    const removeVideo = useRemoveVideoFromPlaylist();

    const [renameOpen, setRenameOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [removeTarget, setRemoveTarget] = useState<IPlaylistVideoEntity | null>(null);

    const name = data?.name ?? "";

    return (
        <div className="flex flex-col gap-6">
            <PlaylistDetailHeader
                name={name}
                onBack={onClose}
                onRename={() => setRenameOpen(true)}
                onDelete={() => setDeleteOpen(true)}
            />

            <StateRenderer
                error={isError}
                loading={isLoading}
                data={data?.videos ?? []}
                empty={<PlaylistVideoListEmpty />}
                skeleton={<PlaylistVideoListLoading />}
                errorState={
                    <ErrorState
                        onRetry={refetch}
                        title={t("favorites.states.error")}
                        retryLabel={t("favorites.states.retry")}
                        context="favorites-feed-error"
                    />
                }
                render={(videos) => (
                    <PlaylistVideoList
                        videos={videos}
                        onRemove={(video) => setRemoveTarget(video)}
                    />
                )}
            />

            <PlaylistRenameDialog
                open={renameOpen}
                onOpenChange={setRenameOpen}
                initialName={name}
                loading={renamePlaylist.isPending}
                onSubmit={(next) =>
                    renamePlaylist.submit({ id, name: next }, () => setRenameOpen(false))
                }
            />

            <ConfirmDialog
                destructive
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title={t("favorites.playlist.confirmDeleteTitle")}
                description={t("favorites.playlist.confirmDeleteBody", { name })}
                confirmLabel={t("favorites.playlist.confirmDelete")}
                cancelLabel={t("favorites.playlist.cancel")}
                loading={deletePlaylist.isPending}
                onConfirm={() =>
                    deletePlaylist.submit(id, () => {
                        setDeleteOpen(false);
                        onClose();
                    })
                }
            />

            <ConfirmDialog
                destructive
                open={removeTarget !== null}
                onOpenChange={(next) => !next && setRemoveTarget(null)}
                title={t("favorites.playlist.confirmRemoveTitle")}
                description={t("favorites.playlist.confirmRemoveBody", { name })}
                confirmLabel={t("favorites.playlist.confirmRemove")}
                cancelLabel={t("favorites.playlist.cancel")}
                loading={removeVideo.isPending}
                onConfirm={() => {
                    if (!removeTarget) return;
                    removeVideo.submit({ playlistId: id, videoId: removeTarget.videoId }, () =>
                        setRemoveTarget(null)
                    );
                }}
            />
        </div>
    );
}
