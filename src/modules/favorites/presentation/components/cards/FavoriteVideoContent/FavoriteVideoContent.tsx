"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";
import { VideoCardDate } from "@/modules/videos/presentation/components/cards/VideoCard/VideoCard.Date";
import { VideoCardMedia } from "@/modules/videos/presentation/components/cards/VideoCard/VideoCard.Media";
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
 * The shared body for every favorites video tile, matching VideoCard.Vertical exactly: a
 * poster thumbnail with the frosted play-on-hover, a two-line title, and the
 * date/share/rating meta row. An optional favorites slot (activity meta, actions) renders
 * below, styled like the article tiles.
 */
export function FavoriteVideoContent({ video, children }: FavoriteVideoContentProps) {
    const href = VIDEO_DETAIL_PATH.replace(":slug", video.slug);

    return (
        <article className="group relative flex h-full flex-col transition-transform duration-300 hover:z-10 hover:scale-[1.03]">
            <span
                aria-hidden
                className="pointer-events-none absolute -inset-2 -z-10 rounded-2xl transition-colors duration-300 group-hover:bg-muted/95"
            />
            <Link
                href={href}
                aria-label={video.title}
                className="relative block aspect-video overflow-hidden rounded-lg bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <VideoCardMedia
                    playSize="md"
                    title={video.title}
                    thumbnailUrl={video.thumbnailUrl}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
            </Link>

            <div className="mt-2 flex flex-1 flex-col gap-1 px-1">
                <h3 className="line-clamp-2 min-h-[2lh] font-semibold text-foreground text-sm leading-snug transition-colors group-hover:text-primary dark:group-hover:text-secondary">
                    <Link href={href}>{video.title}</Link>
                </h3>

                <div className="flex items-center justify-between gap-2 py-1 text-muted-foreground text-xs">
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
            </div>
        </article>
    );
}
