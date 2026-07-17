/**
 * IPlaylistVideoEntity
 *
 * @description
 * One video row inside a playlist's detail view. Maps from VideoInPlaylistDto,
 * keeping the position (`sortOrder`) so the list renders in playlist order.
 *
 * @interface IPlaylistVideoEntity
 *
 * @property {string} videoId - The video's unique identifier (UUID)
 * @property {string} slug - URL-safe slug
 * @property {string} title - Video display title
 * @property {string | null} [thumbnailUrl] - URL of the video thumbnail, or null if not set
 * @property {string} categoryName - Display name of the category
 * @property {string | null} [publishedAt] - ISO timestamp of publication, or null if unpublished
 * @property {number} ratingAverage - Cached average star rating (1–5)
 * @property {number} ratingCount - Cached total number of ratings
 * @property {number} sortOrder - Zero-based position of the video in the playlist
 */
export interface IPlaylistVideoEntity {
    videoId: string;
    slug: string;
    title: string;
    thumbnailUrl?: string | null;
    categoryName: string;
    publishedAt?: string | null;
    ratingAverage: number;
    ratingCount: number;
    sortOrder: number;
}
