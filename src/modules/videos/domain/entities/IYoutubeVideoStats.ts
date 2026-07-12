/**
 * IYoutubeVideoStats
 *
 * @description
 * Domain entity for the YouTube Data API statistics of a video's upload,
 * sourced from the internal `/api/youtube/[videoId]` route (no generated DTO).
 * Null means hidden or unavailable upstream, distinct from a real count of 0.
 *
 * @interface IYoutubeVideoStats
 *
 * @property {number | null} viewCount - Total YouTube views, or null when hidden/unavailable
 * @property {number | null} likeCount - Total YouTube likes, or null when hidden/unavailable
 * @property {number | null} commentCount - Total YouTube comments, or null when hidden/unavailable
 * @property {boolean} hasStats - True when at least one statistic carries a value; derived by the mapper
 */
export interface IYoutubeVideoStats {
    hasStats: boolean;
    viewCount: number | null;
    likeCount: number | null;
    commentCount: number | null;
}
