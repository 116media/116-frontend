"use client";

import { PlaylistVideoRow } from "@/modules/favorites/presentation/components/cards/PlaylistVideoRow";
import type { IPlaylistVideoEntity } from "@/modules/videos/domain/entities/IPlaylistVideoEntity";

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
 * The bordered, divided list of a playlist's videos, one {@link PlaylistVideoRow} per entry.
 * Presentational only; the parent owns data and the removal mutation.
 */
export function PlaylistVideoList({ videos, onRemove }: PlaylistVideoListProps) {
    return (
        <ul className="flex flex-col divide-y rounded-lg border">
            {videos.map((video) => (
                <PlaylistVideoRow
                    key={video.videoId}
                    video={video}
                    onRemove={() => onRemove(video)}
                />
            ))}
        </ul>
    );
}
