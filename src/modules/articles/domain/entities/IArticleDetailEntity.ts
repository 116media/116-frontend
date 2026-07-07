import type { IArticleImage } from "@/modules/articles/domain/entities/IArticleImage";
import type { IArticleAuthor } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import type { IArticleTagEntity } from "@/modules/articles/domain/entities/IArticleTagEntity";

/**
 * IArticleDetailEntity
 *
 * @description
 * Full view of a single published article behind /articles/[slug], mapped from
 * ArticleDetailDto. Drops admin, promotion, and commerce metadata; keeps SEO meta fields
 * and the caller's per-user interaction flags (`isLiked` / `isBookmarked`).
 *
 * @interface IArticleDetailEntity
 *
 * @property {string} id - Unique identifier (UUID). Keys the interaction and comment endpoints
 * @property {string} categoryId - Associated category UUID
 * @property {string} categoryName - Display name of the category
 * @property {string} title - Article display title
 * @property {string} slug - URL-safe slug
 * @property {string} headline - Teaser shown under the title
 * @property {string} body - Rich-text HTML body, sanitized before render
 * @property {string | null} coverImageUrl - Hero image URL, or null
 * @property {IArticleAuthor | null} author - Byline author, or null when absent
 * @property {IArticleTagEntity[]} tags - Tags attached to the article
 * @property {IArticleImage[]} images - Cover and body images
 * @property {number} readTimeInMinutes - Server-computed reading time in minutes
 * @property {number} likeCount - Cached number of likes
 * @property {number} commentCount - Cached number of comments
 * @property {number} shareCount - Cached number of shares
 * @property {number} bookmarkCount - Cached number of bookmarks
 * @property {boolean} isLiked - Whether the current viewer has liked the article. False for guests
 * @property {boolean} isBookmarked - Whether the current viewer has bookmarked the article. False for guests
 * @property {string | null} publishedAt - ISO publication timestamp, or null
 * @property {string} [metaTitle] - SEO title override, when the DTO provides one
 * @property {string} [metaDescription] - SEO description override, when the DTO provides one
 */
export interface IArticleDetailEntity {
    id: string;
    categoryId: string;
    categoryName: string;
    title: string;
    slug: string;
    headline: string;
    body: string;
    coverImageUrl: string | null;
    author: IArticleAuthor | null;
    tags: IArticleTagEntity[];
    images: IArticleImage[];
    readTimeInMinutes: number;
    likeCount: number;
    commentCount: number;
    shareCount: number;
    bookmarkCount: number;
    isLiked: boolean;
    isBookmarked: boolean;
    publishedAt: string | null;
    metaTitle?: string;
    metaDescription?: string;
}
