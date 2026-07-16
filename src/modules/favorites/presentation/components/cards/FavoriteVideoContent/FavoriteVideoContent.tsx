"use client";

import type { ReactNode } from "react";

import { FavoriteCard } from "@/modules/favorites/presentation/components/cards/FavoriteCard";
import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";
import { VideoCardDate } from "@/modules/videos/presentation/components/cards/VideoCard/VideoCard.Date";
import { VideoCardRating } from "@/modules/videos/presentation/components/cards/VideoCard/VideoCard.Rating";
import { VideoCardShareCount } from "@/modules/videos/presentation/components/cards/VideoCard/VideoCard.ShareCount";
import { VIDEO_DETAIL_PATH } from "@/shared/presentation/constants/paths";

/**
 * Props for FavoriteVideoContent.
 *
 * @interface FavoriteVideoContentProps
 * @property {IVideoSummaryEntity} video - The video summary rendered as the card body.
 * @property {ReactNode} [children] - Favorites-specific slot rendered after the meta row.
 */
export interface FavoriteVideoContentProps {
    video: IVideoSummaryEntity;
    children?: ReactNode;
}

/**
 * FavoriteVideoContent
 *
 * @description
 * The shared video body for every favorites video tile: the title and a meta row mirroring
 * VideoCard.Vertical (published date on the left, share count and compact rating on the
 * right), followed by an optional favorites slot (activity meta, actions).
 */
export function FavoriteVideoContent({ video, children }: FavoriteVideoContentProps) {
    const href = VIDEO_DETAIL_PATH.replace(":slug", video.slug);

    return (
        <FavoriteCard.Body>
            <FavoriteCard.Title href={href}>{video.title}</FavoriteCard.Title>

            <div className="flex items-center justify-between gap-2 text-muted-foreground text-xs">
                <VideoCardDate publishedAt={video.publishedAt} />
                <span className="flex items-center gap-4">
                    <VideoCardShareCount shareCount={video.shareCount} />
                    <VideoCardRating
                        mode="compact"
                        ratingCount={video.ratingCount}
                        ratingAverage={video.ratingAverage}
                    />
                </span>
            </div>

            {children}
        </FavoriteCard.Body>
    );
}
