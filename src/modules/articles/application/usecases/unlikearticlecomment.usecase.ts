import type { IArticlesRepositoryPort } from "@/modules/articles/application/repositories/articles.repository.port";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IUnlikeArticleCommentUseCase
 * @extends {IResultUseCase<string, boolean>}
 */
interface IUnlikeArticleCommentUseCase extends IResultUseCase<string, boolean> {}

/**
 * Use case for removing a like from an article comment.
 *
 * @class UnlikeArticleCommentUseCase
 * @implements {IUnlikeArticleCommentUseCase}
 *
 * @description
 * Removes the authenticated user's like from a comment via the articles repository.
 * Returns the repository's `Result<boolean>` unchanged.
 */
export class UnlikeArticleCommentUseCase implements IUnlikeArticleCommentUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the unlike-article-comment use case.
     *
     * @param commentId - The comment to unlike (UUID)
     * @returns {Promise<Result<boolean>>} `ok(boolean)` on success, `err(Failure)` on failure
     */
    async execute(commentId: string): Promise<Result<boolean>> {
        return this.articlesRepository.unlikeArticleComment(commentId);
    }
}
