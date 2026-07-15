"use client";

import { useEffect } from "react";

import type { IVideoDetailEntity } from "@/modules/videos/domain/entities/IVideoDetailEntity";
import { VideoDetail } from "@/modules/videos/presentation/components/pages/VideoDetail";
import { VideoDetailError } from "@/modules/videos/presentation/components/pages/VideoDetail/VideoDetail.Error";
import { VideoDetailLoading } from "@/modules/videos/presentation/components/pages/VideoDetail/VideoDetail.Loading";
import { useVideoDetail } from "@/modules/videos/presentation/hooks/useVideoDetail";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";

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

    // biome-ignore lint/correctness/useExhaustiveDependencies: reset scroll on each video slug change
    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [slug]);

    return (
        <StateRenderer
            data={data}
            error={isError}
            loading={isLoading}
            skeleton={<VideoDetailLoading />}
            empty={<VideoDetailError onRetry={() => refetch()} />}
            errorState={<VideoDetailError onRetry={() => refetch()} />}
            render={(video) => <VideoDetail video={video} />}
        />
    );
}
