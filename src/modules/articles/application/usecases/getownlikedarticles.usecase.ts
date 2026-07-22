import type {
    IArticlesRepositoryPort,
    IOwnLikedArticlesQuery
} from "@/modules/articles/application/repositories/articles.repository.port";
import type { IArticleActivityPage } from "@/modules/articles/domain/entities/IArticleActivityEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetOwnLikedArticlesUseCase
 * @extends {IResultUseCase<IOwnLikedArticlesQuery, IArticleActivityPage>}
 */
interface IGetOwnLikedArticlesUseCase
    extends IResultUseCase<IOwnLikedArticlesQuery, IArticleActivityPage> {}

/**
 * Use case for fetching the articles the authenticated user has liked.
 *
 * @class GetOwnLikedArticlesUseCase
 * @implements {IGetOwnLikedArticlesUseCase}
 *
 * @description
 * Pages through the caller's liked articles via the articles repository, newest like
 * first. Returns the repository's `Result<IArticleActivityPage>` unchanged.
 */
export class GetOwnLikedArticlesUseCase implements IGetOwnLikedArticlesUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the get-own-liked-articles use case.
     *
     * @param query - Paging
     * @returns {Promise<Result<IArticleActivityPage>>} `ok(IArticleActivityPage)` on success, `err(Failure)` on failure
     */
    async execute(query: IOwnLikedArticlesQuery): Promise<Result<IArticleActivityPage>> {
        return this.articlesRepository.getOwnLikedArticles(query);
    }
}
