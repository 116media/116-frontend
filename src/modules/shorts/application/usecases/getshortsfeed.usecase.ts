import type {
    IShortsFeedQuery,
    IShortsRepositoryPort
} from "@/modules/shorts/application/repositories/shorts.repository.port";
import type { IShortVideoFeedPage } from "@/modules/shorts/domain/entities/IShortVideoFeedPage";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetShortsFeedUseCase
 * @extends {IResultUseCase<IShortsFeedQuery, IShortVideoFeedPage>}
 */
interface IGetShortsFeedUseCase extends IResultUseCase<IShortsFeedQuery, IShortVideoFeedPage> {}

/**
 * GetShortsFeedUseCase
 *
 * @class GetShortsFeedUseCase
 * @implements {IGetShortsFeedUseCase}
 *
 * @description
 * Fetches one cursor page of the seeded "for you" feed backing the homepage strip
 * and the vertical player.
 */
export class GetShortsFeedUseCase implements IGetShortsFeedUseCase {
    private readonly shortsRepository: IShortsRepositoryPort;

    /**
     * @param deps - Awilix cradle slice.
     * @param deps.shortsRepository - The shorts repository (injected).
     */
    constructor({ shortsRepository }: { shortsRepository: IShortsRepositoryPort }) {
        this.shortsRepository = shortsRepository;
    }

    /**
     * Executes the get-shorts-feed use case.
     *
     * @param query - Cursor + page size.
     * @returns {Promise<Result<IShortVideoFeedPage>>} The mapped page or a failure.
     */
    execute(query: IShortsFeedQuery): Promise<Result<IShortVideoFeedPage>> {
        return this.shortsRepository.getShortsFeed(query);
    }
}
