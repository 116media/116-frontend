"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import type { IPlaylistVideoEntity } from "@/modules/videos/domain/entities/IPlaylistVideoEntity";
import { Button } from "@/shared/presentation/components/ui/Button";
import { StarIcon, TrashIcon } from "@/shared/presentation/components/ui/Icon";
import { VIDEOS_PATH } from "@/shared/presentation/constants/paths";

/**
 * Props for PlaylistVideoRow.
 *
 * @interface PlaylistVideoRowProps
 * @property {IPlaylistVideoEntity} video - The playlist entry to render.
 * @property {() => void} onRemove - Starts the remove-from-playlist confirm flow.
 */
export interface PlaylistVideoRowProps {
    video: IPlaylistVideoEntity;
    onRemove: () => void;
}

/**
 * PlaylistVideoRow
 *
 * @description
 * One row in a playlist's video list: a linked thumbnail, the title, category, and rating,
 * plus a remove action. The parent owns the removal mutation; this row only signals intent.
 */
export function PlaylistVideoRow({ video, onRemove }: PlaylistVideoRowProps) {
    const { t } = useTranslation();

    return (
        <li className="flex items-center gap-3 p-3">
            <Link
                href={`${VIDEOS_PATH}/${video.slug}`}
                className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-md bg-muted"
            >
                {video.thumbnailUrl && (
                    <Image
                        fill
                        sizes="128px"
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="object-cover"
                    />
                )}
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
                <Link
                    href={`${VIDEOS_PATH}/${video.slug}`}
                    className="line-clamp-2 font-medium text-foreground text-sm hover:text-primary dark:hover:text-secondary"
                >
                    {video.title}
                </Link>
                <span className="text-muted-foreground text-xs">{video.categoryName}</span>
                <span className="flex items-center gap-1 text-muted-foreground text-xs">
                    <StarIcon className="size-3.5 fill-amber-400 text-yellow-400" />
                    {video.ratingAverage.toFixed(1)}
                </span>
            </div>
            <Button
                size="icon"
                variant="ghost"
                aria-label={t("favorites.playlist.removeVideo")}
                onClick={onRemove}
            >
                <TrashIcon />
            </Button>
        </li>
    );
}
