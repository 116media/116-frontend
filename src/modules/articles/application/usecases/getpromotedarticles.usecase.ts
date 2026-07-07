import type { IArticlesRepositoryPort } from "@/modules/articles/application/repositories/articles.repository.port";
import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetPromotedArticlesUseCase
 * @extends {IResultUseCase<void, IArticleSummaryEntity[]>}
 */
interface IGetPromotedArticlesUseCase extends IResultUseCase<void, IArticleSummaryEntity[]> {}

/**
 * Use case for fetching promoted articles.
 *
 * @class GetPromotedArticlesUseCase
 * @implements {IGetPromotedArticlesUseCase}
 *
 * @description
 * Retrieves the list of currently promoted articles for display
 * in the public mega menu via the articles repository.
 */
export class GetPromotedArticlesUseCase implements IGetPromotedArticlesUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the get promoted articles use case.
     *
     * @returns {Promise<Result<IArticleSummaryEntity[]>>} `ok(IArticleSummaryEntity[])` on success, `err(Failure)` on failure
     */
    async execute(): Promise<Result<IArticleSummaryEntity[]>> {
        return this.articlesRepository.getPromotedArticles();
    }
}
