"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { IPlaylistEntity } from "@/modules/videos/domain/entities/IPlaylistEntity";
import { useAddToPlaylist } from "@/modules/videos/presentation/hooks/useAddToPlaylist";
import { useCreatePlaylist } from "@/modules/videos/presentation/hooks/useCreatePlaylist";
import { useMyPlaylists } from "@/modules/videos/presentation/hooks/useMyPlaylists";
import { Button } from "@/shared/presentation/components/ui/Button";
import { Checkbox } from "@/shared/presentation/components/ui/Checkbox";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/shared/presentation/components/ui/Dialog";
import { Input } from "@/shared/presentation/components/ui/Input";
import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";
import { formatCount } from "@/shared/presentation/utils/formatCount";

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
 * The add-to-playlist surface: a dialog listing the signed-in user's
 * playlists as checkbox rows (name + video count), with an inline
 * create-playlist field and a footer submit. Selection lives in a local
 * `Set<string>`; a created playlist is appended to the cached list and
 * auto-checked. The submit button pluralizes with the live selection size,
 * stays disabled at zero, and shows the pending state while the add fans out;
 * success toasts, closes, and resets the selection, while a failure toasts
 * and keeps the selection for a retry. While the playlists load, three
 * skeleton rows hold the space; a failed load shows an inline retry line.
 *
 * @param open - Whether the modal is open (controlled).
 * @param onOpenChange - Open-state setter.
 * @param videoId - The video being added to playlists.
 */
export function VideoPlaylistModal({ open, onOpenChange, videoId }: VideoPlaylistModalProps) {
    const { t } = useTranslation();
    const { data: playlists, isPending, isError, refetch } = useMyPlaylists(open);
    const createPlaylist = useCreatePlaylist();
    const addToPlaylist = useAddToPlaylist(videoId);

    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [newName, setNewName] = useState("");

    const toggle = (playlistId: string, checked: boolean) => {
        setSelected((current) => {
            const next = new Set(current);
            if (checked) next.add(playlistId);
            else next.delete(playlistId);
            return next;
        });
    };

    const create = () => {
        const name = newName.trim();
        if (!name) return;
        createPlaylist.submit(name, (playlist) => {
            setNewName("");
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
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent aria-describedby={undefined}>
                <div className="relative grid gap-5 rounded-2xl border border-border bg-card p-6 shadow-xl">
                    <DialogHeader>
                        <DialogTitle>{t("videos.detail.playlist.title")}</DialogTitle>
                    </DialogHeader>

                    <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
                        {isPending &&
                            [0, 1, 2].map((row) => (
                                <div
                                    key={row}
                                    className="flex items-center gap-3 rounded-lg p-2"
                                >
                                    <Skeleton className="size-4 rounded" />
                                    <Skeleton className="h-4 w-40" />
                                </div>
                            ))}

                        {isError && (
                            <button
                                type="button"
                                onClick={() => refetch()}
                                className="rounded-lg p-2 text-left text-destructive text-sm hover:bg-muted/50"
                            >
                                {t("videos.detail.error.retry")}
                            </button>
                        )}

                        {!isPending && !isError && playlists?.length === 0 && (
                            <p className="p-2 text-muted-foreground text-sm">
                                {t("videos.detail.playlist.empty")}
                            </p>
                        )}

                        {playlists?.map((playlist: IPlaylistEntity) => (
                            <label
                                key={playlist.id}
                                htmlFor={`playlist-${playlist.id}`}
                                className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                            >
                                <Checkbox
                                    id={`playlist-${playlist.id}`}
                                    checked={selected.has(playlist.id)}
                                    onCheckedChange={(checked) =>
                                        toggle(playlist.id, checked === true)
                                    }
                                />
                                <span className="min-w-0 flex-1 truncate font-medium text-foreground text-sm">
                                    {playlist.name}
                                </span>
                                <span className="text-muted-foreground text-xs tabular-nums">
                                    {formatCount(playlist.videoCount)}
                                </span>
                            </label>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 border-t pt-4">
                        <Input
                            value={newName}
                            disabled={createPlaylist.isPending}
                            onChange={(event) => setNewName(event.target.value)}
                            onKeyDown={(event) => event.key === "Enter" && create()}
                            placeholder={t("videos.detail.playlist.create.placeholder")}
                        />
                        <Button
                            size="sm"
                            type="button"
                            variant="outline"
                            onClick={create}
                            loading={createPlaylist.isPending}
                            disabled={newName.trim().length === 0}
                        >
                            {t("videos.detail.playlist.create.submit")}
                        </Button>
                    </div>

                    <Button
                        type="button"
                        onClick={submit}
                        loading={addToPlaylist.isPending}
                        disabled={selected.size === 0}
                    >
                        {t("videos.detail.playlist.addCount", { count: selected.size })}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
