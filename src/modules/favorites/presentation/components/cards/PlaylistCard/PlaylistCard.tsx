"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";

import type { IPlaylistEntity } from "@/modules/videos/domain/entities/IPlaylistEntity";
import { Button } from "@/shared/presentation/components/ui/Button";
import { ListVideoIcon, TrashIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Mosaic layout per thumbnail count so the collage always fills a fixed 16:9 box:
 * the grid template plus the per-cell span for the first tile.
 */
const COLLAGE_LAYOUT: Record<1 | 2 | 3 | 4, { grid: string; firstSpan: string }> = {
    1: { grid: "grid-cols-1 grid-rows-1", firstSpan: "" },
    2: { grid: "grid-cols-2 grid-rows-1", firstSpan: "" },
    3: { grid: "grid-cols-2 grid-rows-2", firstSpan: "row-span-2" },
    4: { grid: "grid-cols-2 grid-rows-2", firstSpan: "" }
};

/**
 * Props for PlaylistCard.
 *
 * @interface PlaylistCardProps
 * @property {IPlaylistEntity} playlist - The playlist to render.
 * @property {() => void} onOpen - Opens the playlist detail view.
 * @property {() => void} onRename - Starts the rename flow.
 * @property {() => void} onDelete - Starts the delete-confirm flow.
 */
export interface PlaylistCardProps {
    playlist: IPlaylistEntity;
    onOpen: () => void;
    onRename: () => void;
    onDelete: () => void;
}

/**
 * PlaylistCard
 *
 * @description
 * One playlist tile: a cover collage of up to four thumbnails (a single placeholder when
 * the playlist has none), a video-count badge, the name, and an inline open/rename/delete
 * action row. Mutations are owned by the parent section; this card only signals intent.
 */
export function PlaylistCard({ playlist, onOpen, onRename, onDelete }: PlaylistCardProps) {
    const { t } = useTranslation();
    const thumbnails = playlist.thumbnailUrls.filter((url): url is string => Boolean(url));

    return (
        <article className="group flex flex-col overflow-hidden rounded-xl border bg-card">
            <button
                type="button"
                onClick={onOpen}
                aria-label={playlist.name}
                className="relative block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <div
                    className={cn(
                        "grid aspect-video gap-px bg-border",
                        thumbnails.length > 0 &&
                            COLLAGE_LAYOUT[Math.min(thumbnails.length, 4) as 1 | 2 | 3 | 4].grid
                    )}
                >
                    {thumbnails.length > 0 ? (
                        thumbnails.slice(0, 4).map((url, index) => (
                            <div
                                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length ordered collage slots
                                key={index}
                                className={cn(
                                    "relative overflow-hidden bg-muted",
                                    index === 0 &&
                                        COLLAGE_LAYOUT[
                                            Math.min(thumbnails.length, 4) as 1 | 2 | 3 | 4
                                        ].firstSpan
                                )}
                            >
                                <Image
                                    fill
                                    alt=""
                                    src={url}
                                    sizes="(max-width: 640px) 50vw, 200px"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center justify-center bg-muted text-muted-foreground">
                            <ListVideoIcon className="size-6" />
                        </div>
                    )}
                </div>
                <span className="absolute top-2 right-2 rounded-full bg-black/70 px-2 py-0.5 font-medium text-[11px] text-white">
                    {t("favorites.playlist.videoCount", { count: playlist.videoCount })}
                </span>
            </button>

            <div className="flex flex-1 flex-col p-3">
                <h3 className="line-clamp-3 min-h-[3lh] font-semibold text-foreground text-sm leading-snug">
                    {playlist.name}
                </h3>

                <div className="mt-2 flex items-center gap-1 border-t pt-2">
                    <Button
                        size="sm"
                        onClick={onOpen}
                        variant="brand-outline"
                    >
                        {t("favorites.playlist.open")}
                    </Button>
                    <Button
                        size="sm"
                        onClick={onRename}
                        variant="brand-outline"
                    >
                        {t("favorites.playlist.rename")}
                    </Button>
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={onDelete}
                        aria-label={t("favorites.playlist.delete")}
                        className="ml-auto text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                        <TrashIcon />
                    </Button>
                </div>
            </div>
        </article>
    );
}
