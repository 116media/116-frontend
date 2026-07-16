import type {
    IArticlesRepositoryPort,
    IOwnSharedArticlesQuery
} from "@/modules/articles/application/repositories/articles.repository.port";
import type { IArticleActivityPage } from "@/modules/articles/domain/entities/IArticleActivityEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetOwnSharedArticlesUseCase
 * @extends {IResultUseCase<IOwnSharedArticlesQuery, IArticleActivityPage>}
 */
interface IGetOwnSharedArticlesUseCase
    extends IResultUseCase<IOwnSharedArticlesQuery, IArticleActivityPage> {}

/**
 * Use case for fetching the articles the authenticated user has shared.
 *
 * @class GetOwnSharedArticlesUseCase
 * @implements {IGetOwnSharedArticlesUseCase}
 *
 * @description
 * Pages through the caller's shared articles via the articles repository, newest share
 * first. Returns the repository's `Result<IArticleActivityPage>` unchanged.
 */
export class GetOwnSharedArticlesUseCase implements IGetOwnSharedArticlesUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the get-own-shared-articles use case.
     *
     * @param query - Paging
     * @returns {Promise<Result<IArticleActivityPage>>} `ok(IArticleActivityPage)` on success, `err(Failure)` on failure
     */
    async execute(query: IOwnSharedArticlesQuery): Promise<Result<IArticleActivityPage>> {
        return this.articlesRepository.getOwnSharedArticles(query);
    }
}
