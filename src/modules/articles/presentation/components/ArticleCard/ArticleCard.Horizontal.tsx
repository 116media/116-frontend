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
 * Compact horizontal article card, visually identical to the homepage gossip strip card
 * (`ArticlePromotionCard.Strip`): a left thumbnail that gently zooms on hover, and a right
 * column with a title that tints on hover, the headline, and the relative published date
 * with a calendar icon in the bottom-left. The whole row links to the article. Used in the
 * article detail page's popular-articles sidebar. All colors are theme tokens.
 *
 * @param article - The article summary to render.
 */
export function ArticleCardHorizontal({ article }: ArticleCardHorizontalProps) {
    return (
        <Link
            href={`/articles/${article.slug}`}
            className="group flex min-w-0 flex-1 gap-2 sm:gap-3 lg:gap-2 xl:gap-3"
        >
            <div className="relative min-h-18 w-28 shrink-0 self-stretch overflow-hidden rounded-md sm:w-24 md:w-32 lg:w-20 xl:w-32">
                {article.coverImageUrl && (
                    <Image
                        fill
                        alt={article.title}
                        src={article.coverImageUrl}
                        sizes="(max-width: 640px) 112px, (max-width: 768px) 96px, 144px"
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
