import type {
    IShortsRepositoryPort,
    IShortVideoActivityQuery
} from "@/modules/shorts/application/repositories/shorts.repository.port";
import type { IShortVideoActivityPage } from "@/modules/shorts/domain/entities/IShortVideoActivityPage";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetOwnSharedShortsUseCase
 * @extends {IResultUseCase<IShortVideoActivityQuery, IShortVideoActivityPage>}
 */
interface IGetOwnSharedShortsUseCase
    extends IResultUseCase<IShortVideoActivityQuery, IShortVideoActivityPage> {}

/**
 * GetOwnSharedShortsUseCase
 *
 * @class GetOwnSharedShortsUseCase
 * @implements {IGetOwnSharedShortsUseCase}
 *
 * @description
 * Pages through the signed-in user's shared shorts via the shorts repository,
 * newest first. Returns the repository's `Result<IShortVideoActivityPage>` unchanged.
 */
export class GetOwnSharedShortsUseCase implements IGetOwnSharedShortsUseCase {
    private readonly shortsRepository: IShortsRepositoryPort;

    /**
     * @param deps - Awilix cradle slice.
     * @param deps.shortsRepository - The shorts repository (injected).
     */
    constructor({ shortsRepository }: { shortsRepository: IShortsRepositoryPort }) {
        this.shortsRepository = shortsRepository;
    }

    /**
     * Executes the get-own-shared-shorts use case.
     *
     * @param query - Zero-based paging.
     * @returns {Promise<Result<IShortVideoActivityPage>>} The mapped page or a failure.
     */
    execute(query: IShortVideoActivityQuery): Promise<Result<IShortVideoActivityPage>> {
        return this.shortsRepository.getOwnSharedShorts(query);
    }
}
