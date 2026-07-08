import Link from "next/link";

import { VIDEOS_PATH } from "@/shared/presentation/constants/paths";
import type { VideoCardProps } from "./types";
import { VideoCardDate } from "./VideoCard.Date";
import { VideoCardMedia } from "./VideoCard.Media";
import { VideoCardRating } from "./VideoCard.Rating";
import { VideoCardShareCount } from "./VideoCard.ShareCount";

/**
 * Vertical
 *
 * @description
 * Vertical VideoCard variant — a poster-style card with a 16:9 thumbnail above the video
 * meta. Sized for a responsive grid (see VideoFeedSection); clicking navigates to the video
 * detail page. Hover effects are scoped per card via the `group` class.
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
                <VideoCardMedia
                    playSize="md"
                    title={video.title}
                    thumbnailUrl={video.thumbnailUrl}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
            </div>

            <div className="mt-2 px-1">
                <h3 className="line-clamp-2 min-h-[2lh] font-semibold text-foreground text-sm leading-snug transition-colors group-hover:text-primary dark:group-hover:text-secondary">
                    {video.title}
                </h3>

                <div className="flex items-center justify-between gap-2 py-1 text-muted-foreground text-xs">
                    <VideoCardDate publishedAt={video.publishedAt} />
                    <span className="flex items-center gap-4">
                        <VideoCardShareCount shareCount={video.shareCount} />
                        <VideoCardRating
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
