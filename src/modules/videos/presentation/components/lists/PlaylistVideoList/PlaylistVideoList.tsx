"use client";

import { useTranslation } from "react-i18next";

import type { IPlaylistVideoEntity } from "@/modules/videos/domain/entities/IPlaylistVideoEntity";
import { VideoCard } from "@/modules/videos/presentation/components/cards/VideoCard";
import { Button } from "@/shared/presentation/components/ui/Button";
import { TrashIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for PlaylistVideoList.
 *
 * @interface PlaylistVideoListProps
 * @property {IPlaylistVideoEntity[]} videos - The ordered playlist entries to render.
 * @property {(video: IPlaylistVideoEntity) => void} onRemove - Starts the remove flow for a row.
 */
export interface PlaylistVideoListProps {
    videos: IPlaylistVideoEntity[];
    onRemove: (video: IPlaylistVideoEntity) => void;
}

/**
 * PlaylistVideoList
 *
 * @description
 * Playlist videos rendered as horizontal cards with independent remove actions.
 */
export function PlaylistVideoList({ videos, onRemove }: PlaylistVideoListProps) {
    const { t } = useTranslation();

    return (
        <ul className="flex flex-col gap-3">
            {videos.map((video) => (
                <li key={video.videoId}>
                    <VideoCard.Horizontal
                        showCategory
                        video={video}
                        trailingAction={
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onRemove(video)}
                                aria-label={t("favorites.playlist.removeVideo")}
                                className="size-8 self-center p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            >
                                <TrashIcon />
                            </Button>
                        }
                    />
                </li>
            ))}
        </ul>
    );
}
