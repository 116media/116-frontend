import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";

/**
 * ArticlesMegaMenuCardProps
 *
 * @description
 * Shared props for both ArticlesMegaMenuCard.Featured and
 * ArticlesMegaMenuCard.Compact sub-components.
 */
export interface ArticlesMegaMenuCardProps {
    article: IArticleSummaryEntity;
}

/**
 * ArticlesMegaMenuCardStatsProps
 *
 * @description
 * Props for the engagement stats row rendered at the bottom of the card variants.
 *
 * @property {number} likeCount - Like count shown in the row.
 * @property {number} shareCount - Share count shown in the row.
 * @property {"light" | "default"} [variant] - "light" for text overlaid on dark images,
 * "default" for surface cards.
 */
export interface ArticlesMegaMenuCardStatsProps {
    likeCount: number;
    shareCount: number;
    variant?: "light" | "default";
}
