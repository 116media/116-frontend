"use client";

import { useTranslation } from "react-i18next";

import { useMyLikedArticles } from "@/modules/articles/presentation/hooks/useMyLikedArticles";
import { LikedArticleCard } from "@/modules/favorites/presentation/components/cards/LikedArticleCard";
import { FavoriteArticlesGrid } from "@/modules/favorites/presentation/components/sections/FavoriteArticlesGrid";
import { FavoriteArticlesGridLoading } from "@/modules/favorites/presentation/components/sections/FavoriteArticlesGrid/FavoriteArticlesGrid.Loading";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { FeedError } from "@/shared/presentation/components/ui/FeedError";
import { HeartIcon } from "@/shared/presentation/components/ui/Icon";
import { InfiniteScrollFooter } from "@/shared/presentation/components/ui/InfiniteScrollFooter";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";

/**
 * LikedArticlesSection
 *
 * @description
 * Island for the `liked` articles collection: owns the liked-articles infinite query and
 * drives it into the shared article grid with infinite scroll and async states.
 */
export function LikedArticlesSection() {
    const { t } = useTranslation();

    const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useMyLikedArticles(true);

    const items = data?.pages.flatMap((page) => page.items) ?? [];

    return (
        <StateRenderer
            data={items}
            error={isError}
            loading={isLoading}
            skeleton={<FavoriteArticlesGridLoading />}
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
                    context="favorites-liked-articles-empty"
                    icon={<HeartIcon className="size-10" />}
                    title={t("favorites.states.empty.likedArticles.title")}
                    subtitle={t("favorites.states.empty.likedArticles.body")}
                />
            }
            render={(activities) => (
                <div className="flex flex-col gap-8">
                    <FavoriteArticlesGrid>
                        {activities.map((activity) => (
                            <LikedArticleCard
                                key={activity.article.id}
                                activity={activity}
                            />
                        ))}
                    </FavoriteArticlesGrid>
                    <InfiniteScrollFooter
                        endLabel={t("favorites.states.endOfResults")}
                        hasNextPage={hasNextPage}
                        onLoadMore={fetchNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        loader={<FavoriteArticlesGridLoading rows={1} />}
                    />
                </div>
            )}
        />
    );
}
