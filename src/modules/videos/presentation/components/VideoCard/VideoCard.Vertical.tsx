import Image from "next/image";
import Link from "next/link";
import { ButtonFrostedPlay } from "@/shared/presentation/components/ui/Button";
import { ShareIcon } from "@/shared/presentation/components/ui/Icon";
import { RelativeDate } from "@/shared/presentation/components/ui/RelativeDate";
import { StarRating } from "@/shared/presentation/components/ui/StarRating";
import { VIDEOS_PATH } from "@/shared/presentation/constants/paths";
import { formatCount } from "@/shared/presentation/utils/formatCount";

import type { VideoCardProps } from "./types";

/**
 * Vertical
 *
 * @description
 * Vertical VideoCard variant — a poster-style card with a 16:9 thumbnail on
 * top (rounded, with a hover play overlay that fades a dark backdrop in and
 * zooms the image) and the video meta below: title, relative published date,
 * share count, and average rating. Sized to sit in a responsive grid (see
 * VideoFeedSection). Clicking navigates to the video detail page.
 *
 * The hover effects are scoped to this card via the `group` class, so hovering
 * one card never animates its neighbors.
 *
 * @param video - The video to display
 */
export function Vertical({ video }: VideoCardProps) {
    return (
        <Link
            href={`${VIDEOS_PATH}/${video.slug}`}
            className="group relative block transition-transform duration-300 hover:z-10 hover:scale-[1.05]"
        >
            <span
                aria-hidden
                className="pointer-events-none absolute -inset-2 -z-10 rounded-2xl bg-muted/0 transition-colors duration-300 group-hover:bg-muted/95"
            />

            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                {video.thumbnailUrl && (
                    <Image
                        fill
                        alt={video.title}
                        src={video.thumbnailUrl}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-125"
                    />
                )}

                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/40" />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <ButtonFrostedPlay size="md" />
                </div>
            </div>

            <div className="mt-2 px-1">
                <h3 className="line-clamp-2 min-h-[2lh] text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary dark:group-hover:text-secondary">
                    {video.title}
                </h3>

                <div className="flex items-center justify-between gap-2 py-1 text-xs text-muted-foreground">
                    <RelativeDate date={video.publishedAt} />
                    <span className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <ShareIcon className="size-4" />
                            {formatCount(video.shareCount)}
                        </span>
                        <StarRating
                            mode="compact"
                            ratingAverage={video.ratingAverage}
                            ratingCount={video.ratingCount}
                        />
                    </span>
                </div>
            </div>
        </Link>
    );
}
