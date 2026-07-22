import type {
    IArticlesRepositoryPort,
    IOwnArticleCommentsQuery
} from "@/modules/articles/application/repositories/articles.repository.port";
import type { IMyArticleCommentsPage } from "@/modules/articles/domain/entities/IMyArticleCommentsPage";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetOwnCommentsForArticleUseCase
 * @extends {IResultUseCase<IOwnArticleCommentsQuery, IMyArticleCommentsPage>}
 */
interface IGetOwnCommentsForArticleUseCase
    extends IResultUseCase<IOwnArticleCommentsQuery, IMyArticleCommentsPage> {}

/**
 * Use case for fetching the authenticated user's own comments on one article.
 *
 * @class GetOwnCommentsForArticleUseCase
 * @implements {IGetOwnCommentsForArticleUseCase}
 *
 * @description
 * Pages through the caller's own comments on a single article via the articles
 * repository, newest first. Returns the repository's `Result<IMyArticleCommentsPage>`
 * unchanged.
 */
export class GetOwnCommentsForArticleUseCase implements IGetOwnCommentsForArticleUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the get-own-comments-for-article use case.
     *
     * @param query - Article id plus paging
     * @returns {Promise<Result<IMyArticleCommentsPage>>} `ok(IMyArticleCommentsPage)` on success, `err(Failure)` on failure
     */
    async execute(query: IOwnArticleCommentsQuery): Promise<Result<IMyArticleCommentsPage>> {
        return this.articlesRepository.getOwnCommentsForArticle(query);
    }
}
