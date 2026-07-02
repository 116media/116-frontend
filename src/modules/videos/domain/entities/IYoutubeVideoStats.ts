/**
 * IYoutubeVideoStats
 *
 * @description
 * Domain entity representing the YouTube Data API statistics for the video's
 * YouTube upload, displayed as stat chips on the detail page. There is no DTO
 * on the generated client — the internal `/api/youtube/[videoId]` route
 * handler's JSON is the source shape. A null field means the statistic is
 * hidden or unavailable upstream, which is distinct from a real count of 0:
 * null chips are hidden, zero chips render.
 *
 * @interface IYoutubeVideoStats
 *
 * @property {number | null} viewCount - Total YouTube views, or null when hidden/unavailable
 * @property {number | null} likeCount - Total YouTube likes, or null when hidden/unavailable
 * @property {number | null} commentCount - Total YouTube comments, or null when hidden/unavailable
 */
export interface IYoutubeVideoStats {
    viewCount: number | null;
    likeCount: number | null;
    commentCount: number | null;
}
