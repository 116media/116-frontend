"use client";

import { useTranslation } from "react-i18next";

import { useMyArticleBookmarks } from "@/modules/articles/presentation/hooks/useMyArticleBookmarks";
import { BookmarkedArticleCard } from "@/modules/favorites/presentation/components/cards/BookmarkedArticleCard";
import { FavoriteArticlesGrid } from "@/modules/favorites/presentation/components/sections/FavoriteArticlesGrid";
import { FavoriteArticlesGridLoading } from "@/modules/favorites/presentation/components/sections/FavoriteArticlesGrid/FavoriteArticlesGrid.Loading";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { FeedError } from "@/shared/presentation/components/ui/FeedError";
import { BookmarkIcon } from "@/shared/presentation/components/ui/Icon";
import { InfiniteScrollFooter } from "@/shared/presentation/components/ui/InfiniteScrollFooter";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";

/**
 * BookmarkedArticlesSection
 *
 * @description
 * Island for the `bookmarked` articles collection: owns the bookmarks infinite query and
 * renders each bookmark as a card whose engagement bar drives the unbookmark toggle.
 */
export function BookmarkedArticlesSection() {
    const { t } = useTranslation();

    const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useMyArticleBookmarks(true);

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
                    context="favorites-bookmarked-empty"
                    icon={<BookmarkIcon className="size-10" />}
                    title={t("favorites.states.empty.bookmarkedArticles.title")}
                    subtitle={t("favorites.states.empty.bookmarkedArticles.body")}
                />
            }
            render={(bookmarks) => (
                <div className="flex flex-col gap-8">
                    <FavoriteArticlesGrid>
                        {bookmarks.map((bookmark) => (
                            <BookmarkedArticleCard
                                key={bookmark.article.id}
                                bookmark={bookmark}
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
