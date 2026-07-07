import type {
    IAddArticleCommentInput,
    IArticlesRepositoryPort
} from "@/modules/articles/application/repositories/articles.repository.port";
import type { IArticleCommentEntity } from "@/modules/articles/domain/entities/IArticleCommentEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IAddArticleCommentUseCase
 * @extends {IResultUseCase<IAddArticleCommentInput, IArticleCommentEntity>}
 */
interface IAddArticleCommentUseCase
    extends IResultUseCase<IAddArticleCommentInput, IArticleCommentEntity> {}

/**
 * Use case for adding a comment to an article.
 *
 * @class AddArticleCommentUseCase
 * @implements {IAddArticleCommentUseCase}
 *
 * @description
 * Posts a comment on an article via the articles repository. Returns the repository's
 * `Result<IArticleCommentEntity>` unchanged.
 */
export class AddArticleCommentUseCase implements IAddArticleCommentUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the add-article-comment use case.
     *
     * @param input - Article id plus the comment body
     * @returns {Promise<Result<IArticleCommentEntity>>} `ok(IArticleCommentEntity)` on success, `err(Failure)` on failure
     */
    async execute(input: IAddArticleCommentInput): Promise<Result<IArticleCommentEntity>> {
        return this.articlesRepository.addArticleComment(input);
    }
}
