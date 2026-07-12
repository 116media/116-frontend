import type { IArticlesRepositoryPort } from "@/modules/articles/application/repositories/articles.repository.port";
import type { IArticleCategoryEntity } from "@/modules/articles/domain/entities/IArticleCategoryEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetArticleCategoriesUseCase
 * @extends {IResultUseCase<void, IArticleCategoryEntity[]>}
 */
interface IGetArticleCategoriesUseCase extends IResultUseCase<void, IArticleCategoryEntity[]> {}

/**
 * Use case for fetching article categories.
 *
 * @class GetArticleCategoriesUseCase
 * @implements {IGetArticleCategoriesUseCase}
 *
 * @description
 * Retrieves the list of active categories scoped to articles for display
 * in the public mega menu via the articles repository.
 */
export class GetArticleCategoriesUseCase implements IGetArticleCategoriesUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the get article categories use case.
     *
     * @returns {Promise<Result<IArticleCategoryEntity[]>>} `ok(IArticleCategoryEntity[])` on success, `err(Failure)` on failure
     */
    async execute(): Promise<Result<IArticleCategoryEntity[]>> {
        return this.articlesRepository.getArticleCategories();
    }
}
