import type { IArticlesRepositoryPort } from "@/modules/articles/application/repositories/articles.repository.port";
import type { IArticlePromotionFeedEntity } from "@/modules/articles/domain/entities/IArticlePromotionFeedEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetArticlePromotionFeedUseCase
 * @extends {IResultUseCase<void, IArticlePromotionFeedEntity>}
 */
interface IGetArticlePromotionFeedUseCase
    extends IResultUseCase<void, IArticlePromotionFeedEntity> {}

/**
 * Use case for fetching the homepage article promotion feed.
 *
 * @class GetArticlePromotionFeedUseCase
 * @implements {IGetArticlePromotionFeedUseCase}
 *
 * @description
 * Retrieves the article promotion grid data (spots 1-3 + gossip strip)
 * for the homepage via the articles repository. The mapper resolves
 * backend spots into named arrays for direct use by carousel components.
 */
export class GetArticlePromotionFeedUseCase implements IGetArticlePromotionFeedUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the get article promotion feed use case.
     *
     * @returns {Promise<Result<IArticlePromotionFeedEntity>>} `ok(IArticlePromotionFeedEntity)` on success, `err(Failure)` on failure
     */
    async execute(): Promise<Result<IArticlePromotionFeedEntity>> {
        return this.articlesRepository.getPromotionFeed();
    }
}
