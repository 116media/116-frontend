import type { IVideoTagEntity } from "@/modules/videos/domain/entities/IVideoTagEntity";

/**
 * IVideoDetailEntity
 *
 * @description
 * Domain entity representing one published video on the public detail page.
 * Maps from VideoDetailDto — drops audit, status, promotion, and commerce
 * fields, and drops the author entirely (product rule: the video detail page
 * shows no author).
 *
 * @interface IVideoDetailEntity
 *
 * @property {string} id - Unique identifier (UUID)
 * @property {string} categoryId - Associated category UUID
 * @property {string} categoryName - Display name of the category
 * @property {string} title - Video display title
 * @property {string} slug - URL-safe slug
 * @property {string} description - Plain-text description shown in the description tab
 * @property {string | null} thumbnailUrl - URL of the video thumbnail, or null if not set
 * @property {string | null} youtubeVideoUrl - YouTube video URL, or null if not yet attached
 * @property {boolean} hasLyrics - Whether lyrics are linked to this video
 * @property {IVideoTagEntity[]} tags - Tags attached to the video
 * @property {number} shareCount - Cached number of shares
 * @property {number} ratingAverage - Cached average star rating (1–5)
 * @property {number} ratingCount - Cached total number of ratings
 * @property {string | null} publishedAt - ISO timestamp of publication, or null if unpublished
 * @property {string} [metaTitle] - SEO title override, when set
 * @property {string} [metaDescription] - SEO description override, when set
 */
export interface IVideoDetailEntity {
    id: string;
    categoryId: string;
    categoryName: string;
    title: string;
    slug: string;
    description: string;
    thumbnailUrl: string | null;
    youtubeVideoUrl: string | null;
    hasLyrics: boolean;
    tags: IVideoTagEntity[];
    shareCount: number;
    ratingAverage: number;
    ratingCount: number;
    publishedAt: string | null;
    metaTitle?: string;
    metaDescription?: string;
}
