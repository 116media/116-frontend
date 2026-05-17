"use client";

import { Clock } from "lucide-react";
import Link from "next/link";

import { cardVariants } from "@/shared/presentation/components/ui/Card";
import { Tag } from "@/shared/presentation/components/ui/Tag";
import { ARTICLES_PATH } from "@/shared/presentation/constants/paths";
import { cn } from "@/shared/presentation/utils/cn";
import { formatRelativeDate } from "@/shared/presentation/utils/formatRelativeDate";
import { ArticlesMegaMenuCardStats } from "./ArticlesMegaMenuCardStats";
import type { ArticlesMegaMenuCardProps } from "./types";

/**
 * ArticlesMegaMenuCard.Compact
 *
 * @description
 * Compact news card for the bottom two slots in the "À la une" column.
 * No cover image. Border card with subtle shadow, category badge + clock date
 * header, title, headline excerpt, like + share footer.
 */
export function Compact({ article }: ArticlesMegaMenuCardProps) {
    const relativeDate = formatRelativeDate(article.publishedAt);

    return (
        <Link
            href={`${ARTICLES_PATH}/${article.slug}`}
            className={cn(cardVariants, "group flex h-full flex-col overflow-hidden rounded-md")}
        >
            <div className="flex flex-1 flex-col p-3 overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                    <Tag
                        as="span"
                        variant="primary"
                        size="sm"
                        shape="rounded"
                    >
                        {article.categoryName}
                    </Tag>
                    {relativeDate && (
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{relativeDate}</span>
                        </div>
                    )}
                </div>

                <h3 className="line-clamp-2 text-sm font-bold leading-snug mb-1 text-foreground group-hover:text-primary dark:group-hover:text-secondary transition-colors">
                    {article.title}
                </h3>

                {article.headline && (
                    <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed mb-2">
                        {article.headline}
                    </p>
                )}

                <div className="mt-auto">
                    <ArticlesMegaMenuCardStats
                        likeCount={article.likeCount}
                        shareCount={article.shareCount}
                    />
                </div>
            </div>
        </Link>
    );
}
