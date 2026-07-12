import type { IArticlesRepositoryPort } from "@/modules/articles/application/repositories/articles.repository.port";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface ILikeArticleUseCase
 * @extends {IResultUseCase<string, boolean>}
 */
interface ILikeArticleUseCase extends IResultUseCase<string, boolean> {}

/**
 * Use case for liking an article.
 *
 * @class LikeArticleUseCase
 * @implements {ILikeArticleUseCase}
 *
 * @description
 * Likes one article via the articles repository. Returns the repository's
 * `Result<boolean>` (success flag) unchanged.
 */
export class LikeArticleUseCase implements ILikeArticleUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the like article use case.
     *
     * @param articleId - The article to like
     * @returns {Promise<Result<boolean>>} `ok(boolean)` success flag on success, `err(Failure)` on failure
     */
    async execute(articleId: string): Promise<Result<boolean>> {
        return this.articlesRepository.likeArticle(articleId);
    }
}
