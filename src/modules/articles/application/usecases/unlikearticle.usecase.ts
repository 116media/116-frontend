import type { IArticlesRepositoryPort } from "@/modules/articles/application/repositories/articles.repository.port";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IUnlikeArticleUseCase
 * @extends {IResultUseCase<string, boolean>}
 */
interface IUnlikeArticleUseCase extends IResultUseCase<string, boolean> {}

/**
 * Use case for removing a like from an article.
 *
 * @class UnlikeArticleUseCase
 * @implements {IUnlikeArticleUseCase}
 *
 * @description
 * Removes the current user's like from one article via the articles
 * repository. Returns the repository's `Result<boolean>` (success flag)
 * unchanged.
 */
export class UnlikeArticleUseCase implements IUnlikeArticleUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the unlike article use case.
     *
     * @param articleId - The article to unlike
     * @returns {Promise<Result<boolean>>} `ok(boolean)` success flag on success, `err(Failure)` on failure
     */
    async execute(articleId: string): Promise<Result<boolean>> {
        return this.articlesRepository.unlikeArticle(articleId);
    }
}
