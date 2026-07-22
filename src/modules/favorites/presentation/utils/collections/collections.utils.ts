import {
    FAVORITE_ARTICLE_COLLECTIONS,
    FAVORITE_SHORT_COLLECTIONS,
    FAVORITE_VIDEO_COLLECTIONS,
    type FavoriteArticleCollection,
    type FavoriteShortCollection,
    type FavoriteVideoCollection
} from "@/modules/favorites/presentation/constants/favoritesCollections";

/**
 * Normalizes a raw collection string to a member of the allow-list, falling back to the
 * allow-list's first entry (the route default) so arbitrary strings never leak into query
 * keys.
 *
 * @param raw - The raw `collection` search-param value, if any.
 * @param allowed - The route's ordered allow-list; its first entry is the default.
 * @returns A guaranteed-valid collection from `allowed`.
 */
function normalizeCollection<T extends string>(
    raw: string | null | undefined,
    allowed: ReadonlyArray<T>
): T {
    return allowed.find((value) => value === raw) ?? allowed[0];
}

/**
 * Normalizes the `collection` param for `/favorites/articles` to a valid article
 * collection, defaulting to `bookmarked`.
 *
 * @param raw - The raw `collection` search-param value, if any.
 * @returns A valid {@link FavoriteArticleCollection}.
 */
export function normalizeArticleCollection(
    raw: string | null | undefined
): FavoriteArticleCollection {
    return normalizeCollection(raw, FAVORITE_ARTICLE_COLLECTIONS);
}

/**
 * Normalizes the `collection` param for `/favorites/videos` to a valid video collection,
 * defaulting to `playlists`.
 *
 * @param raw - The raw `collection` search-param value, if any.
 * @returns A valid {@link FavoriteVideoCollection}.
 */
export function normalizeVideoCollection(raw: string | null | undefined): FavoriteVideoCollection {
    return normalizeCollection(raw, FAVORITE_VIDEO_COLLECTIONS);
}

/**
 * Normalizes the `collection` param for `/favorites/shorts` to a valid short collection,
 * defaulting to `liked`.
 *
 * @param raw - The raw `collection` search-param value, if any.
 * @returns A valid {@link FavoriteShortCollection}.
 */
export function normalizeShortCollection(raw: string | null | undefined): FavoriteShortCollection {
    return normalizeCollection(raw, FAVORITE_SHORT_COLLECTIONS);
}
