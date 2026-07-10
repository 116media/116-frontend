"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";
import { VideoCard } from "@/modules/videos/presentation/components/VideoCard";
import { SIMILAR_VIDEOS_PAGE_SIZE } from "@/modules/videos/presentation/constants/videoKeys";
import { useSimilarVideos } from "@/modules/videos/presentation/hooks/useSimilarVideos";
import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";
import { useIntersectionObserver } from "@/shared/presentation/hooks/useIntersectionObserver";

/**
 * Stable IntersectionObserver options for the infinite-scroll sentinel,
 * pre-loading the next page ~200px before it enters the viewport.
 */
const SENTINEL_OPTIONS: IntersectionObserverInit = { rootMargin: "200px 0px" };

/**
 * dedupeById
 *
 * @description
 * Flattens accumulated infinite-query pages into a single list, dropping any
 * repeated ids so a video never renders twice across page seams.
 *
 * @param pages - The query's page arrays, or undefined before the first load.
 * @returns The de-duplicated, order-preserving list of videos.
 */
function dedupeById(pages: IVideoSummaryEntity[][] | undefined): IVideoSummaryEntity[] {
    const seen = new Set<string>();
    const flat: IVideoSummaryEntity[] = [];
    for (const video of pages?.flat() ?? []) {
        if (seen.has(video.id)) continue;
        seen.add(video.id);
        flat.push(video);
    }
    return flat;
}

/**
 * SimilarCardSkeleton
 *
 * @description
 * One placeholder card matching the vertical-card footprint (16:9 block plus
 * title/meta lines), used for the first-load grid and the fetching tail.
 */
function SimilarCardSkeleton() {
    return (
        <div className="flex flex-col gap-2">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
        </div>
    );
}

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
 * The similar-videos tab panel: an infinite-scrolling grid of
 * `VideoCard.Vertical` cards (reused untouched from the feed, so thumbnail,
 * title, rating, relative date, and share count all come with them), sourced
 * from the same-category paginated published feed via the lazy
 * `useSimilarVideos` query. A sentinel at the foot of the grid requests the
 * next page as it nears the viewport, and the fetching page shows a skeleton
 * tail. While the first page loads, a grid of card skeletons holds the space;
 * a resolved empty list shows a single muted line — no boxy empty state inside
 * a tab panel.
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
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useSimilarVideos(
        categoryId,
        currentVideoId,
        enabled
    );
    const [sentinelRef, isSentinelVisible] = useIntersectionObserver(SENTINEL_OPTIONS);

    const videos = dedupeById(data?.pages);

    useEffect(() => {
        if (isSentinelVisible && hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, [isSentinelVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: SIMILAR_VIDEOS_PAGE_SIZE }, (_, index) => index).map(
                    (row) => (
                        <SimilarCardSkeleton key={`similar-skeleton-${row}`} />
                    )
                )}
            </div>
        );
    }

    if (videos.length === 0) {
        return <p className="text-muted-foreground text-sm">{t("videos.detail.similar.empty")}</p>;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {videos.map((video) => (
                    <VideoCard.Vertical
                        key={video.id}
                        video={video}
                    />
                ))}
                {isFetchingNextPage &&
                    Array.from({ length: 3 }, (_, index) => index).map((row) => (
                        <SimilarCardSkeleton key={`similar-more-${row}`} />
                    ))}
            </div>
            {hasNextPage && (
                <div
                    ref={sentinelRef}
                    aria-hidden
                    className="h-px"
                />
            )}
        </div>
    );
}
