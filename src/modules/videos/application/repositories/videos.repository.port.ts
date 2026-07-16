import type { IPlaylistEntity } from "@/modules/videos/domain/entities/IPlaylistEntity";
import type { IShowEntity } from "@/modules/videos/domain/entities/IShowEntity";
import type { IVideoCategoryEntity } from "@/modules/videos/domain/entities/IVideoCategoryEntity";
import type { IVideoDetailEntity } from "@/modules/videos/domain/entities/IVideoDetailEntity";
import type { IVideoExclusiveShowEntity } from "@/modules/videos/domain/entities/IVideoExclusiveShowEntity";
import type { IVideoLyricsEntity } from "@/modules/videos/domain/entities/IVideoLyricsEntity";
import type { IVideoPage } from "@/modules/videos/domain/entities/IVideoPage";
import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";
import type { IVideoTagEntity } from "@/modules/videos/domain/entities/IVideoTagEntity";
import type { IYoutubeVideoStats } from "@/modules/videos/domain/entities/IYoutubeVideoStats";
import type { Result } from "@/shared/domain/results/result";

/**
 * IAddVideoToPlaylistInput
 *
 * @description
 * Input contract for adding one video to one playlist. The `sortOrder` places
 * the video at the end of the playlist (the caller passes the playlist's
 * current `videoCount`).
 *
 * @interface IAddVideoToPlaylistInput
 *
 * @property {string} playlistId - The target playlist (UUID)
 * @property {string} videoId - The video being added (UUID)
 * @property {number} sortOrder - Zero-based position of the video in the playlist
 */
export interface IAddVideoToPlaylistInput {
    playlistId: string;
    videoId: string;
    sortOrder: number;
}

/**
 * Query for a page of published videos. Mirrors GET /api/v1/public/videos.
 *
 * @interface IPublishedVideosQuery
 *
 * @property {number} pageIndex - Zero-based page number
 * @property {number} pageSize - Items per page
 * @property {string} [search] - Optional full-text search term
 * @property {string} [categoryId] - Optional category filter (UUID)
 * @property {string} [tagSlug] - Optional tag filter
 */
export interface IPublishedVideosQuery {
    pageIndex: number;
    pageSize: number;
    search?: string;
    categoryId?: string;
    tagSlug?: string;
}

/**
 * Query for the popularity-ranked video list. Mirrors
 * GET /api/v1/public/videos/popular — a fixed-size, non-paginated list.
 *
 * @interface IPopularVideosQuery
 *
 * @property {number} limit - Maximum number of videos to return (10 for the detail sidebar)
 * @property {string} [excludeId] - Video id to omit, e.g. the video currently open (UUID)
 * @property {string} [categoryId] - Optional category scope (UUID)
 */
export interface IPopularVideosQuery {
    limit: number;
    excludeId?: string;
    categoryId?: string;
}

/**
 * Repository port for videos data access operations.
 *
 * @description
 * Defines the contract for all video-related data access.
 * All methods return `Result<T>` — errors are represented as typed
 * `Failure` values, never thrown.
 */
export interface IVideosRepositoryPort {
    /**
     * Fetches the list of currently promoted videos.
     *
     * @returns `ok(IVideoSummaryEntity[])` on success, `err(Failure)` on failure
     */
    getPromotedVideos(): Promise<Result<IVideoSummaryEntity[]>>;

    /**
     * Fetches the list of active categories scoped to videos.
     *
     * @returns `ok(IVideoCategoryEntity[])` on success, `err(Failure)` on failure
     */
    getVideoCategories(): Promise<Result<IVideoCategoryEntity[]>>;

    /**
     * Fetches the active video categories as "shows" (with poster + description)
     * for the homepage shows carousel and the shows page.
     *
     * @returns `ok(IShowEntity[])` on success, `err(Failure)` on failure
     */
    getShows(): Promise<Result<IShowEntity[]>>;

    /**
     * Fetches the most popular tags scoped to the Video content type.
     *
     * @returns `ok(IVideoTagEntity[])` on success, `err(Failure)` on failure
     */
    getVideoPopularTags(): Promise<Result<IVideoTagEntity[]>>;

