import type { IVideosRepositoryPort } from "@/modules/videos/application/repositories/videos.repository.port";
import type { IVideoTagEntity } from "@/modules/videos/domain/entities/IVideoTagEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetVideoPopularTagsUseCase
 * @extends {IResultUseCase<void, IVideoTagEntity[]>}
 */
interface IGetVideoPopularTagsUseCase extends IResultUseCase<void, IVideoTagEntity[]> {}

/**
 * Use case for fetching popular video tags.
 *
 * @class GetVideoPopularTagsUseCase
 * @implements {IGetVideoPopularTagsUseCase}
 *
 * @description
 * Retrieves the most popular tags scoped to the Video content type
 * via the videos repository.
 */
export class GetVideoPopularTagsUseCase implements IGetVideoPopularTagsUseCase {
    private readonly videosRepository: IVideosRepositoryPort;

    /**
     * @param videosRepository - Repository for videos operations (injected)
     */
    constructor({ videosRepository }: { videosRepository: IVideosRepositoryPort }) {
        this.videosRepository = videosRepository;
    }

    /**
     * Executes the get video popular tags use case.
     *
     * @returns {Promise<Result<IVideoTagEntity[]>>} `ok(IVideoTagEntity[])` on success, `err(Failure)` on failure
     */
    async execute(): Promise<Result<IVideoTagEntity[]>> {
        return this.videosRepository.getVideoPopularTags();
    }
}
