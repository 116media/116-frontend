import type { IArticlesRepositoryPort } from "@/modules/articles/application/repositories/articles.repository.port";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IUnbookmarkArticleUseCase
 * @extends {IResultUseCase<string, boolean>}
 */
interface IUnbookmarkArticleUseCase extends IResultUseCase<string, boolean> {}

/**
 * Use case for removing a bookmark from an article.
 *
 * @class UnbookmarkArticleUseCase
 * @implements {IUnbookmarkArticleUseCase}
 *
 * @description
 * Removes the current user's bookmark from one article via the articles
 * repository. Returns the repository's `Result<boolean>` (success flag)
 * unchanged.
 */
export class UnbookmarkArticleUseCase implements IUnbookmarkArticleUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param {IArticlesRepositoryPort} articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the unbookmark article use case.
     *
     * @param {string} articleId - The article to unbookmark
     * @returns {Promise<Result<boolean>>} `ok(boolean)` success flag on success, `err(Failure)` on failure
     */
    async execute(articleId: string): Promise<Result<boolean>> {
        return this.articlesRepository.unbookmarkArticle(articleId);
    }
}
