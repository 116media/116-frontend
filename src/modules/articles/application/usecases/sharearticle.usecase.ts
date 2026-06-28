import type { IArticlesRepositoryPort } from "@/modules/articles/application/repositories/articles.repository.port";
import type { Result } from "@/shared/domain/results/result";

/**
 * Use case for recording an article share.
 *
 * @class ShareArticleUseCase
 *
 * @description
 * Records a share event for one article via the articles repository.
 * Returns the repository's `Result<boolean>` (success flag) unchanged.
 * The share platform is client-side context only; the backend endpoint
 * accepts no payload.
 */
export class ShareArticleUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param {IArticlesRepositoryPort} articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the share article use case.
     *
     * @param {string} articleId - The article being shared
     * @param {string} platform - The share surface used (e.g. "web-share", "clipboard")
     * @returns {Promise<Result<boolean>>} `ok(boolean)` success flag on success, `err(Failure)` on failure
     */
    async execute(articleId: string, platform: string): Promise<Result<boolean>> {
        return this.articlesRepository.shareArticle(articleId, platform);
    }
}
