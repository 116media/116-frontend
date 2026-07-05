import Link from "next/link";

import { VIDEOS_PATH } from "@/shared/presentation/constants/paths";
import type { VideoCardProps } from "./types";
import { VideoCardDate } from "./VideoCard.Date";
import { VideoCardMedia } from "./VideoCard.Media";
import { VideoCardRating } from "./VideoCard.Rating";
import { VideoCardShareCount } from "./VideoCard.ShareCount";

/**
 * Horizontal
 *
 * @description
 * Horizontal VideoCard variant — a full-width bordered row composed of a landscape thumbnail
 * on the left (with a hover play overlay) and the episode content beside it: title, star
 * rating, relative published date, and share count. Used to list a show's episodes in the
 * exclusive section. Clicking navigates to the video detail page.
 *
 * @param video - The episode to display
 */
export function Horizontal({ video }: VideoCardProps) {
    return (
        <Link
            href={`${VIDEOS_PATH}/${video.slug}`}
            className="group flex gap-3 rounded-xl border border-border p-3 transition-all hover:bg-muted/50"
        >
            <div className="relative min-h-18 w-28 shrink-0 self-stretch overflow-hidden rounded-md bg-muted sm:w-24 md:w-32 lg:w-20 xl:w-32">
                <VideoCardMedia
                    playSize="sm"
                    title={video.title}
                    thumbnailUrl={video.thumbnailUrl}
                    sizes="(max-width: 640px) 112px, (max-width: 768px) 96px, 144px"
                />
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
                <h4 className="line-clamp-2 min-h-[2lh] font-semibold text-foreground text-sm leading-tight transition-colors group-hover:text-primary sm:text-base md:text-lg lg:text-sm xl:text-base dark:group-hover:text-secondary">
                    {video.title}
                </h4>
                <div className="mt-2 flex">
                    <VideoCardRating
                        ratingAverage={video.ratingAverage}
                        ratingCount={video.ratingCount}
                    />
                </div>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2 text-muted-foreground text-xs">
                    <VideoCardShareCount shareCount={video.shareCount} />
                    <VideoCardDate
                        withIcon
                        publishedAt={video.publishedAt}
                    />
                </div>
            </div>
        </Link>
    );
}
