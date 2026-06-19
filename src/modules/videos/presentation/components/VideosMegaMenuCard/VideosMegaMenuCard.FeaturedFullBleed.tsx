"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { Button, ButtonFrostedPlay } from "@/shared/presentation/components/ui/Button";
import { cardVariants } from "@/shared/presentation/components/ui/Card";
import { Tag } from "@/shared/presentation/components/ui/Tag";
import { VIDEOS_PATH } from "@/shared/presentation/constants/paths";
import { cn } from "@/shared/presentation/utils/cn";
import type { VideosMegaMenuCardProps } from "./types";
import { VideosMegaMenuCardStats } from "./VideosMegaMenuCardStats";

/**
 * VideosMegaMenuCard.FeaturedFullBleed
 *
 * @description
 * First spotlight video card. Full-bleed cover image filling the entire card
 * height with a gradient overlay. Category badge top-left (frosted glass),
 * centered frosted-glass play button, title + stats + Watch Now CTA at bottom.
 */
export function FeaturedFullBleed({ video }: VideosMegaMenuCardProps) {
    const { t } = useTranslation();

    return (
        <Link
            href={`${VIDEOS_PATH}/${video.slug}`}
            className={cn(
                cardVariants,
                "group relative flex h-full flex-col overflow-hidden rounded-xl border-0 bg-black"
            )}
        >
            {video.thumbnailUrl ? (
                <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    className="object-cover brightness-75 transition-all duration-300 group-hover:brightness-100"
                    sizes="(max-width: 1280px) 50vw, 320px"
                />
            ) : (
                <div className="absolute inset-0 bg-muted" />
            )}

            <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />

            <div className="absolute top-3 left-3">
                <Tag
                    as="span"
                    size="sm"
                    shape="rounded"
                    className="bg-white/20 backdrop-blur-md text-white border-white/20"
                >
                    {video.categoryName}
                </Tag>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
                <ButtonFrostedPlay size="lg" />
            </div>

            <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col gap-2">
                <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white group-hover:text-primary dark:group-hover:text-secondary transition-colors">
                    {video.title}
                </h3>
                <VideosMegaMenuCardStats
                    ratingAverage={video.ratingAverage}
                    ratingCount={video.ratingCount}
                    shareCount={video.shareCount}
                    variant="light"
                />
                <Button
                    size="sm"
                    className="w-full text-xs"
                >
                    <Play className="h-3 w-3 fill-current" />
                    {t("videos.home.watchNow")}
                </Button>
            </div>
        </Link>
    );
}
