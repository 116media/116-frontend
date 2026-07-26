import Link from "next/link";

import { Tag } from "@/shared/presentation/components/ui/Tag";
import { VIDEOS_PATH } from "@/shared/presentation/constants/paths";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import type { VideoCardHorizontalProps } from "./types";
import { VideoCardDate } from "./VideoCard.Date";
import { VideoCardMedia } from "./VideoCard.Media";
import { VideoCardRating } from "./VideoCard.Rating";
import { VideoCardShareCount } from "./VideoCard.ShareCount";

/**
 * Horizontal
 *
 * @description
 * Bordered video row with linked media and title, optional metadata, and a trailing-action
 * slot outside both links.
 */
export function Horizontal({
    video,
    className,
    showCategory = false,
    trailingAction
}: VideoCardHorizontalProps) {
    const href = `${VIDEOS_PATH}/${video.slug}`;
    const hasShareCount = typeof video.shareCount === "number";
    const hasFooterMeta = hasShareCount || Boolean(video.publishedAt);

    return (
        <article
            className={cn(
                "group flex gap-3 rounded-xl border p-3 transition-all hover:bg-muted/50",
                className
            )}
        >
            <Link
                href={href}
                aria-label={video.title}
                className="relative min-h-18 w-28 shrink-0 self-stretch overflow-hidden rounded-md bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-24 md:w-32 lg:w-20 xl:w-32"
            >
                <VideoCardMedia
                    playSize="sm"
                    title={video.title}
                    thumbnailUrl={video.thumbnailUrl ?? null}
                    sizes="(max-width: 640px) 112px, (max-width: 768px) 96px, 144px"
                />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start gap-2">
                    <h4 className="line-clamp-2 min-h-[2lh] min-w-0 flex-1 font-semibold text-sm leading-tight sm:text-base md:text-lg lg:text-sm xl:text-base">
                        <Link
                            href={href}
                            className="text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:hover:text-secondary"
                        >
                            {video.title}
                        </Link>
                    </h4>
                    {trailingAction && <div className="shrink-0 self-start">{trailingAction}</div>}
                </div>
                {showCategory && video.categoryName && (
                    <Tag
                        as="span"
                        size="sm"
                        variant="outline"
                        className="w-fit cursor-default"
                    >
                        {video.categoryName}
                    </Tag>
                )}
                <div className="mt-2 flex">
                    <VideoCardRating
                        ratingAverage={video.ratingAverage}
                        ratingCount={video.ratingCount}
                    />
                </div>
                {hasFooterMeta && (
                    <div
                        className={cn(
                            "mt-auto flex flex-wrap items-center justify-between gap-2 pt-2 text-muted-foreground text-xs",
                            !hasShareCount && "justify-end"
                        )}
                    >
                        {hasShareCount && (
                            <VideoCardShareCount shareCount={video.shareCount ?? 0} />
                        )}
                        {video.publishedAt && (
                            <VideoCardDate
                                withIcon
                                publishedAt={video.publishedAt}
                            />
                        )}
                    </div>
                )}
            </div>
        </article>
    );
}
