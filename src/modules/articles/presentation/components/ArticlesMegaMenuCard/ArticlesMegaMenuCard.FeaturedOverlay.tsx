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
 * ArticlesMegaMenuCard.FeaturedOverlay
 *
 * @description
 * First spotlight card in the "À la une" column. Full-height cover image
 * with a deep gradient overlay. Date top-left, category badge + title +
 * headline + engagement stats overlaid at the bottom.
 */
export function FeaturedOverlay({ article }: ArticlesMegaMenuCardProps) {
    return (
        <Link
            href={`${ARTICLES_PATH}/${article.slug}`}
            className={cn(
                cardVariants,
                "group relative flex h-full flex-col overflow-hidden rounded-xl border-0"
            )}
        >
            <div className="relative flex-1 w-full">
                {article.coverImageUrl ? (
                    <Image
                        src={article.coverImageUrl}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 1280px) 50vw, 320px"
                    />
                ) : (
                    <div className="h-full w-full bg-muted" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-black/10" />

                {article.publishedAt && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 text-white/80 text-xs">
                        <CalendarIcon className="h-3 w-3" />
                        <RelativeDate date={article.publishedAt} />
                    </div>
                )}

                <div className="absolute bottom-0 inset-x-0 p-3 flex flex-col gap-1.5">
                    <Tag
                        as="span"
                        variant="primary"
                        size="sm"
                        shape="rounded"
                        className="self-start"
                    >
                        {article.categoryName}
                    </Tag>
                    <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white group-hover:text-primary dark:group-hover:text-secondary transition-colors">
                        {article.title}
                    </h3>
                    {article.headline && (
                        <p className="line-clamp-1 text-xs text-white/65">{article.headline}</p>
                    )}
                    <ArticlesMegaMenuCardStats
                        likeCount={article.likeCount}
                        shareCount={article.shareCount}
                        variant="light"
                    />
                </div>
            </div>
        </Link>
    );
}
