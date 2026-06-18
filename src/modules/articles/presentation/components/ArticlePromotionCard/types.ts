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
