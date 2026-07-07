/**
 * Minimal author projection for a card byline.
 *
 * @interface IArticleAuthor
 *
 * @property {string} userName - Author display name
 * @property {string | null} avatarUrl - Author avatar URL, or null
 * @property {string} [role] - Author role/title shown as the byline subtitle, when resolved
 */
export interface IArticleAuthor {
    userName: string;
    avatarUrl: string | null;
    role?: string;
}

/**
 * IArticleSummaryEntity
 *
 * @description
 * Domain entity representing a summary view of a published article.
 * Maps from ArticleSummaryDto — drops audit fields, authorId, and status
 * which are irrelevant to the public-facing mega menu display.
 * Used by the feed grid and cards.
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
 * @property {number} [bookmarkCount] - Cached number of bookmarks
 * @property {number} [readTimeInMinutes] - Estimated reading time in minutes. Absent on the current summary DTO
 * @property {IArticleAuthor} [author] - Denormalized author for the byline. Absent on the current summary DTO
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
    bookmarkCount?: number;
    readTimeInMinutes?: number;
    author?: IArticleAuthor;
}
