import { ArticleCardFeed } from "./ArticleCard.Feed";
import { ArticleCardHorizontal } from "./ArticleCard.Horizontal";

/**
 * ArticleCard
 *
 * @description
 * Compound family of article cards. `Feed` is the magazine-style card used in the
 * /articles grid; `Horizontal` is the compact bordered row used in the article detail
 * page's popular-articles sidebar. Extend the family by adding variants here.
 */
export const ArticleCard = {
    Feed: ArticleCardFeed,
    Horizontal: ArticleCardHorizontal
} as const;
