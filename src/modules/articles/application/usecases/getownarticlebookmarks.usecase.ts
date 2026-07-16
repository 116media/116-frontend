import type {
    IArticlesRepositoryPort,
    IMyArticleBookmarksQuery
} from "@/modules/articles/application/repositories/articles.repository.port";
import type { IArticleBookmarkPage } from "@/modules/articles/domain/entities/IArticleBookmarkEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetOwnArticleBookmarksUseCase
 * @extends {IResultUseCase<IMyArticleBookmarksQuery, IArticleBookmarkPage>}
 */
interface IGetOwnArticleBookmarksUseCase
    extends IResultUseCase<IMyArticleBookmarksQuery, IArticleBookmarkPage> {}

/**
 * Use case for fetching the authenticated user's bookmarked articles.
 *
 * @class GetOwnArticleBookmarksUseCase
 * @implements {IGetOwnArticleBookmarksUseCase}
 *
 * @description
 * Pages through the caller's bookmarks via the articles repository, newest first.
 * Returns the repository's `Result<IArticleBookmarkPage>` unchanged.
 */
export class GetOwnArticleBookmarksUseCase implements IGetOwnArticleBookmarksUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the get-own-article-bookmarks use case.
     *
     * @param query - Paging
     * @returns {Promise<Result<IArticleBookmarkPage>>} `ok(IArticleBookmarkPage)` on success, `err(Failure)` on failure
     */
    async execute(query: IMyArticleBookmarksQuery): Promise<Result<IArticleBookmarkPage>> {
        return this.articlesRepository.getOwnArticleBookmarks(query);
    }
}
