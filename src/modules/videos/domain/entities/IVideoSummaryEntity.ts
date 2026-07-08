/**
 * IVideoSummaryEntity
 *
 * @description
 * Domain entity representing a summary view of a published video. Maps from
 * VideoSummaryDto — drops audit fields, authorId, status, hasLyrics, and
 * shootingScheduledAt, which are irrelevant to public surfaces.
 *
 * @interface IVideoSummaryEntity
 *
 * @property {string} id - Unique identifier (UUID)
 * @property {string} categoryId - Associated category UUID
 * @property {string} categoryName - Display name of the category
 * @property {string} title - Video display title
 * @property {string} slug - URL-safe slug
 * @property {string | null} thumbnailUrl - URL of the video thumbnail, or null if not set
 * @property {string | null} youtubeVideoUrl - YouTube video URL, or null if not yet attached
 * @property {boolean} isPromoted - Whether the video has an active paid promotion
 * @property {string | null} publishedAt - ISO timestamp of publication, or null if unpublished
 * @property {number} shareCount - Cached number of shares
 * @property {number} ratingAverage - Cached average star rating (1–5)
 * @property {number} ratingCount - Cached total number of ratings
 */
export interface IVideoSummaryEntity {
    id: string;
    categoryId: string;
    categoryName: string;
    title: string;
    slug: string;
    thumbnailUrl: string | null;
    youtubeVideoUrl: string | null;
    isPromoted: boolean;
    publishedAt: string | null;
    shareCount: number;
    ratingAverage: number;
    ratingCount: number;
}
