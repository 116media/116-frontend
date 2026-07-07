import Image from "next/image";
import Link from "next/link";
import { BadgeCheckIcon, CalendarIcon } from "@/shared/presentation/components/ui/Icon";

import { RelativeDate } from "@/shared/presentation/components/ui/RelativeDate";
import { Tag } from "@/shared/presentation/components/ui/Tag";

import { Stats } from "./ArticlePromotionCard.Stats";
import type { ArticlePromotionCardProps } from "./types";

/**
 * Pair
 *
 * @description
 * Spot 3 magazine-style variant: "116 MAGAZINE" header bar, category badge, optional
 * "COVER STORY" label for promoted articles, headline excerpt, and engagement stats,
 * linking to the article detail page.
 */
export function Pair({ article }: ArticlePromotionCardProps) {
    return (
        <Link
            href={`/articles/${article.slug}`}
            className="group relative block h-full overflow-hidden rounded-xl"
        >
            {article.coverImageUrl && (
                <Image
                    fill
                    alt={article.title}
                    src={article.coverImageUrl}
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
            )}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[5px]" />

            <div className="absolute top-0 left-0 right-0 flex h-12 items-center justify-end bg-linear-to-b from-black/60 to-transparent px-4">
                <span className="text-xs text-white/60 flex items-center gap-2">
                    <CalendarIcon className="size-3.5" />
                    <RelativeDate date={article.publishedAt} />
                </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-3 xl:p-5">
                <div className="mb-2 flex items-center gap-2 sm:mb-3 lg:mb-1.5">
                    <Tag
                        as="span"
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white"
                        prefix={<BadgeCheckIcon className="size-3" />}
                    >
                        {article.categoryName}
                    </Tag>
                </div>

                <h3 className="mb-1 text-sm font-bold leading-tight text-white line-clamp-2 sm:mb-2 sm:text-lg md:text-xl lg:text-sm xl:text-lg">
                    {article.title}
                </h3>

                <p className="mb-2 text-xs font-light text-white/70 line-clamp-2 sm:mb-4 sm:text-sm sm:line-clamp-3 md:text-base md:line-clamp-3 lg:mb-2 lg:text-xs lg:line-clamp-2 xl:text-sm xl:line-clamp-3">
                    — {article.headline}
                </p>

                <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs text-white/60 sm:justify-start sm:gap-4 sm:pt-5 md:text-sm lg:pt-2 lg:text-xs xl:pt-4">
                    <Stats
                        article={article}
                        iconClassName="size-3 sm:size-4"
                    />
                </div>
            </div>

            <div className="absolute inset-0 rounded-xl border border-white/10" />
        </Link>
    );
}
