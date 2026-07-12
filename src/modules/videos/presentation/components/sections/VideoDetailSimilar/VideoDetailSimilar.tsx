"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { VideoCard } from "@/modules/videos/presentation/components/cards/VideoCard";
import { useSimilarVideos } from "@/modules/videos/presentation/hooks/useSimilarVideos";
import { INFINITE_SCROLL_SENTINEL_OPTIONS } from "@/shared/presentation/constants/infiniteScroll";
import { useIntersectionObserver } from "@/shared/presentation/hooks/useIntersectionObserver";
import { dedupeById } from "@/shared/presentation/utils/collection/collection.utils";

import { VideoDetailSimilarLoading } from "./VideoDetailSimilar.Loading";

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
 * `VideoCard.Vertical` cards sourced from the lazy `useSimilarVideos` query,
 * with skeleton fills while loading and a muted line when the list is empty.
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
    const [sentinelRef, isSentinelVisible] = useIntersectionObserver(
        INFINITE_SCROLL_SENTINEL_OPTIONS
    );

    const videos = dedupeById(data?.pages);

    useEffect(() => {
        if (isSentinelVisible && hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, [isSentinelVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <VideoDetailSimilarLoading />
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
                {isFetchingNextPage && <VideoDetailSimilarLoading count={3} />}
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
