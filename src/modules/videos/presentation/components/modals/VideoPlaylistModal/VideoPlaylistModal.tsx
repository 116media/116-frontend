"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { IPlaylistEntity } from "@/modules/videos/domain/entities/IPlaylistEntity";
import { useAddToPlaylist } from "@/modules/videos/presentation/hooks/useAddToPlaylist";
import { useCreatePlaylist } from "@/modules/videos/presentation/hooks/useCreatePlaylist";
import { useMyPlaylists } from "@/modules/videos/presentation/hooks/useMyPlaylists";
import { Button } from "@/shared/presentation/components/ui/Button";
import { Checkbox } from "@/shared/presentation/components/ui/Checkbox";
import { ListPlusIcon } from "@/shared/presentation/components/ui/Icon";
import { Input } from "@/shared/presentation/components/ui/Input";
import { ModalForm } from "@/shared/presentation/components/ui/ModalForm";
import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";
import { formatCount } from "@/shared/presentation/utils/format/format.utils";

/**
 * Props for VideoPlaylistModal.
 *
 * @interface VideoPlaylistModalProps
 * @property {boolean} open - Whether the modal is open (controlled; the header
 * opens it behind `useRequireAuth`, so it always mounts authenticated).
 * @property {(open: boolean) => void} onOpenChange - Open-state setter (backdrop/esc/close).
 * @property {string} videoId - The video being added to playlists.
 */
export interface VideoPlaylistModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    videoId: string;
}

/**
 * VideoPlaylistModal
 *
 * @description
 * Add-to-playlist dialog on the shared `ModalForm` chrome: the signed-in user's
 * playlists as checkbox rows, an inline create-playlist affordance (created playlists
 * are auto-checked), and a cancel/add footer that fans the add out on submit.
 */
export function VideoPlaylistModal({ open, onOpenChange, videoId }: VideoPlaylistModalProps) {
    const { t } = useTranslation();
    const { data: playlists, isPending, isError, refetch } = useMyPlaylists(open);
    const createPlaylist = useCreatePlaylist();
    const addToPlaylist = useAddToPlaylist(videoId);

    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [creating, setCreating] = useState(false);
    const [newName, setNewName] = useState("");

    const toggle = (playlistId: string, checked: boolean) => {
        setSelected((current) => {
            const next = new Set(current);
            if (checked) next.add(playlistId);
            else next.delete(playlistId);
            return next;
        });
    };

    const cancelCreate = () => {
        setCreating(false);
        setNewName("");
    };

    const create = () => {
        const name = newName.trim();
        if (!name) return;
        createPlaylist.submit(name, (playlist) => {
            setNewName("");
            setCreating(false);
            toggle(playlist.id, true);
        });
    };

    const submit = () => {
        const targets = (playlists ?? []).filter((playlist) => selected.has(playlist.id));
        addToPlaylist.submit(targets, () => {
            setSelected(new Set());
            onOpenChange(false);
        });
    };

    return (
        <ModalForm
            open={open}
            onOpenChange={onOpenChange}
            header={t("videos.detail.playlist.title")}
            subtitle={t("videos.detail.playlist.subtitle")}
            onSubmit={(event) => {
                event.preventDefault();
                submit();
            }}
            footer={
                <>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        {t("videos.detail.playlist.cancel")}
                    </Button>
                    <Button
                        type="submit"
                        loading={addToPlaylist.isPending}
                        disabled={selected.size === 0}
                    >
                        {t("videos.detail.playlist.add")}
                    </Button>
                </>
            }
        >
            <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
                <StateRenderer
                    data={playlists}
                    loading={isPending}
                    error={isError}
                    skeleton={[0, 1, 2].map((row) => (
                        <div
                            key={row}
                            className="flex items-center gap-3 rounded-lg p-2"
                        >
                            <Skeleton className="size-4 rounded" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                    ))}
                    errorState={
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="rounded-lg p-2 text-left text-destructive text-sm hover:bg-muted/50"
                        >
                            {t("videos.detail.error.retry")}
                        </button>
                    }
                    empty={
                        <p className="p-2 text-muted-foreground text-sm">
                            {t("videos.detail.playlist.empty")}
                        </p>
                    }
                    render={(items) =>
                        items.map((playlist: IPlaylistEntity) => (
                            <label
                                key={playlist.id}
                                htmlFor={`playlist-${playlist.id}`}
                                className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                            >
                                <Checkbox
                                    id={`playlist-${playlist.id}`}
                                    checked={selected.has(playlist.id)}
                                    onCheckedChange={(checked) =>
                                        toggle(playlist.id, checked === true)
                                    }
                                />
                                <span className="flex min-w-0 flex-1 flex-col">
                                    <span className="truncate font-medium text-foreground text-sm">
                                        {playlist.name}
                                    </span>
                                    <span className="text-muted-foreground text-xs tabular-nums">
                                        {t("videos.detail.playlist.videos", {
                                            count: playlist.videoCount,
                                            value: formatCount(playlist.videoCount)
                                        })}
                                    </span>
                                </span>
                                <ListPlusIcon className="size-4 shrink-0 text-muted-foreground" />
                            </label>
                        ))
                    }
                />
            </div>

            {creating ? (
                <div className="flex items-center gap-2">
                    <Input
                        autoFocus
                        value={newName}
                        disabled={createPlaylist.isPending}
                        onChange={(event) => setNewName(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                                create();
                            }
                            if (event.key === "Escape") cancelCreate();
                        }}
                        placeholder={t("videos.detail.playlist.create.placeholder")}
                    />
                    <Button
                        size="sm"
                        type="button"
                        onClick={create}
                        loading={createPlaylist.isPending}
                        disabled={newName.trim().length === 0}
                        className="shrink-0"
                    >
                        {t("videos.detail.playlist.create.submit")}
                    </Button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => setCreating(true)}
                    className="flex items-center justify-center gap-2 rounded-lg border border-dashed p-3 text-muted-foreground text-sm transition-colors hover:bg-muted/50 hover:text-foreground"
                >
                    <ListPlusIcon className="size-4" />
                    {t("videos.detail.playlist.createNew")}
                </button>
            )}
        </ModalForm>
    );
}
