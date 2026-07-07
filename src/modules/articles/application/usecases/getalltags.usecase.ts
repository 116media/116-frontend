import type { IArticlesRepositoryPort } from "@/modules/articles/application/repositories/articles.repository.port";
import type { IArticleTagEntity } from "@/modules/articles/domain/entities/IArticleTagEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetAllTagsUseCase
 * @extends {IResultUseCase<string | undefined, IArticleTagEntity[]>}
 */
interface IGetAllTagsUseCase extends IResultUseCase<string | undefined, IArticleTagEntity[]> {}

/**
 * Use case for fetching every article tag.
 *
 * @class GetAllTagsUseCase
 * @implements {IGetAllTagsUseCase}
 *
 * @description
 * Fetches the tags used by at least one article for the "All tags" popover, optionally
 * filtered by a server-side search term. Video-only tags are excluded so the popover only
 * offers tags that can match an article.
 */
export class GetAllTagsUseCase implements IGetAllTagsUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the get all tags use case.
     *
     * @param [search] - Optional tag-name search term
     * @returns {Promise<Result<IArticleTagEntity[]>>} `ok(IArticleTagEntity[])` on success, `err(Failure)` on failure
     */
    async execute(search?: string): Promise<Result<IArticleTagEntity[]>> {
        return this.articlesRepository.getAllTags(search);
    }
}
