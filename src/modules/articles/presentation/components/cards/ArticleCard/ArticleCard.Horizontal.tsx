import Image from "next/image";
import Link from "next/link";

import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import { CalendarIcon } from "@/shared/presentation/components/ui/Icon";
import { RelativeDate } from "@/shared/presentation/components/ui/RelativeDate";

/**
 * Props for the ArticleCard.Horizontal component.
 *
 * @interface ArticleCardHorizontalProps
 * @property {IArticleSummaryEntity} article - The article summary to render.
 */
export interface ArticleCardHorizontalProps {
    article: IArticleSummaryEntity;
}

/**
 * ArticleCard.Horizontal
 *
 * @description
 * Compact horizontal article card matching `ArticlePromotionCard.Strip`: thumbnail plus
 * title, headline, and relative date, the whole row linking to the article. Every card is
 * the same height, since a one-line title would otherwise sit shorter than a wrapped one,
 * and a phone gets a quarter more card than the tablet and desktop columns.
 */
export function ArticleCardHorizontal({ article }: ArticleCardHorizontalProps) {
    return (
        <Link
            href={`/articles/${article.slug}`}
            className="group flex h-22.5 min-w-0 shrink-0 gap-2 sm:h-23 sm:gap-3 md:h-27 lg:h-18 lg:gap-2 xl:h-25 xl:gap-3"
        >
            <div className="relative w-35 shrink-0 self-stretch overflow-hidden rounded-md sm:w-24 md:w-32 lg:w-20 xl:w-32">
                {article.coverImageUrl && (
                    <Image
                        fill
                        alt={article.title}
                        src={article.coverImageUrl}
                        sizes="(max-width: 640px) 140px, (max-width: 768px) 96px, 144px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
                <h3 className="truncate font-semibold text-foreground text-sm transition-colors group-hover:text-primary sm:line-clamp-2 sm:whitespace-normal sm:text-base md:line-clamp-2 md:text-lg lg:line-clamp-1 lg:text-sm xl:line-clamp-2 xl:text-base dark:group-hover:text-secondary">
                    {article.title}
                </h3>
                <p className="mt-0.5 line-clamp-1 text-muted-foreground text-xs sm:mt-1 sm:line-clamp-2 sm:text-sm md:text-base lg:line-clamp-1 lg:text-xs xl:text-sm">
                    {article.headline}
                </p>
                <span className="mt-auto mb-1 flex items-center gap-1.5 text-muted-foreground text-xs sm:mb-2 sm:gap-2 md:text-sm">
                    <CalendarIcon className="size-3 sm:size-3.5" />
                    <RelativeDate date={article.publishedAt} />
                </span>
            </div>
        </Link>
    );
}
