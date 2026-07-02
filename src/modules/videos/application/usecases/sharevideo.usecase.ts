import type { IVideosRepositoryPort } from "@/modules/videos/application/repositories/videos.repository.port";
import type { Result } from "@/shared/domain/results/result";

/**
 * Use case for recording a video share.
 *
 * @class ShareVideoUseCase
 *
 * @description
 * Records a share event for one video via the videos repository.
 * Returns the repository's `Result<boolean>` (success flag) unchanged.
 * The share platform is client-side context only; the backend endpoint
 * accepts no payload.
 */
export class ShareVideoUseCase {
    private readonly videosRepository: IVideosRepositoryPort;

    /**
     * @param {IVideosRepositoryPort} videosRepository - Repository for videos operations (injected)
     */
    constructor({ videosRepository }: { videosRepository: IVideosRepositoryPort }) {
        this.videosRepository = videosRepository;
    }

    /**
     * Executes the share video use case.
     *
     * @param {string} videoId - The video being shared
     * @param {string} platform - The share surface used (e.g. "facebook", "clipboard")
     * @returns {Promise<Result<boolean>>} `ok(boolean)` success flag on success, `err(Failure)` on failure
     */
    async execute(videoId: string, platform: string): Promise<Result<boolean>> {
        return this.videosRepository.shareVideo(videoId, platform);
    }
}
