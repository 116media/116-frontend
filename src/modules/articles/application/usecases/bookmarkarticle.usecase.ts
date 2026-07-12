import type { IArticlesRepositoryPort } from "@/modules/articles/application/repositories/articles.repository.port";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IBookmarkArticleUseCase
 * @extends {IResultUseCase<string, boolean>}
 */
interface IBookmarkArticleUseCase extends IResultUseCase<string, boolean> {}

/**
 * Use case for bookmarking an article.
 *
 * @class BookmarkArticleUseCase
 * @implements {IBookmarkArticleUseCase}
 *
 * @description
 * Bookmarks one article via the articles repository. Returns the
 * repository's `Result<boolean>` (success flag) unchanged.
 */
export class BookmarkArticleUseCase implements IBookmarkArticleUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the bookmark article use case.
     *
     * @param articleId - The article to bookmark
     * @returns {Promise<Result<boolean>>} `ok(boolean)` success flag on success, `err(Failure)` on failure
     */
    async execute(articleId: string): Promise<Result<boolean>> {
        return this.articlesRepository.bookmarkArticle(articleId);
    }
}
