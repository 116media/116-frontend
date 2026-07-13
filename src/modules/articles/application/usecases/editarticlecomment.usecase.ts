import type {
    IArticlesRepositoryPort,
    IEditArticleCommentInput
} from "@/modules/articles/application/repositories/articles.repository.port";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IEditArticleCommentUseCase
 * @extends {IResultUseCase<IEditArticleCommentInput, boolean>}
 */
interface IEditArticleCommentUseCase extends IResultUseCase<IEditArticleCommentInput, boolean> {}

/**
 * Use case for editing the authenticated user's own article comment.
 *
 * @class EditArticleCommentUseCase
 * @implements {IEditArticleCommentUseCase}
 *
 * @description
 * Replaces a comment's body via the articles repository; the backend enforces ownership.
 * Returns the repository's `Result<boolean>` unchanged.
 */
export class EditArticleCommentUseCase implements IEditArticleCommentUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the edit-article-comment use case.
     *
     * @param input - Article id, comment id, and the replacement body
     * @returns {Promise<Result<boolean>>} `ok(boolean)` on success, `err(Failure)` on failure
     */
    async execute(input: IEditArticleCommentInput): Promise<Result<boolean>> {
        return this.articlesRepository.editArticleComment(input);
    }
}
