import type { IArticlesRepositoryPort } from "@/modules/articles/application/repositories/articles.repository.port";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface ILikeArticleCommentUseCase
 * @extends {IResultUseCase<string, boolean>}
 */
interface ILikeArticleCommentUseCase extends IResultUseCase<string, boolean> {}

/**
 * Use case for liking an article comment.
 *
 * @class LikeArticleCommentUseCase
 * @implements {ILikeArticleCommentUseCase}
 *
 * @description
 * Records the authenticated user's like on a comment via the articles repository.
 * Returns the repository's `Result<boolean>` unchanged.
 */
export class LikeArticleCommentUseCase implements ILikeArticleCommentUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the like-article-comment use case.
     *
     * @param commentId - The comment to like (UUID)
     * @returns {Promise<Result<boolean>>} `ok(boolean)` on success, `err(Failure)` on failure
     */
    async execute(commentId: string): Promise<Result<boolean>> {
        return this.articlesRepository.likeArticleComment(commentId);
    }
}
