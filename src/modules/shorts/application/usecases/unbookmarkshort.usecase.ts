import type { IShortsRepositoryPort } from "@/modules/shorts/application/repositories/shorts.repository.port";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IUnbookmarkShortUseCase
 * @extends {IResultUseCase<string, boolean>}
 */
interface IUnbookmarkShortUseCase extends IResultUseCase<string, boolean> {}

/**
 * UnbookmarkShortUseCase
 *
 * @class UnbookmarkShortUseCase
 * @implements {IUnbookmarkShortUseCase}
 *
 * @description
 * Removes the signed-in user's bookmark from a short via the shorts repository.
 */
export class UnbookmarkShortUseCase implements IUnbookmarkShortUseCase {
    private readonly shortsRepository: IShortsRepositoryPort;

    /**
     * @param deps - Awilix cradle slice.
     * @param deps.shortsRepository - The shorts repository (injected).
     */
    constructor({ shortsRepository }: { shortsRepository: IShortsRepositoryPort }) {
        this.shortsRepository = shortsRepository;
    }

    /**
     * Executes the unbookmark-short use case.
     *
     * @param shortId - The short to unbookmark.
     * @returns {Promise<Result<boolean>>} The success flag or a failure.
     */
    execute(shortId: string): Promise<Result<boolean>> {
        return this.shortsRepository.unbookmarkShort(shortId);
    }
}
