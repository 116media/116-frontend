import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";

/**
 * IArticlePromotionFeedEntity
 *
 * @description
 * The homepage article promotion grid, mapped from PublicGetArticlePromotionFeedResult.
 * The mapper resolves backend spots and slots into named arrays ready for direct use by
 * carousel and strip components.
 *
 * @interface IArticlePromotionFeedEntity
 *
 * @property {IArticleSummaryEntity[]} hero - Spot 1 carousel items (hero, top-left)
 * @property {IArticleSummaryEntity[]} side - Spot 2 carousel items (tall side, top-right)
 * @property {IArticleSummaryEntity[]} pairA - Spot 3 column a carousel items (bottom-left)
 * @property {IArticleSummaryEntity[]} pairB - Spot 3 column b carousel items (bottom-left)
 * @property {IArticleSummaryEntity[]} gossipStrip - 3 static gossip articles (bottom-right)
 */
export interface IArticlePromotionFeedEntity {
    hero: IArticleSummaryEntity[];
    side: IArticleSummaryEntity[];
    pairA: IArticleSummaryEntity[];
    pairB: IArticleSummaryEntity[];
    gossipStrip: IArticleSummaryEntity[];
}
