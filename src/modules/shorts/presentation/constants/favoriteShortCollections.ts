/**
 * Collections owned by the favorites short-video page, in display order.
 */
export const FAVORITE_SHORT_COLLECTIONS = ["liked", "saved", "shared"] as const;

export type FavoriteShortCollection = (typeof FAVORITE_SHORT_COLLECTIONS)[number];
