"use client";

import type { IVideoDetailEntity } from "@/modules/videos/domain/entities/IVideoDetailEntity";
import { useVideoDetail } from "@/modules/videos/presentation/hooks/useVideoDetail";

import { VideoDetail } from "./VideoDetail";
import { VideoDetailError } from "./VideoDetail.Error";
import { VideoDetailLoading } from "./VideoDetail.Loading";

/**
 * Props for VideoDetailContainer.
 *
 * @interface VideoDetailContainerProps
 * @property {string} slug - The video slug, used as the query key and refetch target.
 * @property {IVideoDetailEntity} initialData - The server-fetched video that seeds the
 * client query so it hydrates without a refetch on mount.
 */
export interface VideoDetailContainerProps {
    slug: string;
    initialData: IVideoDetailEntity;
}

/**
 * VideoDetailContainer
 *
 * @description
 * The client container for the single-video page. Seeds {@link useVideoDetail}
 * with the server-fetched `initialData`, so the interactive shell hydrates
 * without a second network round-trip, and selects the loading / error / data
 * view. Renders {@link VideoDetail} with the resolved entity. The route
 * already gated a missing video via `notFound()`, so `initialData` is always
 * present on first paint; the loading/error branches cover client refetches
 * and cache invalidations.
 *
 * @param slug - The video slug.
 * @param initialData - The server-fetched video seeding the query.
 */
export function VideoDetailContainer({ slug, initialData }: VideoDetailContainerProps) {
    const { data, isLoading, isError, refetch } = useVideoDetail(slug, { initialData });

    if (isLoading) return <VideoDetailLoading />;
    if (isError || !data) return <VideoDetailError onRetry={() => refetch()} />;

    return <VideoDetail video={data} />;
}
