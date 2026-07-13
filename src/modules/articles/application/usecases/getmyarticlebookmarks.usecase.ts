import type {
    IArticlesRepositoryPort,
    IMyArticleBookmarksQuery
} from "@/modules/articles/application/repositories/articles.repository.port";
import type { IArticlePage } from "@/modules/articles/domain/entities/IArticlePage";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetMyArticleBookmarksUseCase
 * @extends {IResultUseCase<IMyArticleBookmarksQuery, IArticlePage>}
 */
interface IGetMyArticleBookmarksUseCase
    extends IResultUseCase<IMyArticleBookmarksQuery, IArticlePage> {}

/**
 * Use case for fetching the authenticated user's bookmarked articles.
 *
 * @class GetMyArticleBookmarksUseCase
 * @implements {IGetMyArticleBookmarksUseCase}
 *
 * @description
 * Pages through the caller's bookmarks via the articles repository, newest first.
 * Returns the repository's `Result<IArticlePage>` unchanged.
 */
export class GetMyArticleBookmarksUseCase implements IGetMyArticleBookmarksUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the get-my-article-bookmarks use case.
     *
     * @param query - Paging
     * @returns {Promise<Result<IArticlePage>>} `ok(IArticlePage)` on success, `err(Failure)` on failure
     */
    async execute(query: IMyArticleBookmarksQuery): Promise<Result<IArticlePage>> {
        return this.articlesRepository.getMyArticleBookmarks(query);
    }
}
