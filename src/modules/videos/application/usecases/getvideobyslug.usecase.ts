import type { IVideosRepositoryPort } from "@/modules/videos/application/repositories/videos.repository.port";
import type { IVideoDetailEntity } from "@/modules/videos/domain/entities/IVideoDetailEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetVideoBySlugUseCase
 * @extends {IResultUseCase<string, IVideoDetailEntity>}
 */
interface IGetVideoBySlugUseCase extends IResultUseCase<string, IVideoDetailEntity> {}

/**
 * Use case for fetching one video by slug.
 *
 * @class GetVideoBySlugUseCase
 * @implements {IGetVideoBySlugUseCase}
 *
 * @description
 * Fetches a single published video by its slug via the videos repository.
 * Returns the repository's `Result<IVideoDetailEntity>` unchanged.
 */
export class GetVideoBySlugUseCase implements IGetVideoBySlugUseCase {
    private readonly videosRepository: IVideosRepositoryPort;

    /**
     * @param {IVideosRepositoryPort} videosRepository - Repository for videos operations (injected)
     */
    constructor({ videosRepository }: { videosRepository: IVideosRepositoryPort }) {
        this.videosRepository = videosRepository;
    }

    /**
     * Executes the get-video-by-slug use case.
     *
     * @param {string} slug - The video slug
     * @returns {Promise<Result<IVideoDetailEntity>>} `ok(IVideoDetailEntity)` on success, `err(Failure)` on failure
     */
    async execute(slug: string): Promise<Result<IVideoDetailEntity>> {
        return this.videosRepository.getVideoBySlug(slug);
    }
}
