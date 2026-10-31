import type { EContentType } from "@/modules/search/domain/enums/EContentType";

/**
 * ISearchHitEntity
 *
 * @description
 * One search result, flattened across content types. Fields a type does not carry
 * come back null, so a row renders from one shape with guards.
 *
 * @interface ISearchHitEntity
 * @property {EContentType} type - Which content type this hit is
 * @property {string} id - Entity identifier
 * @property {string} slug - Slug of the detail page
 * @property {string} title - Entity title
 * @property {string} excerpt - Plain-text summary, empty for a type that has none
 * @property {string | null} imageUrl - Cover or thumbnail, null when unset
 * @property {string | null} categoryId - Owning category's id, null for a type that has none
 * @property {string | null} categoryName - Owning category, null for a type that has none
 * @property {string | null} publishedAt - ISO publication timestamp
 * @property {number} score - Relevance; higher ranks first. Not displayed
 * @property {number | null} ratingAverage - Cached average rating, videos only
 * @property {boolean} hasRating - Whether a rating is worth rendering
 */
export interface ISearchHitEntity {
    type: EContentType;
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    imageUrl: string | null;
    categoryId: string | null;
    categoryName: string | null;
    publishedAt: string | null;
    score: number;
    ratingAverage: number | null;
    hasRating: boolean;
}
