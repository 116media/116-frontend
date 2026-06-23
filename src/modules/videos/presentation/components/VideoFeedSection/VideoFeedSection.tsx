"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { VideoCard } from "@/modules/videos/presentation/components/VideoCard";

import type { VideoFeedSectionViewProps } from "./types";

/**
 * VideoFeedSection
 *
 * @description
 * Presentation component for a homepage video feed section — a pinned category
 * rendered as a heading row (title on the left, a "view all" link on the right)
 * above a fully responsive grid of vertical video cards (1 column on mobile,
 * 2 on small screens, 4 from large up). The "view all" label reads from the
 * i18n context so it follows the active language live; suppressHydrationWarning
 * guards the streamed-in language swap.
 *
 * @param title - Section heading shown at the top-left
 * @param viewAllHref - Destination of the "view all" link at the top-right
 * @param videos - The videos rendered in the grid
 */
export function VideoFeedSection({ title, viewAllHref, videos }: VideoFeedSectionViewProps) {
    const { t } = useTranslation();

    return (
        <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg uppercase font-bold text-foreground sm:text-xl">{title}</h2>
                <Link
                    href={viewAllHref}
                    className="shrink-0 text-sm text-primary transition-colors hover:underline dark:text-secondary"
                    suppressHydrationWarning
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
