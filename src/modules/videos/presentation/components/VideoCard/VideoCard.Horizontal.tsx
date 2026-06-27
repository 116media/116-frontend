import { Clock, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ButtonFrostedPlay } from "@/shared/presentation/components/ui/Button";
import { RelativeDate } from "@/shared/presentation/components/ui/RelativeDate";
import { StarRating } from "@/shared/presentation/components/ui/StarRating";
import { VIDEOS_PATH } from "@/shared/presentation/constants/paths";
import { formatCount } from "@/shared/presentation/utils/formatCount";
import type { VideoCardProps } from "./types";

/**
 * Horizontal
 *
 * @description
 * Horizontal VideoCard variant — a full-width bordered row composed of a
 * landscape thumbnail on the left (with a hover play overlay) and the episode
 * content beside it: title, star rating, relative published date, and share
 * count. Used to list a show's episodes in the exclusive section. Clicking
 * navigates to the video detail page.
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
                {video.thumbnailUrl && (
                    <Image
                        fill
                        alt={video.title}
                        src={video.thumbnailUrl}
                        sizes="(max-width: 640px) 112px, (max-width: 768px) 96px, 144px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <ButtonFrostedPlay size="sm" />
                </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
                <h4 className="line-clamp-2 min-h-[2lh] text-sm font-semibold leading-tight text-foreground transition-colors group-hover:text-primary dark:group-hover:text-secondary sm:text-base md:text-lg lg:text-sm xl:text-base">
                    {video.title}
                </h4>
                <div className="mt-2 flex">
                    <StarRating
                        ratingCount={video.ratingCount}
                        ratingAverage={video.ratingAverage}
                    />
                </div>
                <div className="mt-auto flex flex-wrap justify-between items-center gap-2 pt-2 text-muted-foreground">
                    <span className="flex items-center gap-1 text-sm">
                        <Share2 className="size-3" />
                        {formatCount(video.shareCount)}
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                        <Clock className="size-3" />
                        <RelativeDate date={video.publishedAt} />
                    </span>
                </div>
            </div>
        </Link>
    );
}
