/**
 * IArticleSummaryEntity
 *
 * @description
 * Domain entity representing a summary view of a published article.
 * Maps from ArticleSummaryDto — drops audit fields, authorId, and status
 * which are irrelevant to the public-facing mega menu display.
 *
 * @interface IArticleSummaryEntity
 *
 * @property {string} id - Unique identifier (UUID)
 * @property {string} categoryId - Associated category UUID
 * @property {string} categoryName - Display name of the category
 * @property {string} title - Article display title
 * @property {string} slug - URL-safe slug
 * @property {string} headline - Short summary text
 * @property {string | null} coverImageUrl - URL of the cover image, or null if not set
 * @property {boolean} isPromoted - Whether the article has an active paid promotion
 * @property {string | null} publishedAt - ISO timestamp of publication, or null if unpublished
 * @property {number} likeCount - Cached number of likes
 * @property {number} commentCount - Cached number of comments
 * @property {number} shareCount - Cached number of shares
 */
export interface IArticleSummaryEntity {
    id: string;
    categoryId: string;
    categoryName: string;
    title: string;
    slug: string;
    headline: string;
    coverImageUrl: string | null;
    isPromoted: boolean;
    publishedAt: string | null;
    likeCount: number;
    commentCount: number;
    shareCount: number;
}
