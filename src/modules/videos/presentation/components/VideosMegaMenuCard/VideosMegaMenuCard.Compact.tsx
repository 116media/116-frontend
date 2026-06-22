"use client";

import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ButtonFrostedPlay } from "@/shared/presentation/components/ui/Button";
import { cardVariants } from "@/shared/presentation/components/ui/Card";
import { RelativeDate } from "@/shared/presentation/components/ui/RelativeDate";
import { VIDEOS_PATH } from "@/shared/presentation/constants/paths";
import { cn } from "@/shared/presentation/utils/cn";
import type { VideosMegaMenuCardProps } from "./types";
import { VideosMegaMenuCardStats } from "./VideosMegaMenuCardStats";

/**
 * VideosMegaMenuCard.Compact
 *
 * @description
 * Compact video card for the bottom two slots. Black background thumbnail
 * filling the fixed row height, centered frosted-glass play button, bottom
 * gradient strip with title, date, rating and share count. Spinning brand
 * color border on hover via conic-gradient animation.
 */
export function Compact({ video }: VideosMegaMenuCardProps) {
    return (
        <div
            className={cn(
                cardVariants,
                "group h-full rounded-xl border-0 p-0.5 transition-all duration-300",
                "bg-border",
                "hover:[background:conic-gradient(from_var(--border-angle),var(--color-primary),var(--color-secondary),var(--color-primary))]",
                "hover:animate-[spin-border_2s_linear_infinite]"
            )}
        >
            <Link
                href={`${VIDEOS_PATH}/${video.slug}`}
                className="relative block h-full overflow-hidden rounded-[calc(var(--radius-xl)-2px)] bg-black"
            >
                <div className="relative h-full overflow-hidden">
                    {video.thumbnailUrl ? (
                        <Image
                            fill
                            alt={video.title}
                            src={video.thumbnailUrl}
                            sizes="(max-width: 1280px) 100vw, 420px"
                            className="object-cover brightness-75 transition-all duration-300 group-hover:brightness-100"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-muted" />
                    )}

                    <div className="absolute inset-0 flex items-center justify-center">
                        <ButtonFrostedPlay size="md" />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 to-transparent pt-8 pb-3 px-3">
                        <h3 className="font-bold text-white text-xs mb-1.5 line-clamp-1 group-hover:text-primary dark:group-hover:text-secondary transition-colors">
                            {video.title}
                        </h3>
                        <div className="flex items-center justify-between text-white/75">
                            {video.publishedAt && (
                                <div className="flex items-center gap-1 text-[10px]">
                                    <Calendar className="h-2.5 w-2.5" />
                                    <RelativeDate date={video.publishedAt} />
                                </div>
                            )}
                            <VideosMegaMenuCardStats
                                ratingAverage={video.ratingAverage}
                                ratingCount={video.ratingCount}
                                shareCount={video.shareCount}
                                variant="light"
                            />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
