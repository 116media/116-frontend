"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button, ButtonFrostedPlay } from "@/shared/presentation/components/ui/Button";
import { Tag } from "@/shared/presentation/components/ui/Tag";
import { VIDEOS_PATH } from "@/shared/presentation/constants/paths";
import { cn } from "@/shared/presentation/utils/cn";
import type { VideosMegaMenuCardProps } from "./types";
import { VideosMegaMenuCardStats } from "./VideosMegaMenuCardStats";

/**
 * VideosMegaMenuCard.FeaturedSpotlight
 *
 * @description
 * Second spotlight video card. Gradient background (light/dark aware),
 * category badge + title at the top, widescreen preview banner with
 * frosted-glass play button in the middle, star rating + share count,
 * and a full-width outlined Watch Now CTA.
 */
export function FeaturedSpotlight({ video }: VideosMegaMenuCardProps) {
    return (
        <Link
            href={`${VIDEOS_PATH}/${video.slug}`}
            className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-xl",
                "bg-linear-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10",
                "p-3"
            )}
        >
            <div className="flex flex-col gap-1 mb-2 shrink-0">
                <Tag
                    as="span"
                    variant="primary"
                    size="sm"
                    shape="rounded"
                    className="self-start"
                >
                    {video.categoryName}
                </Tag>
                <h3 className="line-clamp-2 text-xs font-bold leading-snug text-foreground group-hover:text-primary dark:group-hover:text-secondary transition-colors">
                    {video.title}
                </h3>
            </div>

            <div className="relative w-full flex-1 min-h-0 overflow-hidden rounded-md mb-2">
                {video.thumbnailUrl ? (
                    <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        fill
                        className="object-cover brightness-75 transition-all duration-300 group-hover:brightness-90"
                        sizes="(max-width: 1280px) 50vw, 260px"
                    />
                ) : (
                    <div className="absolute inset-0 bg-muted" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                    <ButtonFrostedPlay size="sm" />
                </div>
            </div>

            <div className="flex items-center justify-between mb-2 shrink-0">
                <VideosMegaMenuCardStats
                    ratingAverage={video.ratingAverage}
                    ratingCount={video.ratingCount}
                    shareCount={video.shareCount}
                />
            </div>

            <div className="shrink-0">
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs text-primary dark:text-secondary border-primary/30 dark:border-secondary/30 hover:bg-primary/10 hover:text-primary dark:hover:bg-secondary/10 dark:hover:text-secondary dark:hover:border-secondary"
                >
                    <Play className="h-3.5 w-3.5 fill-primary dark:fill-secondary" />
                    Watch Now
                </Button>
            </div>
        </Link>
    );
}
