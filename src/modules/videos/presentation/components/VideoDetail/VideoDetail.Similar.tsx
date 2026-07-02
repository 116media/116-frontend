"use client";

import { useTranslation } from "react-i18next";

import { VideoCard } from "@/modules/videos/presentation/components/VideoCard";
import { useSimilarVideos } from "@/modules/videos/presentation/hooks/useSimilarVideos";
import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

/**
 * Props for VideoDetail.Similar.
 *
 * @interface VideoDetailSimilarProps
 * @property {string} categoryId - The open video's category, scoping the similarity query.
 * @property {string} currentVideoId - The video currently open, excluded from the grid.
 * @property {boolean} enabled - Whether the similar query may run (the tab has been opened).
 */
export interface VideoDetailSimilarProps {
    categoryId: string;
    currentVideoId: string;
    enabled: boolean;
}

/**
 * VideoDetail.Similar
 *
 * @description
 * The similar-videos tab panel: a grid of up to three `VideoCard.Vertical`
 * cards (reused untouched from the feed, so thumbnail, title, rating,
 * relative date, and share count all come with them), sourced from the
 * same-category published page via the lazy `useSimilarVideos` query. While
 * loading, three card-shaped skeletons hold the space; a resolved empty list
 * shows a single muted line — no boxy empty state inside a tab panel.
 *
 * @param categoryId - The open video's category, scoping the similarity query.
 * @param currentVideoId - The video currently open, excluded from the grid.
 * @param enabled - Whether the similar query may run.
 */
export function VideoDetailSimilar({
    categoryId,
    currentVideoId,
    enabled
}: VideoDetailSimilarProps) {
    const { t } = useTranslation();
    const { data, isLoading } = useSimilarVideos(categoryId, currentVideoId, enabled);

    if (isLoading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((card) => (
                    <div
                        key={card}
                        className="flex flex-col gap-2"
                    >
                        <Skeleton className="aspect-video w-full rounded-lg" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                    </div>
                ))}
            </div>
        );
    }

    if (!data || data.length === 0) {
        return <p className="text-muted-foreground text-sm">{t("videos.detail.similar.empty")}</p>;
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((video) => (
                <VideoCard.Vertical
                    key={video.id}
                    video={video}
                />
            ))}
        </div>
    );
}
