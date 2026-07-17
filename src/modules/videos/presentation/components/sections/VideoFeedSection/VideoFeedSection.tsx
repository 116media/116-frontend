"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { VideoCard } from "@/modules/videos/presentation/components/cards/VideoCard";

import type { VideoFeedSectionViewProps } from "./types";

/**
 * VideoFeedSection
 *
 * @description
 * Presentation component for a homepage video feed section — a pinned category
 * rendered as a heading row with a "view all" link above a responsive grid of
 * vertical video cards. suppressHydrationWarning guards the streamed-in label.
 */
export function VideoFeedSection({ title, viewAllHref, videos }: VideoFeedSectionViewProps) {
    const { t } = useTranslation();

    return (
        <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg uppercase font-bold text-foreground sm:text-xl">{title}</h2>
                <Link
                    href={viewAllHref}
                    suppressHydrationWarning
                    className="shrink-0 text-sm text-primary transition-colors hover:underline dark:text-secondary"
                >
                    {t("general.viewAll")} →
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                {videos.map((video) => (
                    <VideoCard.Vertical
                        video={video}
                        key={video.id}
                    />
                ))}
            </div>
        </section>
    );
}
