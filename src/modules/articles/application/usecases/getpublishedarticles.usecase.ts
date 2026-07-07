import type {
    IArticlesRepositoryPort,
    IPublishedArticlesQuery
} from "@/modules/articles/application/repositories/articles.repository.port";
import type { IArticlePage } from "@/modules/articles/domain/entities/IArticlePage";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetPublishedArticlesUseCase
 * @extends {IResultUseCase<IPublishedArticlesQuery, IArticlePage>}
 */
interface IGetPublishedArticlesUseCase
    extends IResultUseCase<IPublishedArticlesQuery, IArticlePage> {}

/**
 * Use case for fetching one page of published articles.
 *
 * @class GetPublishedArticlesUseCase
 * @implements {IGetPublishedArticlesUseCase}
 *
 * @description
 * Fetches one page of published articles for the public feed. Delegates to
 * the articles repository and returns its `Result<IArticlePage>` unchanged.
 */
export class GetPublishedArticlesUseCase implements IGetPublishedArticlesUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the get published articles use case.
     *
     * @param query - Paging plus optional filters
     * @returns {Promise<Result<IArticlePage>>} `ok(IArticlePage)` on success, `err(Failure)` on failure
     */
    async execute(query: IPublishedArticlesQuery): Promise<Result<IArticlePage>> {
        return this.articlesRepository.getPublishedArticles(query);
    }
}
