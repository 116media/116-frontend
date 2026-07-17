"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { FavoriteShortCard } from "@/modules/favorites/presentation/components/cards/FavoriteShortCard";
import { FavoriteShortsGrid } from "@/modules/favorites/presentation/components/sections/FavoriteShortsGrid";
import { FavoriteShortsGridLoading } from "@/modules/favorites/presentation/components/sections/FavoriteShortsGrid/FavoriteShortsGrid.Loading";
import { useMyLikedShorts } from "@/modules/shorts/presentation/hooks/useMyLikedShorts";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { FeedError } from "@/shared/presentation/components/ui/FeedError";
import { HeartIcon } from "@/shared/presentation/components/ui/Icon";
import { InfiniteScrollFooter } from "@/shared/presentation/components/ui/InfiniteScrollFooter";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";
import { SHORT_DETAIL_PATH } from "@/shared/presentation/constants/paths";

/**
 * LikedShortsSection
 *
 * @description
 * Island for the `liked` shorts collection: owns the liked-shorts infinite query and
 * renders the portrait tile grid with infinite scroll and async states.
 */
export function LikedShortsSection() {
    const { t } = useTranslation();
    const router = useRouter();

    const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useMyLikedShorts(true);

    const items = data?.pages.flatMap((page) => page.items) ?? [];

    return (
        <StateRenderer
            data={items}
            error={isError}
            loading={isLoading}
            skeleton={<FavoriteShortsGridLoading />}
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
                    context="favorites-liked-shorts-empty"
                    icon={<HeartIcon className="size-10" />}
                    title={t("favorites.states.empty.likedShorts.title")}
                    subtitle={t("favorites.states.empty.likedShorts.body")}
                />
            }
            render={(activities) => (
                <div className="flex flex-col gap-8">
                    <FavoriteShortsGrid>
                        {activities.map((activity) => (
                            <FavoriteShortCard
                                key={activity.shortVideo.id}
                                variant="liked"
                                activity={activity}
                                onOpen={() =>
                                    router.push(
                                        SHORT_DETAIL_PATH.replace(":slug", activity.shortVideo.slug)
                                    )
                                }
                            />
                        ))}
                    </FavoriteShortsGrid>
                    <InfiniteScrollFooter
                        endLabel={t("favorites.states.endOfResults")}
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        onLoadMore={fetchNextPage}
                        loader={<FavoriteShortsGridLoading rows={1} />}
                    />
                </div>
            )}
        />
    );
}
