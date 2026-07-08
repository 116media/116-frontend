import type { IVideosRepositoryPort } from "@/modules/videos/application/repositories/videos.repository.port";
import type { IShowEntity } from "@/modules/videos/domain/entities/IShowEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetShowsUseCase
 * @extends {IResultUseCase<void, IShowEntity[]>}
 */
interface IGetShowsUseCase extends IResultUseCase<void, IShowEntity[]> {}

/**
 * Use case for fetching shows.
 *
 * @class GetShowsUseCase
 * @implements {IGetShowsUseCase}
 *
 * @description
 * Retrieves the active video categories as "shows" (with poster and
 * description) for the homepage shows carousel and the shows page, via the
 * videos repository.
 */
export class GetShowsUseCase implements IGetShowsUseCase {
    private readonly videosRepository: IVideosRepositoryPort;

    /**
     * @param videosRepository - Repository for videos operations (injected)
     */
    constructor({ videosRepository }: { videosRepository: IVideosRepositoryPort }) {
        this.videosRepository = videosRepository;
    }

    /**
     * Executes the get shows use case.
     *
     * @returns {Promise<Result<IShowEntity[]>>} `ok(IShowEntity[])` on success, `err(Failure)` on failure
     */
    async execute(): Promise<Result<IShowEntity[]>> {
        return this.videosRepository.getShows();
    }
}
