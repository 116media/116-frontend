"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { RatedVideoCard } from "@/modules/favorites/presentation/components/cards/RatedVideoCard";
import { FavoriteVideosGrid } from "@/modules/favorites/presentation/components/sections/FavoriteVideosGrid";
import { FavoriteVideosGridLoading } from "@/modules/favorites/presentation/components/sections/FavoriteVideosGrid/FavoriteVideosGrid.Loading";
import type { IVideoActivityEntity } from "@/modules/videos/domain/entities/IVideoActivityEntity";
import { VideoRatingModal } from "@/modules/videos/presentation/components/modals/VideoRatingModal";
import { useMyRatedVideos } from "@/modules/videos/presentation/hooks/useMyRatedVideos";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { FeedError } from "@/shared/presentation/components/ui/FeedError";
import { StarIcon } from "@/shared/presentation/components/ui/Icon";
import { InfiniteScrollFooter } from "@/shared/presentation/components/ui/InfiniteScrollFooter";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";

/**
 * RatedVideosSection
 *
 * @description
 * Island for the `rated` videos collection: owns the rated-videos infinite query and
 * renders each video with the caller's own rating and a "rate again" action that reopens
 * the rating modal seeded with their prior stars.
 */
export function RatedVideosSection() {
    const { t } = useTranslation();
    const [target, setTarget] = useState<IVideoActivityEntity | null>(null);

    const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useMyRatedVideos(true);

    const items = data?.pages.flatMap((page) => page.items) ?? [];

    return (
        <>
            <StateRenderer
                data={items}
                error={isError}
                loading={isLoading}
                skeleton={<FavoriteVideosGridLoading />}
                errorState={
                    <FeedError
                        onRetry={refetch}
                        title={t("favorites.states.error")}
                        retryLabel={t("favorites.states.retry")}
                        context="favorites-feed-error"
                    />
                }
                empty={
                    <EmptyState
                        context="favorites-rated-empty"
                        icon={<StarIcon className="size-10" />}
                        title={t("favorites.states.empty.ratedVideos.title")}
                        subtitle={t("favorites.states.empty.ratedVideos.body")}
                    />
                }
                render={(activities) => (
                    <div className="flex flex-col gap-8">
                        <FavoriteVideosGrid>
                            {activities.map((activity) => (
                                <RatedVideoCard
                                    key={activity.video.id}
                                    activity={activity}
                                    onRateAgain={() => setTarget(activity)}
                                />
                            ))}
                        </FavoriteVideosGrid>
                        <InfiniteScrollFooter
                            endLabel={t("favorites.states.endOfResults")}
                            hasNextPage={hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                            onLoadMore={fetchNextPage}
                            loader={<FavoriteVideosGridLoading rows={1} />}
                        />
                    </div>
                )}
            />

            {target && (
                <VideoRatingModal
                    open={target !== null}
                    onOpenChange={(next) => !next && setTarget(null)}
                    videoId={target.video.id}
                    slug={target.video.slug}
                    initialStars={target.ratedStars ?? null}
                />
            )}
        </>
    );
}
