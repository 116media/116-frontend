"use client";

import Image from "next/image";
import Link from "next/link";
import { cardVariants } from "@/shared/presentation/components/ui/Card";
import { CalendarIcon } from "@/shared/presentation/components/ui/Icon";
import { RelativeDate } from "@/shared/presentation/components/ui/RelativeDate";
import { Tag } from "@/shared/presentation/components/ui/Tag";
import { ARTICLES_PATH } from "@/shared/presentation/constants/paths";
import { cn } from "@/shared/presentation/utils/cn";
import { ArticlesMegaMenuCardStats } from "./ArticlesMegaMenuCardStats";
import type { ArticlesMegaMenuCardProps } from "./types";

/**
 * ArticlesMegaMenuCard.FeaturedGradient
 *
 * @description
 * Second spotlight card in the "À la une" column. Gradient background
 * (light/dark aware), header row with category badge + date, title + headline,
 * cover image in the middle growing to fill remaining height, like + share stats footer.
 */
export function FeaturedGradient({ article }: ArticlesMegaMenuCardProps) {
    return (
        <Link
            href={`${ARTICLES_PATH}/${article.slug}`}
            className={cn(
                cardVariants,
                "group relative flex h-full flex-col overflow-hidden rounded-xl border-0",
                "bg-linear-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10",
                ""
            )}
        >
            <div className="flex flex-1 flex-col min-h-0 p-3">
                <div className="flex items-center justify-between mb-2 shrink-0">
                    <Tag
                        as="span"
                        variant="primary"
                        size="sm"
                        shape="rounded"
                    >
                        {article.categoryName}
                    </Tag>
                    {article.publishedAt && (
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <CalendarIcon className="h-3 w-3" />
                            <RelativeDate date={article.publishedAt} />
                        </div>
                    )}
                </div>

                <h3 className="line-clamp-2 text-xs font-bold leading-snug mb-1.5 shrink-0 text-foreground group-hover:text-primary dark:group-hover:text-secondary transition-colors">
                    {article.title}
                </h3>

                {article.headline && (
                    <p className="line-clamp-1 text-xs text-muted-foreground leading-relaxed mb-2 shrink-0">
                        {article.headline}
                    </p>
                )}

                <div className="relative flex-1 min-h-0 w-full overflow-hidden rounded-md mb-2">
                    {article.coverImageUrl ? (
                        <Image
                            src={article.coverImageUrl}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 1280px) 50vw, 260px"
                        />
                    ) : (
                        <div className="h-full w-full bg-muted rounded-md" />
                    )}
                </div>

                <div className="shrink-0">
                    <ArticlesMegaMenuCardStats
                        likeCount={article.likeCount}
                        shareCount={article.shareCount}
                    />
                </div>
            </div>
        </Link>
    );
}
