import type { IVideosRepositoryPort } from "@/modules/videos/application/repositories/videos.repository.port";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * Request payload for {@link ShareVideoUseCase}.
 *
 * @interface IShareVideoRequest
 * @property {string} videoId - The video being shared.
 * @property {string} platform - The share surface used (e.g. "facebook", "clipboard").
 */
export interface IShareVideoRequest {
    videoId: string;
    platform: string;
}

/**
 * IShareVideoUseCase
 *
 * @interface IShareVideoUseCase
 * @extends {IResultUseCase<IShareVideoRequest, boolean>}
 */
interface IShareVideoUseCase extends IResultUseCase<IShareVideoRequest, boolean> {}

/**
 * ShareVideoUseCase
 *
 * @class ShareVideoUseCase
 * @implements {IShareVideoUseCase}
 *
 * @description
 * Records a share event for one video via the videos repository. The platform is
 * client-side context only; the backend endpoint accepts no payload.
 */
export class ShareVideoUseCase implements IShareVideoUseCase {
    private readonly videosRepository: IVideosRepositoryPort;

    /**
     * @param deps - Awilix cradle slice.
     * @param deps.videosRepository - The videos repository (injected).
     */
    constructor({ videosRepository }: { videosRepository: IVideosRepositoryPort }) {
        this.videosRepository = videosRepository;
    }

    /**
     * Executes the share-video use case.
     *
     * @param request - The video id and share platform.
     * @returns `ok(boolean)` success flag on success, `err(Failure)` on failure.
     */
    execute({ videoId, platform }: IShareVideoRequest): Promise<Result<boolean>> {
        return this.videosRepository.shareVideo(videoId, platform);
    }
}
