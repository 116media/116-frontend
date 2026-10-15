import type { IVideosRepositoryPort } from "@/modules/videos/application/repositories/videos.repository.port";
import type { IVideoFeedEntity } from "@/modules/videos/domain/entities/IVideoFeedEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetVideoFeedUseCase
 * @extends {IResultUseCase<void, IVideoFeedEntity[]>}
 */
interface IGetVideoFeedUseCase extends IResultUseCase<void, IVideoFeedEntity[]> {}

/**
 * Use case for fetching the homepage video feed.
 *
 * @class GetVideoFeedUseCase
 * @implements {IGetVideoFeedUseCase}
 *
 * @description
 * Retrieves one section per category pinned to the feed, each with its latest
 * published videos, via the videos repository.
 */
export class GetVideoFeedUseCase implements IGetVideoFeedUseCase {
    private readonly videosRepository: IVideosRepositoryPort;

    /**
     * @param videosRepository - Repository for videos operations (injected)
     */
    constructor({ videosRepository }: { videosRepository: IVideosRepositoryPort }) {
        this.videosRepository = videosRepository;
    }

    /**
     * Executes the get video feed use case.
     *
     * @returns {Promise<Result<IVideoFeedEntity[]>>} `ok(IVideoFeedEntity[])` on success, `err(Failure)` on failure
     */
    async execute(): Promise<Result<IVideoFeedEntity[]>> {
        return this.videosRepository.getVideoFeed();
    }
}
