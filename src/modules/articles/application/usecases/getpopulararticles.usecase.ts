import type {
    IArticlesRepositoryPort,
    IPopularArticlesQuery
} from "@/modules/articles/application/repositories/articles.repository.port";
import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetPopularArticlesUseCase
 * @extends {IResultUseCase<IPopularArticlesQuery, IArticleSummaryEntity[]>}
 */
interface IGetPopularArticlesUseCase
    extends IResultUseCase<IPopularArticlesQuery, IArticleSummaryEntity[]> {}

/**
 * Use case for fetching the popularity-ranked article list.
 *
 * @class GetPopularArticlesUseCase
 * @implements {IGetPopularArticlesUseCase}
 *
 * @description
 * Fetches the most popular published articles — ranked server-side by weighted
 * engagement — via the articles repository, optionally excluding the article currently
 * open. Returns the repository's `Result<IArticleSummaryEntity[]>` unchanged.
 */
export class GetPopularArticlesUseCase implements IGetPopularArticlesUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param {IArticlesRepositoryPort} articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the get-popular-articles use case.
     *
     * @param {IPopularArticlesQuery} query - Limit plus optional exclusion and category scope
     * @returns {Promise<Result<IArticleSummaryEntity[]>>} `ok(IArticleSummaryEntity[])` on success, `err(Failure)` on failure
     */
    async execute(query: IPopularArticlesQuery): Promise<Result<IArticleSummaryEntity[]>> {
        return this.articlesRepository.getPopularArticles(query);
    }
}
