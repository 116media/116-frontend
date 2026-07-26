"use client";

import type { IPlaylistEntity } from "@/modules/videos/domain/entities/IPlaylistEntity";
import { FavoriteCard } from "@/shared/presentation/components/common/FavoriteCard";

import { PlaylistCardActions } from "./PlaylistCard.Actions";
import { PlaylistCardMedia } from "./PlaylistCard.Media";

/**
 * Props for the playlist card root.
 *
 * @property {IPlaylistEntity} playlist - Playlist summary rendered by the card.
 * @property {() => void} onOpen - Opens the playlist detail.
 * @property {() => void} onRename - Starts the rename flow.
 * @property {() => void} onDelete - Starts the delete flow.
 */
export interface PlaylistCardProps {
    playlist: IPlaylistEntity;
    onOpen: () => void;
    onRename: () => void;
    onDelete: () => void;
}

/**
 * Composes a playlist collage, fixed-height title, and actions with FavoriteCard parts.
 */
export function PlaylistCardRoot({ playlist, onOpen, onRename, onDelete }: PlaylistCardProps) {
    return (
        <FavoriteCard>
            <PlaylistCardMedia
                name={playlist.name}
                onOpen={onOpen}
                videoCount={playlist.videoCount}
                thumbnailUrls={playlist.thumbnailUrls}
            />

            <FavoriteCard.Body>
                <FavoriteCard.Title
                    onOpen={onOpen}
                    className="min-h-[2lh]"
                    contentClassName="line-clamp-2"
                >
                    {playlist.name}
                </FavoriteCard.Title>

                <PlaylistCardActions
                    onOpen={onOpen}
                    onRename={onRename}
                    onDelete={onDelete}
                />
            </FavoriteCard.Body>
        </FavoriteCard>
    );
}
