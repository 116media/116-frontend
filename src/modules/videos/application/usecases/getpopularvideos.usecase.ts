import type {
    IPopularVideosQuery,
    IVideosRepositoryPort
} from "@/modules/videos/application/repositories/videos.repository.port";
import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetPopularVideosUseCase
 * @extends {IResultUseCase<IPopularVideosQuery, IVideoSummaryEntity[]>}
 */
interface IGetPopularVideosUseCase
    extends IResultUseCase<IPopularVideosQuery, IVideoSummaryEntity[]> {}

/**
 * Use case for fetching the popularity-ranked video list.
 *
 * @class GetPopularVideosUseCase
 * @implements {IGetPopularVideosUseCase}
 *
 * @description
 * Fetches the most popular published videos — ranked server-side by weighted
 * engagement — via the videos repository, optionally excluding the video currently
 * open. Returns the repository's `Result<IVideoSummaryEntity[]>` unchanged.
 */
export class GetPopularVideosUseCase implements IGetPopularVideosUseCase {
    private readonly videosRepository: IVideosRepositoryPort;

    /**
     * @param {IVideosRepositoryPort} videosRepository - Repository for videos operations (injected)
     */
    constructor({ videosRepository }: { videosRepository: IVideosRepositoryPort }) {
        this.videosRepository = videosRepository;
    }

    /**
     * Executes the get-popular-videos use case.
     *
     * @param {IPopularVideosQuery} query - Limit plus optional exclusion and category scope
     * @returns {Promise<Result<IVideoSummaryEntity[]>>} `ok(IVideoSummaryEntity[])` on success, `err(Failure)` on failure
     */
    async execute(query: IPopularVideosQuery): Promise<Result<IVideoSummaryEntity[]>> {
        return this.videosRepository.getPopularVideos(query);
    }
}
