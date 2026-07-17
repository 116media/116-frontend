"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FavoriteShortCard } from "@/modules/favorites/presentation/components/cards/FavoriteShortCard";
import { FavoriteShortsGrid } from "@/modules/favorites/presentation/components/sections/FavoriteShortsGrid";
import { FavoriteShortsGridLoading } from "@/modules/favorites/presentation/components/sections/FavoriteShortsGrid/FavoriteShortsGrid.Loading";
import { useMySavedShorts } from "@/modules/shorts/presentation/hooks/useMySavedShorts";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { FeedError } from "@/shared/presentation/components/ui/FeedError";
import { BookmarkIcon } from "@/shared/presentation/components/ui/Icon";
import { InfiniteScrollFooter } from "@/shared/presentation/components/ui/InfiniteScrollFooter";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";

/**
 * SavedShortsSection
 *
 * @description
 * Island for the `saved` shorts collection: owns the saved-shorts infinite query and
 * renders each tile with its saved date and an optimistic remove that unbookmarks the
 * short and drops it from the grid.
 */
export function SavedShortsSection() {
    const { t } = useTranslation();
    const [removed, setRemoved] = useState<ReadonlySet<string>>(new Set());

    const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useMySavedShorts(true);

    const items = (data?.pages.flatMap((page) => page.items) ?? []).filter(
        (activity) => !removed.has(activity.shortVideo.id)
    );

    const onRemoved = (shortId: string) => setRemoved((current) => new Set(current).add(shortId));

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
                    context="favorites-saved-shorts-empty"
                    icon={<BookmarkIcon className="size-10" />}
                    title={t("favorites.states.empty.savedShorts.title")}
                    subtitle={t("favorites.states.empty.savedShorts.body")}
                />
            }
            render={(activities) => (
                <div className="flex flex-col gap-8">
                    <FavoriteShortsGrid>
                        {activities.map((activity) => (
                            <FavoriteShortCard
                                key={activity.shortVideo.id}
                                variant="saved"
                                activity={activity}
                                onRemoved={onRemoved}
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
