import type { IShortsRepositoryPort } from "@/modules/shorts/application/repositories/shorts.repository.port";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface ILikeShortUseCase
 * @extends {IResultUseCase<string, boolean>}
 */
interface ILikeShortUseCase extends IResultUseCase<string, boolean> {}

/**
 * LikeShortUseCase
 *
 * @class LikeShortUseCase
 * @implements {ILikeShortUseCase}
 *
 * @description
 * Records the signed-in user's like on a short via the shorts repository.
 */
export class LikeShortUseCase implements ILikeShortUseCase {
    private readonly shortsRepository: IShortsRepositoryPort;

    /**
     * @param deps - Awilix cradle slice.
     * @param deps.shortsRepository - The shorts repository (injected).
     */
    constructor({ shortsRepository }: { shortsRepository: IShortsRepositoryPort }) {
        this.shortsRepository = shortsRepository;
    }

    /**
     * Executes the like-short use case.
     *
     * @param shortId - The short to like.
     * @returns {Promise<Result<boolean>>} The success flag or a failure.
     */
    execute(shortId: string): Promise<Result<boolean>> {
        return this.shortsRepository.likeShort(shortId);
    }
}
