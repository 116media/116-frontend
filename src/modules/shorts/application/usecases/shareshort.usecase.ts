import type {
    IShareShortInput,
    IShortsRepositoryPort
} from "@/modules/shorts/application/repositories/shorts.repository.port";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IShareShortUseCase
 * @extends {IResultUseCase<IShareShortInput, boolean>}
 */
interface IShareShortUseCase extends IResultUseCase<IShareShortInput, boolean> {}

/**
 * ShareShortUseCase
 *
 * @class ShareShortUseCase
 * @implements {IShareShortUseCase}
 *
 * @description
 * Records a share event for one short, tagged with the share channel for
 * per-channel analytics.
 */
export class ShareShortUseCase implements IShareShortUseCase {
    private readonly shortsRepository: IShortsRepositoryPort;

    /**
     * @param deps - Awilix cradle slice.
     * @param deps.shortsRepository - The shorts repository (injected).
     */
    constructor({ shortsRepository }: { shortsRepository: IShortsRepositoryPort }) {
        this.shortsRepository = shortsRepository;
    }

    /**
     * Executes the share-short use case.
     *
     * @param input - The short id and optional channel.
     * @returns {Promise<Result<boolean>>} The success flag or a failure.
     */
    execute(input: IShareShortInput): Promise<Result<boolean>> {
        return this.shortsRepository.shareShort(input);
    }
}
