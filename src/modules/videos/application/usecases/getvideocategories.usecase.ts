import type { IVideosRepositoryPort } from "@/modules/videos/application/repositories/videos.repository.port";
import type { IVideoCategoryEntity } from "@/modules/videos/domain/entities/IVideoCategoryEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetVideoCategoriesUseCase
 * @extends {IResultUseCase<void, IVideoCategoryEntity[]>}
 */
interface IGetVideoCategoriesUseCase extends IResultUseCase<void, IVideoCategoryEntity[]> {}

/**
 * Use case for fetching video categories.
 *
 * @class GetVideoCategoriesUseCase
 * @implements {IGetVideoCategoriesUseCase}
 *
 * @description
 * Retrieves the list of active categories scoped to videos for display
 * in the public mega menu via the videos repository.
 */
export class GetVideoCategoriesUseCase implements IGetVideoCategoriesUseCase {
    private readonly videosRepository: IVideosRepositoryPort;

    /**
     * @param {IVideosRepositoryPort} videosRepository - Repository for videos operations (injected)
     */
    constructor({ videosRepository }: { videosRepository: IVideosRepositoryPort }) {
        this.videosRepository = videosRepository;
    }

    /**
     * Executes the get video categories use case.
     *
     * @returns {Promise<Result<IVideoCategoryEntity[]>>} `ok(IVideoCategoryEntity[])` on success, `err(Failure)` on failure
     */
    async execute(): Promise<Result<IVideoCategoryEntity[]>> {
        return this.videosRepository.getVideoCategories();
    }
}
