"use client";

import type { IVideoDetailEntity } from "@/modules/videos/domain/entities/IVideoDetailEntity";
import { VideoDetail } from "@/modules/videos/presentation/components/pages/VideoDetail";
import { VideoDetailError } from "@/modules/videos/presentation/components/pages/VideoDetail/VideoDetail.Error";
import { VideoDetailLoading } from "@/modules/videos/presentation/components/pages/VideoDetail/VideoDetail.Loading";
import { useVideoDetail } from "@/modules/videos/presentation/hooks/useVideoDetail";

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
 * Client container for the single-video page. Seeds {@link useVideoDetail}
 * with the server-fetched `initialData` so hydration avoids a refetch, and
 * selects the loading / error / data view.
 */
export function VideoDetailContainer({ slug, initialData }: VideoDetailContainerProps) {
    const { data, isLoading, isError, refetch } = useVideoDetail(slug, { initialData });

    if (isLoading) return <VideoDetailLoading />;
    if (isError || !data) return <VideoDetailError onRetry={() => refetch()} />;

    return <VideoDetail video={data} />;
}
