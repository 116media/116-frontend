import type { IVideosRepositoryPort } from "@/modules/videos/application/repositories/videos.repository.port";
import type { IVideoExclusiveShowEntity } from "@/modules/videos/domain/entities/IVideoExclusiveShowEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetVideoExclusiveShowUseCase
 * @extends {IResultUseCase<void, IVideoExclusiveShowEntity>}
 */
interface IGetVideoExclusiveShowUseCase extends IResultUseCase<void, IVideoExclusiveShowEntity> {}

/**
 * Use case for fetching the homepage exclusive show.
 *
 * @class GetVideoExclusiveShowUseCase
 * @implements {IGetVideoExclusiveShowUseCase}
 *
 * @description
 * Retrieves the single exclusive category and its episodes for the public
 * homepage exclusive section via the videos repository.
 */
export class GetVideoExclusiveShowUseCase implements IGetVideoExclusiveShowUseCase {
    private readonly videosRepository: IVideosRepositoryPort;

    /**
     * @param videosRepository - Repository for videos operations (injected)
     */
    constructor({ videosRepository }: { videosRepository: IVideosRepositoryPort }) {
        this.videosRepository = videosRepository;
    }

    /**
     * Executes the get exclusive show use case.
     *
     * @returns {Promise<Result<IVideoExclusiveShowEntity>>} `ok(IVideoExclusiveShowEntity)` on success, `err(Failure)` on failure
     */
    async execute(): Promise<Result<IVideoExclusiveShowEntity>> {
        return this.videosRepository.getExclusiveShow();
    }
}
