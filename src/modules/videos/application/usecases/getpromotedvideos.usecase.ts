import type { IVideosRepositoryPort } from "@/modules/videos/application/repositories/videos.repository.port";
import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetPromotedVideosUseCase
 * @extends {IResultUseCase<void, IVideoSummaryEntity[]>}
 */
interface IGetPromotedVideosUseCase extends IResultUseCase<void, IVideoSummaryEntity[]> {}

/**
 * Use case for fetching promoted videos.
 *
 * @class GetPromotedVideosUseCase
 * @implements {IGetPromotedVideosUseCase}
 *
 * @description
 * Retrieves the list of currently promoted videos for display
 * in the public mega menu via the videos repository.
 */
export class GetPromotedVideosUseCase implements IGetPromotedVideosUseCase {
    private readonly videosRepository: IVideosRepositoryPort;

    /**
     * @param {IVideosRepositoryPort} videosRepository - Repository for videos operations (injected)
     */
    constructor({ videosRepository }: { videosRepository: IVideosRepositoryPort }) {
        this.videosRepository = videosRepository;
    }

    /**
     * Executes the get promoted videos use case.
     *
     * @returns {Promise<Result<IVideoSummaryEntity[]>>} `ok(IVideoSummaryEntity[])` on success, `err(Failure)` on failure
     */
    async execute(): Promise<Result<IVideoSummaryEntity[]>> {
        return this.videosRepository.getPromotedVideos();
    }
}
