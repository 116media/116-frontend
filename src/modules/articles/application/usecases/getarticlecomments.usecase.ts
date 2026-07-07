import type {
    IArticleCommentsQuery,
    IArticlesRepositoryPort
} from "@/modules/articles/application/repositories/articles.repository.port";
import type { IArticleCommentPage } from "@/modules/articles/domain/entities/IArticleCommentPage";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetArticleCommentsUseCase
 * @extends {IResultUseCase<IArticleCommentsQuery, IArticleCommentPage>}
 */
interface IGetArticleCommentsUseCase
    extends IResultUseCase<IArticleCommentsQuery, IArticleCommentPage> {}

/**
 * Use case for fetching one page of an article's comments.
 *
 * @class GetArticleCommentsUseCase
 * @implements {IGetArticleCommentsUseCase}
 *
 * @description
 * Fetches one page of comments for an article via the articles repository. Returns the
 * repository's `Result<IArticleCommentPage>` unchanged.
 */
export class GetArticleCommentsUseCase implements IGetArticleCommentsUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param {IArticlesRepositoryPort} articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the get-article-comments use case.
     *
     * @param {IArticleCommentsQuery} query - Article id plus paging
     * @returns {Promise<Result<IArticleCommentPage>>} `ok(IArticleCommentPage)` on success, `err(Failure)` on failure
     */
    async execute(query: IArticleCommentsQuery): Promise<Result<IArticleCommentPage>> {
        return this.articlesRepository.getArticleComments(query);
    }
}
