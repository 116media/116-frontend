/**
 * Collections owned by the favorites video page, in display order.
 */
export const FAVORITE_VIDEO_COLLECTIONS = ["playlists", "rated", "shared"] as const;

export type FavoriteVideoCollection = (typeof FAVORITE_VIDEO_COLLECTIONS)[number];
