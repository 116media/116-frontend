import type {
    IOwnVideoActivityQuery,
    IVideosRepositoryPort
} from "@/modules/videos/application/repositories/videos.repository.port";
import type { IVideoActivityPage } from "@/modules/videos/domain/entities/IVideoActivityPage";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetOwnSharedVideosUseCase
 * @extends {IResultUseCase<IOwnVideoActivityQuery, IVideoActivityPage>}
 */
interface IGetOwnSharedVideosUseCase
    extends IResultUseCase<IOwnVideoActivityQuery, IVideoActivityPage> {}

/**
 * Use case for fetching a page of the signed-in user's shared videos.
 *
 * @class GetOwnSharedVideosUseCase
 * @implements {IGetOwnSharedVideosUseCase}
 *
 * @description
 * Fetches one page of published videos the signed-in user has shared, newest
 * share first, via the videos repository. Returns the repository's
 * `Result<IVideoActivityPage>` unchanged.
 */
export class GetOwnSharedVideosUseCase implements IGetOwnSharedVideosUseCase {
    private readonly videosRepository: IVideosRepositoryPort;

    /**
     * @param videosRepository - Repository for videos operations (injected)
     */
    constructor({
        videosRepository
    }: {
        videosRepository: IVideosRepositoryPort;
    }) {
        this.videosRepository = videosRepository;
    }

    /**
     * Executes the get-own-shared-videos use case.
     *
     * @param query - Paging for the shared feed
     * @returns {Promise<Result<IVideoActivityPage>>} `ok(IVideoActivityPage)` on success, `err(Failure)` on failure
     */
    async execute(query: IOwnVideoActivityQuery): Promise<Result<IVideoActivityPage>> {
        return this.videosRepository.getOwnSharedVideos(query);
    }
}