    /**
     * Fetches the exclusive show (the single exclusive category) together with
     * its episodes for the homepage exclusive section.
     *
     * @returns `ok(IVideoExclusiveShowEntity)` on success, `err(Failure)` on failure
     */
    getExclusiveShow(): Promise<Result<IVideoExclusiveShowEntity>>;

    /**
     * Fetches one published video by its slug for the detail page.
     *
     * @param slug - The video slug from the route
     * @returns `ok(IVideoDetailEntity)` on success, `err(Failure)` on failure
     */
    getVideoBySlug(slug: string): Promise<Result<IVideoDetailEntity>>;

    /**
     * Fetches one page of published videos, optionally scoped by category,
     * tag, or search term. Keeps the pagination metadata so infinite feeds
     * can derive the next page.
     *
     * @param query - Paging plus optional filters
     * @returns `ok(IVideoPage)` on success, `err(Failure)` on failure
     */
    getPublishedVideos(query: IPublishedVideosQuery): Promise<Result<IVideoPage>>;

    /**
     * Fetches every tag scoped to the Video content type, optionally filtered
     * by a search term, for the "All tags" popover.
     *
     * @param search - Optional tag search term
     * @returns `ok(IVideoTagEntity[])` on success, `err(Failure)` on failure
     */
    getAllVideoTags(search?: string): Promise<Result<IVideoTagEntity[]>>;

    /**
     * Fetches the most popular published videos — ranked server-side by weighted
     * engagement — optionally excluding the video currently open. Non-paginated:
     * the caller receives the whole capped list in one call.
     *
     * @param query - Limit plus optional exclusion and category scope
     * @returns `ok(IVideoSummaryEntity[])` on success, `err(Failure)` on failure
     */
    getPopularVideos(query: IPopularVideosQuery): Promise<Result<IVideoSummaryEntity[]>>;

    /**
     * Fetches the lyrics linked to a video for the detail page's lyrics tab.
     *
     * @param videoId - The video whose lyrics to fetch (UUID)
     * @returns `ok(IVideoLyricsEntity)` on success, `err(Failure)` on failure (including 404)
     */
    getVideoLyrics(videoId: string): Promise<Result<IVideoLyricsEntity>>;

    /**
     * Submits or updates the signed-in user's star rating (1–5) for a video.
     *
     * @param id - The video being rated (UUID)
     * @param stars - The star rating, 1 to 5
     * @returns `ok(boolean)` success flag on success, `err(Failure)` on failure
     */
    rateVideo(id: string, stars: number): Promise<Result<boolean>>;

    /**
     * Records a share event against a video. Anonymous access is permitted; the
     * `shareChannel` is stored server-side for per-channel share analytics.
     *
     * @param id - The video being shared (UUID)
     * @param shareChannel - The share channel (e.g. "Facebook", "Clipboard", "WhatsApp")
     * @returns `ok(boolean)` success flag on success, `err(Failure)` on failure
     */
    shareVideo(id: string, shareChannel: string): Promise<Result<boolean>>;

    /**
     * Fetches the signed-in user's playlists for the add-to-playlist modal.
     *
     * @returns `ok(IPlaylistEntity[])` on success, `err(Failure)` on failure
     */
    getMyPlaylists(): Promise<Result<IPlaylistEntity[]>>;

    /**
     * Creates a new playlist owned by the signed-in user.
     *
     * @param name - The playlist name
     * @returns `ok(IPlaylistEntity)` on success, `err(Failure)` on failure
     */
    createPlaylist(name: string): Promise<Result<IPlaylistEntity>>;

    /**
     * Adds one video to one of the signed-in user's playlists.
     *
     * @param input - The playlist, video, and target position
     * @returns `ok(boolean)` success flag on success, `err(Failure)` on failure
     */
    addVideoToPlaylist(input: IAddVideoToPlaylistInput): Promise<Result<boolean>>;

    /**
     * Fetches the YouTube Data API statistics for a YouTube video id through
     * the internal `/api/youtube/[videoId]` route. Browser-only — outside the
     * browser it resolves to a failure without touching the network.
     *
     * @param youtubeId - The 11-character YouTube video id
     * @returns `ok(IYoutubeVideoStats)` on success, `err(Failure)` on failure
     */
    getYoutubeStats(youtubeId: string): Promise<Result<IYoutubeVideoStats>>;
}
