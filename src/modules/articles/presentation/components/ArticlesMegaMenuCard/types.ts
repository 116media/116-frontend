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
 * ArticlesMegaMenuCardImageProps
 *
 * @description
 * Props for the shared image piece used inside both card variants.
 * The size prop controls the rendered dimensions — "full" for Featured
 * (full-width aspect-video) and "thumb" for Compact (fixed small thumbnail).
 */
export interface ArticlesMegaMenuCardImageProps {
    src: string | null;
    alt: string;
    categoryName: string;
    size: "full" | "thumb";
}

/**
 * ArticlesMegaMenuCardBodyProps
 *
 * @description
 * Props for the shared text content piece used inside both card variants.
 */
export interface ArticlesMegaMenuCardBodyProps {
    title: string;
    headline: string | null;
    publishedAt: string | null;
}

/**
 * ArticlesMegaMenuCardStatsProps
 *
 * @description
 * Props for the engagement stats row: likes, comments, shares.
 * Rendered at the bottom of both Featured and Compact card variants.
 */
export interface ArticlesMegaMenuCardStatsProps {
    likeCount: number;
    shareCount: number;
    /** Controls the color scheme — "light" for text overlaid on dark images, "default" for surface cards */
    variant?: "light" | "default";
}
