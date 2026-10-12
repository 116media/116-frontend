"use client";

import { VideoCard } from "@/modules/videos/presentation/components/cards/VideoCard";
import { FeedHeading } from "@/shared/presentation/components/ui/FeedHeading";

import type { VideoFeedSectionViewProps } from "./types";

/**
 * VideoFeedSection
 *
 * @description
 * Presentation component for a homepage video feed section — a pinned category
 * rendered as a shared heading row above a responsive grid of vertical video cards.
 */
export function VideoFeedSection({ title, viewAllHref, videos }: VideoFeedSectionViewProps) {
    return (
        <section className="flex flex-col gap-4">
            <FeedHeading
                title={title}
                actionHref={viewAllHref}
            />

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
