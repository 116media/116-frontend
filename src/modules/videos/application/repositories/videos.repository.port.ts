import type { IShowEntity } from "@/modules/videos/domain/entities/IShowEntity";
import type { IVideoCategoryEntity } from "@/modules/videos/domain/entities/IVideoCategoryEntity";
import type { IVideoExclusiveShowEntity } from "@/modules/videos/domain/entities/IVideoExclusiveShowEntity";
import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";
import type { IVideoTagEntity } from "@/modules/videos/domain/entities/IVideoTagEntity";
import type { Result } from "@/shared/domain/results/result";

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
}
