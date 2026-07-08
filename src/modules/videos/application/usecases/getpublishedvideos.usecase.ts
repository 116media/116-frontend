import type {
    IPublishedVideosQuery,
    IVideosRepositoryPort
} from "@/modules/videos/application/repositories/videos.repository.port";
import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetPublishedVideosUseCase
 * @extends {IResultUseCase<IPublishedVideosQuery, IVideoSummaryEntity[]>}
 */
interface IGetPublishedVideosUseCase
    extends IResultUseCase<IPublishedVideosQuery, IVideoSummaryEntity[]> {}

/**
 * Use case for fetching one page of published videos.
 *
 * @class GetPublishedVideosUseCase
 * @implements {IGetPublishedVideosUseCase}
 *
 * @description
 * Fetches one page of published videos, optionally scoped by category or
 * search term, via the videos repository. Returns the repository's
 * `Result<IVideoSummaryEntity[]>` unchanged.
 */
export class GetPublishedVideosUseCase implements IGetPublishedVideosUseCase {
    private readonly videosRepository: IVideosRepositoryPort;

    /**
     * @param videosRepository - Repository for videos operations (injected)
     */
    constructor({ videosRepository }: { videosRepository: IVideosRepositoryPort }) {
        this.videosRepository = videosRepository;
    }

    /**
     * Executes the get published videos use case.
     *
     * @param query - Paging plus optional filters
     * @returns {Promise<Result<IVideoSummaryEntity[]>>} `ok(IVideoSummaryEntity[])` on success, `err(Failure)` on failure
     */
    async execute(query: IPublishedVideosQuery): Promise<Result<IVideoSummaryEntity[]>> {
        return this.videosRepository.getPublishedVideos(query);
    }
}
