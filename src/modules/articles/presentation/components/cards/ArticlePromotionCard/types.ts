import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";

/**
 * ArticlePromotionCardProps
 *
 * @description
 * Shared props for all ArticlePromotionCard variants.
 *
 * @property {IArticleSummaryEntity} article - The article data to display
 */
export interface ArticlePromotionCardProps {
    article: IArticleSummaryEntity;
}

/**
 * ArticlePromotionCardStatsProps
 *
 * @description
 * Props for the shared engagement stat row rendered inside each variant's own wrapper.
 *
 * @property {IArticleSummaryEntity} article - The article whose counts are displayed
 * @property {string} [iconClassName] - Size utilities for the stat icons
 */
export interface ArticlePromotionCardStatsProps {
    article: IArticleSummaryEntity;
    iconClassName?: string;
}
