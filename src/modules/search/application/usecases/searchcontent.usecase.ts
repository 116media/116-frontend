import type {
    ISearchContentInput,
    ISearchRepositoryPort
} from "@/modules/search/application/repositories/search.repository.port";
import type { ISearchResultsEntity } from "@/modules/search/domain/entities/ISearchResultsEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface ISearchContentUseCase
 * @extends {IResultUseCase<ISearchContentInput, ISearchResultsEntity>}
 */
interface ISearchContentUseCase extends IResultUseCase<ISearchContentInput, ISearchResultsEntity> {}

/**
 * SearchContentUseCase
 *
 * @class SearchContentUseCase
 * @implements {ISearchContentUseCase}
 *
 * @description
 * Fetches one ranked page of cross-content search results together with the
 * per-scope counts the tabs label themselves from.
 */
export class SearchContentUseCase implements ISearchContentUseCase {
    private readonly searchRepository: ISearchRepositoryPort;

    /**
     * @param deps - Awilix cradle slice.
     * @param deps.searchRepository - The search repository (injected).
     */
    constructor({
        searchRepository
    }: {
        searchRepository: ISearchRepositoryPort;
    }) {
        this.searchRepository = searchRepository;
    }

    /**
     * Executes the search use case.
     *
     * @param input - Query, scope and pagination.
     * @returns {Promise<Result<ISearchResultsEntity>>} The mapped page or a failure.
     */
    execute(input: ISearchContentInput): Promise<Result<ISearchResultsEntity>> {
        return this.searchRepository.search(input);
    }
}
