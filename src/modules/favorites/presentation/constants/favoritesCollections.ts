/**
 * The query-param key that owns the inner collection view within a favorites route.
 * The pathname owns the content type (articles/videos/shorts); this owns which
 * collection of that type is shown.
 */
export const FAVORITES_COLLECTION_PARAM = "collection";

/**
 * Allowed inner collections for `/favorites/articles`, in tab display order. The first
 * entry is the route default used when the param is missing or invalid.
 */
export const FAVORITE_ARTICLE_COLLECTIONS = ["bookmarked", "commented", "liked", "shared"] as const;

/**
 * Allowed inner collections for `/favorites/videos`, in tab display order. The first
 * entry is the route default used when the param is missing or invalid.
 */
export const FAVORITE_VIDEO_COLLECTIONS = ["playlists", "rated", "shared"] as const;

/**
 * Allowed inner collections for `/favorites/shorts`, in tab display order. The first
 * entry is the route default used when the param is missing or invalid.
 */
export const FAVORITE_SHORT_COLLECTIONS = ["liked", "saved", "shared"] as const;

/**
 * One of the article-route inner collections.
 */
export type FavoriteArticleCollection = (typeof FAVORITE_ARTICLE_COLLECTIONS)[number];

/**
 * One of the video-route inner collections.
 */
export type FavoriteVideoCollection = (typeof FAVORITE_VIDEO_COLLECTIONS)[number];

/**
 * One of the shorts-route inner collections.
 */
export type FavoriteShortCollection = (typeof FAVORITE_SHORT_COLLECTIONS)[number];
