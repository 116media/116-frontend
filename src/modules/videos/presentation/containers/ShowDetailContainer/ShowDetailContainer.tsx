"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import type { IVideoExclusiveShowEntity } from "@/modules/videos/domain/entities/IVideoExclusiveShowEntity";
import { ShowDetailHero } from "@/modules/videos/presentation/components/sections/ShowDetailHero";
import { VideosGrid } from "@/modules/videos/presentation/components/sections/VideosGrid";
import { VideosGridEmpty } from "@/modules/videos/presentation/components/sections/VideosGrid/VideosGrid.Empty";
import { VideosGridEndOfFeed } from "@/modules/videos/presentation/components/sections/VideosGrid/VideosGrid.EndOfFeed";
import { VideosGridError } from "@/modules/videos/presentation/components/sections/VideosGrid/VideosGrid.Error";
import { VideosGridLoading } from "@/modules/videos/presentation/components/sections/VideosGrid/VideosGrid.Loading";
import { useVideosFeed } from "@/modules/videos/presentation/hooks/useVideosFeed";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";
import { INFINITE_SCROLL_SENTINEL_OPTIONS } from "@/shared/presentation/constants/infiniteScroll";
import { useIntersectionObserver } from "@/shared/presentation/hooks/useIntersectionObserver";

/**
 * Props for ShowDetailContainer.
 *
 * @interface ShowDetailContainerProps
 * @property {IVideoExclusiveShowEntity} category - The server-resolved show with its
 * first page of episodes (backing the hero's watch CTA).
 */
export interface ShowDetailContainerProps {
    category: IVideoExclusiveShowEntity;
}

/**
 * ShowDetailContainer
 *
 * @description
 * Client container for the show page: the split hero above the "Episodes"
 * heading and an infinite-scrolling grid of the show's published videos,
 * driven by {@link useVideosFeed} scoped to the show's category.
 */
export function ShowDetailContainer({ category }: ShowDetailContainerProps) {
    const { t } = useTranslation();

    const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useVideosFeed({ categoryId: category.id });

    const [sentinelRef, isSentinelVisible] = useIntersectionObserver(
        INFINITE_SCROLL_SENTINEL_OPTIONS
    );

    const videos = data?.pages.flatMap((page) => page.items) ?? [];

    useEffect(() => {
        if (isSentinelVisible && hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, [isSentinelVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <div className="flex flex-col gap-8 lg:gap-12">
            <ShowDetailHero category={category} />

            <section className="flex flex-col gap-6">
                <h2
                    suppressHydrationWarning
                    className="text-xl font-bold tracking-wide text-foreground sm:text-2xl lg:text-3xl"
                >
                    {t("videos.exclusiveShow.episodes")}
                </h2>
                <StateRenderer
                    data={videos}
                    loading={isLoading}
                    error={isError}
                    skeleton={<VideosGridLoading />}
                    errorState={<VideosGridError onRetry={refetch} />}
                    empty={<VideosGridEmpty />}
                    render={(items) => (
                        <div className="flex flex-col gap-8">
                            <VideosGrid videos={items} />
                            {isFetchingNextPage && <VideosGridLoading rows={1} />}
                            {hasNextPage ? (
                                <div
                                    ref={sentinelRef}
                                    aria-hidden
                                    className="h-px"
                                />
                            ) : (
                                <VideosGridEndOfFeed />
                            )}
                        </div>
                    )}
                />
            </section>
        </div>
    );
}
