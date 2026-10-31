import type { ISearchHitEntity } from "@/modules/search/domain/entities/ISearchHitEntity";
import { EContentType } from "@/modules/search/domain/enums/EContentType";
import {
    ARTICLES_PATH,
    LYRICS_PATH,
    SEARCH_PATH,
    SHORTS_PATH,
    VIDEOS_PATH
} from "@/shared/presentation/constants/paths";

/**
 * The listing each content type's detail page hangs off. A short opens the shorts
 * viewer rather than a video page, so the href is resolved per type.
 */
const DETAIL_ROOTS: Record<EContentType, string | null> = {
    [EContentType.Article]: ARTICLES_PATH,
    [EContentType.Video]: VIDEOS_PATH,
    [EContentType.Short]: SHORTS_PATH,
    [EContentType.Lyrics]: LYRICS_PATH,
    [EContentType.Custom]: null
};

/**
 * The i18n key naming each content type on a result's badge.
 */
const TYPE_LABEL_KEYS: Record<EContentType, string> = {
    [EContentType.Article]: "search.type.article",
    [EContentType.Video]: "search.type.video",
    [EContentType.Short]: "search.type.short",
    [EContentType.Lyrics]: "search.type.lyrics",
    [EContentType.Custom]: "search.type.article"
};

/**
 * Builds the detail route a hit links to.
 *
 * @param hit - The search hit.
 * @returns {string} The href, falling back to the articles listing for an unknown type.
 */
export function searchHitHref(hit: ISearchHitEntity): string {
    const root = DETAIL_ROOTS[hit.type] ?? ARTICLES_PATH;
    return `${root}/${hit.slug}`;
}

/**
 * The i18n key for a hit's type badge.
 *
 * @param type - The hit's content type.
 * @returns {string} The translation key.
 */
export function searchTypeLabelKey(type: EContentType): string {
    return TYPE_LABEL_KEYS[type] ?? TYPE_LABEL_KEYS[EContentType.Article];
}

/**
 * Builds the search route for a term and an optional scope.
 *
 * @param term - The reader's term, trimmed by the caller.
 * @param scope - The scope to open on, omitted for the default.
 * @returns {string} The href.
 */
export function searchHref(term: string, scope?: string): string {
    const params = new URLSearchParams({ q: term });
    if (scope) params.set("scope", scope);
    return `${SEARCH_PATH}?${params.toString()}`;
}
