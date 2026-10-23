import { ArticleCardAuthor } from "./ArticleCard.Author";
import { ArticleCardDate } from "./ArticleCard.Date";
import { ArticleCardEngagement } from "./ArticleCard.Engagement";
import { ArticleCardFeed } from "./ArticleCard.Feed";
import { ArticleCardHorizontal } from "./ArticleCard.Horizontal";
import { ArticleCardMedia } from "./ArticleCard.Media";
import { ArticleCardMeta } from "./ArticleCard.Meta";

/**
 * ArticleCard
 *
 * @description
 * Compound family of article cards. `.Feed` is the magazine-style card used in the
 * /articles grid and `.Horizontal` the compact bordered row in the popular sidebar; the
 * remaining members are the slots they arrange, so another surface can compose the same
 * pieces under its own frame.
 */
export const ArticleCard = {
    Feed: ArticleCardFeed,
    Horizontal: ArticleCardHorizontal,
    Media: ArticleCardMedia,
    Author: ArticleCardAuthor,
    Date: ArticleCardDate,
    Meta: ArticleCardMeta,
    Engagement: ArticleCardEngagement
} as const;
