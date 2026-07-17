import type { IShortsRepositoryPort } from "@/modules/shorts/application/repositories/shorts.repository.port";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IRecordShortViewUseCase
 * @extends {IResultUseCase<string, boolean>}
 */
interface IRecordShortViewUseCase extends IResultUseCase<string, boolean> {}

/**
 * RecordShortViewUseCase
 *
 * @class RecordShortViewUseCase
 * @implements {IRecordShortViewUseCase}
 *
 * @description
 * Records a view event against a short. The engagement gate and per-session
 * dedup live in the player; this use case only forwards the call.
 */
export class RecordShortViewUseCase implements IRecordShortViewUseCase {
    private readonly shortsRepository: IShortsRepositoryPort;

    /**
     * @param deps - Awilix cradle slice.
     * @param deps.shortsRepository - The shorts repository (injected).
     */
    constructor({ shortsRepository }: { shortsRepository: IShortsRepositoryPort }) {
        this.shortsRepository = shortsRepository;
    }

    /**
     * Executes the record-short-view use case.
     *
     * @param shortId - The short viewed.
     * @returns {Promise<Result<boolean>>} The success flag or a failure.
     */
    execute(shortId: string): Promise<Result<boolean>> {
        return this.shortsRepository.recordShortView(shortId);
    }
}
