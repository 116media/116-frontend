import type { IShortsRepositoryPort } from "@/modules/shorts/application/repositories/shorts.repository.port";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IUnlikeShortUseCase
 * @extends {IResultUseCase<string, boolean>}
 */
interface IUnlikeShortUseCase extends IResultUseCase<string, boolean> {}

/**
 * UnlikeShortUseCase
 *
 * @class UnlikeShortUseCase
 * @implements {IUnlikeShortUseCase}
 *
 * @description
 * Removes the signed-in user's like from a short via the shorts repository.
 */
export class UnlikeShortUseCase implements IUnlikeShortUseCase {
    private readonly shortsRepository: IShortsRepositoryPort;

    /**
     * @param deps - Awilix cradle slice.
     * @param deps.shortsRepository - The shorts repository (injected).
     */
    constructor({ shortsRepository }: { shortsRepository: IShortsRepositoryPort }) {
        this.shortsRepository = shortsRepository;
    }

    /**
     * Executes the unlike-short use case.
     *
     * @param shortId - The short to unlike.
     * @returns {Promise<Result<boolean>>} The success flag or a failure.
     */
    execute(shortId: string): Promise<Result<boolean>> {
        return this.shortsRepository.unlikeShort(shortId);
    }
}
