import type {
    IArticlesRepositoryPort,
    ICommentRepliesQuery
} from "@/modules/articles/application/repositories/articles.repository.port";
import type { IArticleCommentPage } from "@/modules/articles/domain/entities/IArticleCommentPage";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetCommentRepliesUseCase
 * @extends {IResultUseCase<ICommentRepliesQuery, IArticleCommentPage>}
 */
interface IGetCommentRepliesUseCase
    extends IResultUseCase<ICommentRepliesQuery, IArticleCommentPage> {}

/**
 * Use case for fetching one page of a top-level comment's replies.
 *
 * @class GetCommentRepliesUseCase
 * @implements {IGetCommentRepliesUseCase}
 *
 * @description
 * Pages through a comment's reply thread via the articles repository. Returns the
 * repository's `Result<IArticleCommentPage>` unchanged.
 */
export class GetCommentRepliesUseCase implements IGetCommentRepliesUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the get-comment-replies use case.
     *
     * @param query - Comment id plus paging
     * @returns {Promise<Result<IArticleCommentPage>>} `ok(IArticleCommentPage)` on success, `err(Failure)` on failure
     */
    async execute(query: ICommentRepliesQuery): Promise<Result<IArticleCommentPage>> {
        return this.articlesRepository.getCommentReplies(query);
    }
}
