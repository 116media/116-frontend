import type { IVideosRepositoryPort } from "@/modules/videos/application/repositories/videos.repository.port";
import type { IVideoTagEntity } from "@/modules/videos/domain/entities/IVideoTagEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetAllVideoTagsUseCase
 * @extends {IResultUseCase<string | undefined, IVideoTagEntity[]>}
 */
interface IGetAllVideoTagsUseCase extends IResultUseCase<string | undefined, IVideoTagEntity[]> {}

/**
 * Use case for fetching every video tag.
 *
 * @class GetAllVideoTagsUseCase
 * @implements {IGetAllVideoTagsUseCase}
 *
 * @description
 * Retrieves the tags scoped to the Video content type, optionally filtered by
 * a search term, for the browse toolbar's "All tags" popover.
 */
export class GetAllVideoTagsUseCase implements IGetAllVideoTagsUseCase {
    private readonly videosRepository: IVideosRepositoryPort;

    /**
     * @param videosRepository - Repository for videos operations (injected)
     */
    constructor({ videosRepository }: { videosRepository: IVideosRepositoryPort }) {
        this.videosRepository = videosRepository;
    }

    /**
     * Executes the get all video tags use case.
     *
     * @param search - Optional tag search term
     * @returns {Promise<Result<IVideoTagEntity[]>>} `ok(IVideoTagEntity[])` on success, `err(Failure)` on failure
     */
    async execute(search?: string): Promise<Result<IVideoTagEntity[]>> {
        return this.videosRepository.getAllVideoTags(search);
    }
}
