"use client";

import Link from "next/link";

import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";

import { ArticleCardAuthor } from "./ArticleCard.Author";
import { ArticleCardDate } from "./ArticleCard.Date";
import { ArticleCardEngagement } from "./ArticleCard.Engagement";
import { ArticleCardMedia } from "./ArticleCard.Media";
import { ArticleCardMeta } from "./ArticleCard.Meta";

/**
 * Props for the ArticleCard.Feed component.
 *
 * @interface ArticleCardFeedProps
 * @property {IArticleSummaryEntity} article - The article summary to render.
 */
export interface ArticleCardFeedProps {
    article: IArticleSummaryEntity;
}

/**
 * ArticleCard.Feed
 *
 * @description
 * Magazine-style article card for the feed grid: cover, byline, meta row, title, headline,
 * and a bottom-anchored engagement bar composed from the ArticleCard parts.
 */
export function ArticleCardFeed({ article }: ArticleCardFeedProps) {
    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-xl border bg-background">
            <ArticleCardMedia
                slug={article.slug}
                title={article.title}
                coverImageUrl={article.coverImageUrl}
            />
            <div className="flex flex-1 flex-col p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                    <ArticleCardAuthor author={article.author} />
                    <ArticleCardDate publishedAt={article.publishedAt} />
                </div>
                <ArticleCardMeta
                    categoryName={article.categoryName}
                    readTimeInMinutes={article.readTimeInMinutes}
                />
                <h3 className="mb-3 line-clamp-2 font-bold text-md transition-colors group-hover:text-primary dark:group-hover:text-secondary">
                    <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                </h3>
                <p className="mb-4 line-clamp-2 text-muted-foreground text-sm">
                    {article.headline}
                </p>
                <div className="mt-auto">
                    <ArticleCardEngagement
                        articleId={article.id}
                        slug={article.slug}
                        likeCount={article.likeCount}
                        commentCount={article.commentCount}
                        bookmarkCount={article.bookmarkCount}
                    />
                </div>
            </div>
        </article>
    );
}
