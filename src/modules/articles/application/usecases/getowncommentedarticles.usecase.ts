import type {
    IArticlesRepositoryPort,
    IOwnCommentedArticlesQuery
} from "@/modules/articles/application/repositories/articles.repository.port";
import type { ICommentedArticlePage } from "@/modules/articles/domain/entities/ICommentedArticleEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetOwnCommentedArticlesUseCase
 * @extends {IResultUseCase<IOwnCommentedArticlesQuery, ICommentedArticlePage>}
 */
interface IGetOwnCommentedArticlesUseCase
    extends IResultUseCase<IOwnCommentedArticlesQuery, ICommentedArticlePage> {}

/**
 * Use case for fetching the articles the authenticated user has commented on.
 *
 * @class GetOwnCommentedArticlesUseCase
 * @implements {IGetOwnCommentedArticlesUseCase}
 *
 * @description
 * Pages through the caller's commented-on articles via the articles repository, newest
 * activity first. Returns the repository's `Result<ICommentedArticlePage>` unchanged.
 */
export class GetOwnCommentedArticlesUseCase implements IGetOwnCommentedArticlesUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the get-own-commented-articles use case.
     *
     * @param query - Paging
     * @returns {Promise<Result<ICommentedArticlePage>>} `ok(ICommentedArticlePage)` on success, `err(Failure)` on failure
     */
    async execute(query: IOwnCommentedArticlesQuery): Promise<Result<ICommentedArticlePage>> {
        return this.articlesRepository.getOwnCommentedArticles(query);
    }
}
