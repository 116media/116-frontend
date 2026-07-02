import type { IVideosRepositoryPort } from "@/modules/videos/application/repositories/videos.repository.port";
import type { IYoutubeVideoStats } from "@/modules/videos/domain/entities/IYoutubeVideoStats";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetYoutubeVideoStatsUseCase
 * @extends {IResultUseCase<string, IYoutubeVideoStats>}
 */
interface IGetYoutubeVideoStatsUseCase extends IResultUseCase<string, IYoutubeVideoStats> {}

/**
 * Use case for fetching YouTube statistics for a video.
 *
 * @class GetYoutubeVideoStatsUseCase
 * @implements {IGetYoutubeVideoStatsUseCase}
 *
 * @description
 * Fetches the YouTube Data API statistics (views, likes, comments) for one
 * YouTube video id via the videos repository, which proxies through the
 * internal `/api/youtube/[videoId]` route so the API key stays server-side.
 * Returns the repository's `Result<IYoutubeVideoStats>` unchanged.
 */
export class GetYoutubeVideoStatsUseCase implements IGetYoutubeVideoStatsUseCase {
    private readonly videosRepository: IVideosRepositoryPort;

    /**
     * @param {IVideosRepositoryPort} videosRepository - Repository for videos operations (injected)
     */
    constructor({ videosRepository }: { videosRepository: IVideosRepositoryPort }) {
        this.videosRepository = videosRepository;
    }

    /**
     * Executes the get-YouTube-video-stats use case.
     *
     * @param {string} youtubeId - The 11-character YouTube video id
     * @returns {Promise<Result<IYoutubeVideoStats>>} `ok(IYoutubeVideoStats)` on success, `err(Failure)` on failure
     */
    async execute(youtubeId: string): Promise<Result<IYoutubeVideoStats>> {
        return this.videosRepository.getYoutubeStats(youtubeId);
    }
}
