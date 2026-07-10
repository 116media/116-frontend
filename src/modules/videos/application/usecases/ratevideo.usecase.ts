import type { IVideosRepositoryPort } from "@/modules/videos/application/repositories/videos.repository.port";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * IRateVideoInput
 *
 * @description
 * Input contract for rating a video.
 *
 * @interface IRateVideoInput
 *
 * @property {string} id - The video being rated (UUID)
 * @property {number} stars - The star rating, 1 to 5
 */
export interface IRateVideoInput {
    id: string;
    stars: number;
}

/**
 * @interface IRateVideoUseCase
 * @extends {IResultUseCase<IRateVideoInput, boolean>}
 */
interface IRateVideoUseCase extends IResultUseCase<IRateVideoInput, boolean> {}

/**
 * Use case for rating a video.
 *
 * @class RateVideoUseCase
 * @implements {IRateVideoUseCase}
 *
 * @description
 * Submits or updates the signed-in user's star rating (1–5) for one video via
 * the videos repository. Returns the repository's `Result<boolean>` (success
 * flag) unchanged.
 */
export class RateVideoUseCase implements IRateVideoUseCase {
    private readonly videosRepository: IVideosRepositoryPort;

    /**
     * @param {IVideosRepositoryPort} videosRepository - Repository for videos operations (injected)
     */
    constructor({ videosRepository }: { videosRepository: IVideosRepositoryPort }) {
        this.videosRepository = videosRepository;
    }

    /**
     * Executes the rate video use case.
     *
     * @param {IRateVideoInput} input - The video and the star rating
     * @returns {Promise<Result<boolean>>} `ok(boolean)` success flag on success, `err(Failure)` on failure
     */
    async execute(input: IRateVideoInput): Promise<Result<boolean>> {
        return this.videosRepository.rateVideo(input.id, input.stars);
    }
}
