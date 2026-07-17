"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { FavoriteShortCard } from "@/modules/favorites/presentation/components/cards/FavoriteShortCard";
import { FavoriteShortsGrid } from "@/modules/favorites/presentation/components/sections/FavoriteShortsGrid";
import { FavoriteShortsGridLoading } from "@/modules/favorites/presentation/components/sections/FavoriteShortsGrid/FavoriteShortsGrid.Loading";
import { useMySharedShorts } from "@/modules/shorts/presentation/hooks/useMySharedShorts";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { FeedError } from "@/shared/presentation/components/ui/FeedError";
import { ShareIcon } from "@/shared/presentation/components/ui/Icon";
import { InfiniteScrollFooter } from "@/shared/presentation/components/ui/InfiniteScrollFooter";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";
import { SHORT_DETAIL_PATH } from "@/shared/presentation/constants/paths";

/**
 * SharedShortsSection
 *
 * @description
 * Island for the `shared` shorts collection: owns the shared-shorts infinite query and
 * renders each tile with the caller's own share count and latest share date.
 */
export function SharedShortsSection() {
    const { t } = useTranslation();
    const router = useRouter();

    const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useMySharedShorts(true);

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
                    context="favorites-shared-shorts-empty"
                    icon={<ShareIcon className="size-10" />}
                    title={t("favorites.states.empty.sharedShorts.title")}
                    subtitle={t("favorites.states.empty.sharedShorts.body")}
                />
            }
            render={(activities) => (
                <div className="flex flex-col gap-8">
                    <FavoriteShortsGrid>
                        {activities.map((activity) => (
                            <FavoriteShortCard
                                key={activity.shortVideo.id}
                                variant="shared"
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
