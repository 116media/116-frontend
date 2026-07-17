"use client";

import { useTranslation } from "react-i18next";

import { useMySharedArticles } from "@/modules/articles/presentation/hooks/useMySharedArticles";
import { SharedArticleCard } from "@/modules/favorites/presentation/components/cards/SharedArticleCard";
import { FavoriteArticlesGrid } from "@/modules/favorites/presentation/components/sections/FavoriteArticlesGrid";
import { FavoriteArticlesGridLoading } from "@/modules/favorites/presentation/components/sections/FavoriteArticlesGrid/FavoriteArticlesGrid.Loading";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { FeedError } from "@/shared/presentation/components/ui/FeedError";
import { ShareIcon } from "@/shared/presentation/components/ui/Icon";
import { InfiniteScrollFooter } from "@/shared/presentation/components/ui/InfiniteScrollFooter";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";

/**
 * SharedArticlesSection
 *
 * @description
 * Island for the `shared` articles collection: owns the shared-articles infinite query and
 * renders each article as a feed card with its own share count, last-shared date, and
 * channel.
 */
export function SharedArticlesSection() {
    const { t } = useTranslation();

    const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useMySharedArticles(true);

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
                    context="favorites-shared-articles-empty"
                    icon={<ShareIcon className="size-10" />}
                    title={t("favorites.states.empty.sharedArticles.title")}
                    subtitle={t("favorites.states.empty.sharedArticles.body")}
                />
            }
            render={(activities) => (
                <div className="flex flex-col gap-8">
                    <FavoriteArticlesGrid>
                        {activities.map((activity) => (
                            <SharedArticleCard
                                key={activity.article.id}
                                activity={activity}
                            />
                        ))}
                    </FavoriteArticlesGrid>
                    <InfiniteScrollFooter
                        endLabel={t("favorites.states.endOfResults")}
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        onLoadMore={fetchNextPage}
                        loader={<FavoriteArticlesGridLoading rows={1} />}
                    />
                </div>
            )}
        />
    );
}
