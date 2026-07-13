import type {
    IAddCommentReplyInput,
    IArticlesRepositoryPort
} from "@/modules/articles/application/repositories/articles.repository.port";
import type { IArticleCommentEntity } from "@/modules/articles/domain/entities/IArticleCommentEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IAddCommentReplyUseCase
 * @extends {IResultUseCase<IAddCommentReplyInput, IArticleCommentEntity>}
 */
interface IAddCommentReplyUseCase
    extends IResultUseCase<IAddCommentReplyInput, IArticleCommentEntity> {}

/**
 * Use case for replying to a top-level article comment.
 *
 * @class AddCommentReplyUseCase
 * @implements {IAddCommentReplyUseCase}
 *
 * @description
 * Posts a single-level reply via the articles repository; the backend rejects replies to
 * replies. Returns the repository's `Result<IArticleCommentEntity>` unchanged.
 */
export class AddCommentReplyUseCase implements IAddCommentReplyUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the add-comment-reply use case.
     *
     * @param input - Article id, parent comment id, and the reply body
     * @returns {Promise<Result<IArticleCommentEntity>>} `ok(IArticleCommentEntity)` on success, `err(Failure)` on failure
     */
    async execute(input: IAddCommentReplyInput): Promise<Result<IArticleCommentEntity>> {
        return this.articlesRepository.addCommentReply(input);
    }
}
