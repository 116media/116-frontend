import type { IArticlesRepositoryPort } from "@/modules/articles/application/repositories/articles.repository.port";
import type { IArticleTagEntity } from "@/modules/articles/domain/entities/IArticleTagEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetArticlePopularTagsUseCase
 * @extends {IResultUseCase<void, IArticleTagEntity[]>}
 */
interface IGetArticlePopularTagsUseCase extends IResultUseCase<void, IArticleTagEntity[]> {}

/**
 * Use case for fetching popular article tags.
 *
 * @class GetArticlePopularTagsUseCase
 * @implements {IGetArticlePopularTagsUseCase}
 *
 * @description
 * Retrieves the most popular tags scoped to the Article content type
 * via the articles repository.
 */
export class GetArticlePopularTagsUseCase implements IGetArticlePopularTagsUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param {IArticlesRepositoryPort} articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the get article popular tags use case.
     *
     * @returns {Promise<Result<IArticleTagEntity[]>>} `ok(IArticleTagEntity[])` on success, `err(Failure)` on failure
     */
    async execute(): Promise<Result<IArticleTagEntity[]>> {
        return this.articlesRepository.getArticlePopularTags();
    }
}
