"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { ICommentedArticleEntity } from "@/modules/articles/domain/entities/ICommentedArticleEntity";
import { useMyCommentedArticles } from "@/modules/articles/presentation/hooks/useMyCommentedArticles";
import { CommentedArticleCard } from "@/modules/favorites/presentation/components/cards/CommentedArticleCard";
import { MyArticleCommentsDrawer } from "@/modules/favorites/presentation/components/modals/MyArticleCommentsDrawer";
import { FavoriteArticlesGrid } from "@/modules/favorites/presentation/components/sections/FavoriteArticlesGrid";
import { FavoriteArticlesGridLoading } from "@/modules/favorites/presentation/components/sections/FavoriteArticlesGrid/FavoriteArticlesGrid.Loading";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { FeedError } from "@/shared/presentation/components/ui/FeedError";
import { MessageSquareIcon } from "@/shared/presentation/components/ui/Icon";
import { InfiniteScrollFooter } from "@/shared/presentation/components/ui/InfiniteScrollFooter";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";

/**
 * CommentedArticlesSection
 *
 * @description
 * Island for the `commented` articles collection: owns the commented-articles infinite
 * query plus the local own-comments drawer state, opening the drawer for whichever card
 * the reader taps "view comments" on.
 */
export function CommentedArticlesSection() {
    const { t } = useTranslation();
    const [selected, setSelected] = useState<ICommentedArticleEntity | null>(null);

    const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useMyCommentedArticles(true);

    const items = data?.pages.flatMap((page) => page.items) ?? [];

    return (
        <>
            <StateRenderer
                data={items}
                error={isError}
                loading={isLoading}
                skeleton={<FavoriteArticlesGridLoading />}
                errorState={
                    <FeedError
                        onRetry={refetch}
                        context="favorites-feed-error"
                        title={t("favorites.states.error")}
                        retryLabel={t("favorites.states.retry")}
                    />
                }
                empty={
                    <EmptyState
                        context="favorites-commented-empty"
                        icon={<MessageSquareIcon className="size-10" />}
                        title={t("favorites.states.empty.commentedArticles.title")}
                        subtitle={t("favorites.states.empty.commentedArticles.body")}
                    />
                }
                render={(commented) => (
                    <div className="flex flex-col gap-8">
                        <FavoriteArticlesGrid>
                            {commented.map((item) => (
                                <CommentedArticleCard
                                    item={item}
                                    key={item.article.id}
                                    onViewComments={() => setSelected(item)}
                                />
                            ))}
                        </FavoriteArticlesGrid>
                        <InfiniteScrollFooter
                            hasNextPage={hasNextPage}
                            onLoadMore={fetchNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                            endLabel={t("favorites.states.endOfResults")}
                            loader={<FavoriteArticlesGridLoading rows={1} />}
                        />
                    </div>
                )}
            />

            {selected && (
                <MyArticleCommentsDrawer
                    open={selected !== null}
                    articleId={selected.article.id}
                    articleSlug={selected.article.slug}
                    onOpenChange={(next) => !next && setSelected(null)}
                />
            )}
        </>
    );
}
