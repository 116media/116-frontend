import type { IArticlePromotionFeedEntity } from "@/modules/articles/domain/entities/IArticlePromotionFeedEntity";

/**
 * ArticlePromotionFeedViewProps
 *
 * @description
 * Props for the article promotion feed presentation component.
 *
 * @property {IArticlePromotionFeedEntity} feed - Pre-mapped promotion feed data
 */
export interface ArticlePromotionFeedViewProps {
    feed: IArticlePromotionFeedEntity;
}
