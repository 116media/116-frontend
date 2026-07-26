"use client";

import { useTranslation } from "react-i18next";

import { SharedVideoCard } from "@/modules/videos/presentation/components/cards/SharedVideoCard";
import { FavoriteVideosGrid } from "@/modules/videos/presentation/components/sections/FavoriteVideosGrid";
import { FavoriteVideosGridLoading } from "@/modules/videos/presentation/components/sections/FavoriteVideosGrid/FavoriteVideosGrid.Loading";
import { useMySharedVideos } from "@/modules/videos/presentation/hooks/useMySharedVideos";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { FeedError } from "@/shared/presentation/components/ui/FeedError";
import { ShareIcon } from "@/shared/presentation/components/ui/Icon";
import { InfiniteScrollFooter } from "@/shared/presentation/components/ui/InfiniteScrollFooter";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";

/**
 * SharedVideosSection
 *
 * @description
 * Island for the `shared` videos collection: owns the shared-videos infinite query and
 * renders each video with its own share count, last-shared date, and channel.
 */
export function SharedVideosSection() {
    const { t } = useTranslation();

    const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useMySharedVideos(true);

    const items = data?.pages.flatMap((page) => page.items) ?? [];

    return (
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
                    context="favorites-shared-videos-empty"
                    icon={<ShareIcon className="size-10" />}
                    title={t("favorites.states.empty.sharedVideos.title")}
                    subtitle={t("favorites.states.empty.sharedVideos.body")}
                />
            }
            render={(activities) => (
                <div className="flex flex-col gap-8">
                    <FavoriteVideosGrid>
                        {activities.map((activity) => (
                            <SharedVideoCard
                                key={activity.video.id}
                                activity={activity}
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
    );
}
