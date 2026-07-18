/**
 * Collections owned by the favorites article page, in display order.
 */
export const FAVORITE_ARTICLE_COLLECTIONS = ["bookmarked", "commented", "liked", "shared"] as const;

export type FavoriteArticleCollection = (typeof FAVORITE_ARTICLE_COLLECTIONS)[number];
