import type { IArticlesRepositoryPort } from "@/modules/articles/application/repositories/articles.repository.port";
import type { IArticleDetailEntity } from "@/modules/articles/domain/entities/IArticleDetailEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetArticleBySlugUseCase
 * @extends {IResultUseCase<string, IArticleDetailEntity>}
 */
interface IGetArticleBySlugUseCase extends IResultUseCase<string, IArticleDetailEntity> {}

/**
 * Use case for fetching one article by slug.
 *
 * @class GetArticleBySlugUseCase
 * @implements {IGetArticleBySlugUseCase}
 *
 * @description
 * Fetches a single article by its slug via the articles repository. Returns the
 * repository's `Result<IArticleDetailEntity>` unchanged.
 */
export class GetArticleBySlugUseCase implements IGetArticleBySlugUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the get-article-by-slug use case.
     *
     * @param slug - The article slug
     * @returns {Promise<Result<IArticleDetailEntity>>} `ok(IArticleDetailEntity)` on success, `err(Failure)` on failure
     */
    async execute(slug: string): Promise<Result<IArticleDetailEntity>> {
        return this.articlesRepository.getArticleBySlug(slug);
    }
}
