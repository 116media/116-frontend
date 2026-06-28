import { ArticleCardFeed } from "./ArticleCard.Feed";

/**
 * ArticleCard
 *
 * @description
 * Compound family of article cards. `Feed` is the magazine-style card used in the
 * /articles grid. Extend the family by adding variants here (e.g. `Row`, `Compact`).
 */
export const ArticleCard = { Feed: ArticleCardFeed } as const;
