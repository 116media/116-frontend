import type { IShortsRepositoryPort } from "@/modules/shorts/application/repositories/shorts.repository.port";
import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetShortBySlugUseCase
 * @extends {IResultUseCase<string, IShortVideoEntity>}
 */
interface IGetShortBySlugUseCase extends IResultUseCase<string, IShortVideoEntity> {}

/**
 * GetShortBySlugUseCase
 *
 * @class GetShortBySlugUseCase
 * @implements {IGetShortBySlugUseCase}
 *
 * @description
 * Fetches one active short by its slug for a deep-link surface.
 */
export class GetShortBySlugUseCase implements IGetShortBySlugUseCase {
    private readonly shortsRepository: IShortsRepositoryPort;

    /**
     * @param deps - Awilix cradle slice.
     * @param deps.shortsRepository - The shorts repository (injected).
     */
    constructor({ shortsRepository }: { shortsRepository: IShortsRepositoryPort }) {
        this.shortsRepository = shortsRepository;
    }

    /**
     * Executes the get-short-by-slug use case.
     *
     * @param slug - The short's slug.
     * @returns {Promise<Result<IShortVideoEntity>>} The mapped short or a failure.
     */
    execute(slug: string): Promise<Result<IShortVideoEntity>> {
        return this.shortsRepository.getShortBySlug(slug);
    }
}
