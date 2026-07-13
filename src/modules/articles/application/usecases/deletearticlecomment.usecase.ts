import type {
    IArticlesRepositoryPort,
    IDeleteArticleCommentInput
} from "@/modules/articles/application/repositories/articles.repository.port";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IDeleteArticleCommentUseCase
 * @extends {IResultUseCase<IDeleteArticleCommentInput, boolean>}
 */
interface IDeleteArticleCommentUseCase
    extends IResultUseCase<IDeleteArticleCommentInput, boolean> {}

/**
 * Use case for deleting the authenticated user's own article comment.
 *
 * @class DeleteArticleCommentUseCase
 * @implements {IDeleteArticleCommentUseCase}
 *
 * @description
 * Soft-deletes a comment via the articles repository; the backend enforces ownership.
 * Returns the repository's `Result<boolean>` unchanged.
 */
export class DeleteArticleCommentUseCase implements IDeleteArticleCommentUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the delete-article-comment use case.
     *
     * @param input - Article id plus the comment id
     * @returns {Promise<Result<boolean>>} `ok(boolean)` on success, `err(Failure)` on failure
     */
    async execute(input: IDeleteArticleCommentInput): Promise<Result<boolean>> {
        return this.articlesRepository.deleteArticleComment(input);
    }
}
