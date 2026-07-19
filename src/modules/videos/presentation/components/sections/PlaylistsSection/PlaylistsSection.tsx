"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { IPlaylistEntity } from "@/modules/videos/domain/entities/IPlaylistEntity";
import { PlaylistCard } from "@/modules/videos/presentation/components/cards/PlaylistCard";
import { PlaylistRenameDialog } from "@/modules/videos/presentation/components/forms/PlaylistRenameDialog";
import { PlaylistDetail } from "@/modules/videos/presentation/components/sections/PlaylistDetail";
import { useDeletePlaylist } from "@/modules/videos/presentation/hooks/useDeletePlaylist";
import { useMyPlaylists } from "@/modules/videos/presentation/hooks/useMyPlaylists";
import { useRenamePlaylist } from "@/modules/videos/presentation/hooks/useRenamePlaylist";
import { ConfirmDialog } from "@/shared/presentation/components/ui/ConfirmDialog";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { ListVideoIcon } from "@/shared/presentation/components/ui/Icon";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";

/**
 * Stable keys for the fixed set of playlist loading skeletons.
 */
const PLAYLIST_SKELETON_SLOTS = [0, 1, 2, 3, 4, 5];

/**
 * PlaylistsSection
 *
 * @description
 * Island for the `playlists` videos collection: lists the caller's playlists as cover-
 * collage cards, drills into one playlist's detail on open, and owns the rename/delete
 * flows at the grid level.
 */
export function PlaylistsSection() {
    const { t } = useTranslation();

    const { data, isLoading } = useMyPlaylists(true);
    const renamePlaylist = useRenamePlaylist();
    const deletePlaylist = useDeletePlaylist();

    const [openId, setOpenId] = useState<string | null>(null);
    const [renameTarget, setRenameTarget] = useState<IPlaylistEntity | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<IPlaylistEntity | null>(null);

    if (openId) {
        return (
            <PlaylistDetail
                id={openId}
                onClose={() => setOpenId(null)}
            />
        );
    }

    return (
        <>
            <StateRenderer
                data={data ?? []}
                loading={isLoading}
                skeleton={
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                        {PLAYLIST_SKELETON_SLOTS.map((slot) => (
                            <PlaylistCard.Loading key={slot} />
                        ))}
                    </div>
                }
                empty={
                    <EmptyState
                        context="favorites-playlists-empty"
                        icon={<ListVideoIcon className="size-10" />}
                        title={t("favorites.states.empty.playlists.title")}
                        subtitle={t("favorites.states.empty.playlists.body")}
                    />
                }
                render={(playlists) => (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                        {playlists.map((playlist) => (
                            <PlaylistCard
                                key={playlist.id}
                                playlist={playlist}
                                onOpen={() => setOpenId(playlist.id)}
                                onRename={() => setRenameTarget(playlist)}
                                onDelete={() => setDeleteTarget(playlist)}
                            />
                        ))}
                    </div>
                )}
            />

            <PlaylistRenameDialog
                open={renameTarget !== null}
                onOpenChange={(next) => !next && setRenameTarget(null)}
                initialName={renameTarget?.name ?? ""}
                loading={renamePlaylist.isPending}
                onSubmit={(name) => {
                    if (!renameTarget) return;
                    renamePlaylist.submit({ id: renameTarget.id, name }, () =>
                        setRenameTarget(null)
                    );
                }}
            />

            <ConfirmDialog
                destructive
                open={deleteTarget !== null}
                onOpenChange={(next) => !next && setDeleteTarget(null)}
                title={t("favorites.playlist.confirmDeleteTitle")}
                description={t("favorites.playlist.confirmDeleteBody", {
                    name: deleteTarget?.name ?? ""
                })}
                confirmLabel={t("favorites.playlist.confirmDelete")}
                cancelLabel={t("favorites.playlist.cancel")}
                loading={deletePlaylist.isPending}
                onConfirm={() => {
                    if (!deleteTarget) return;
                    deletePlaylist.submit(deleteTarget.id, () => setDeleteTarget(null));
                }}
            />
        </>
    );
}
