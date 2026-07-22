"use client";

import type { ReactNode } from "react";

import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import { ArticleCardAuthor } from "@/modules/articles/presentation/components/cards/ArticleCard/ArticleCard.Author";
import { ArticleCardDate } from "@/modules/articles/presentation/components/cards/ArticleCard/ArticleCard.Date";
import { ArticleCardEngagement } from "@/modules/articles/presentation/components/cards/ArticleCard/ArticleCard.Engagement";
import { ArticleCardMeta } from "@/modules/articles/presentation/components/cards/ArticleCard/ArticleCard.Meta";
import { FavoriteCard } from "@/modules/favorites/presentation/components/cards/FavoriteCard";
import { ARTICLE_DETAIL_PATH } from "@/shared/presentation/constants/paths";

/**
 * Props for FavoriteArticleContent.
 *
 * @interface FavoriteArticleContentProps
 * @property {IArticleSummaryEntity} article - The article summary rendered as the card body.
 * @property {ReactNode} [children] - Favorites-specific slot rendered after the engagement bar.
 */
export interface FavoriteArticleContentProps {
    article: IArticleSummaryEntity;
    children?: ReactNode;
}

/**
 * FavoriteArticleContent
 *
 * @description
 * The shared article body for every favorites article tile: byline, category/read-time
 * meta, title, headline, and the engagement bar composed from the base ArticleCard parts,
 * followed by an optional favorites slot (activity meta, comment, actions).
 */
export function FavoriteArticleContent({ article, children }: FavoriteArticleContentProps) {
    const href = ARTICLE_DETAIL_PATH.replace(":slug", article.slug);

    return (
        <FavoriteCard.Body>
            <div>
                <div className="mb-3 flex items-center justify-between gap-2">
                    <ArticleCardAuthor author={article.author} />
                    <ArticleCardDate publishedAt={article.publishedAt} />
                </div>
                <ArticleCardMeta
                    categoryName={article.categoryName}
                    readTimeInMinutes={article.readTimeInMinutes}
                />
                <div className="flex flex-col gap-1">
                    <FavoriteCard.Title href={href}>{article.title}</FavoriteCard.Title>
                    <p className="line-clamp-2 text-muted-foreground text-sm">{article.headline}</p>
                </div>
            </div>

            <ArticleCardEngagement
                slug={article.slug}
                articleId={article.id}
                likeCount={article.likeCount}
                commentCount={article.commentCount}
                bookmarkCount={article.bookmarkCount}
            />

            {children}
        </FavoriteCard.Body>
    );
}
