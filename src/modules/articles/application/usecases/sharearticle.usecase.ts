import type { IArticlesRepositoryPort } from "@/modules/articles/application/repositories/articles.repository.port";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * Request payload for {@link ShareArticleUseCase}.
 *
 * @interface IShareArticleRequest
 * @property {string} articleId - The article being shared.
 * @property {string} platform - The share surface used (e.g. "web-share", "clipboard").
 */
export interface IShareArticleRequest {
    articleId: string;
    platform: string;
}

/**
 * IShareArticleUseCase
 *
 * @interface IShareArticleUseCase
 * @extends {IResultUseCase<IShareArticleRequest, boolean>}
 */
interface IShareArticleUseCase extends IResultUseCase<IShareArticleRequest, boolean> {}

/**
 * ShareArticleUseCase
 *
 * @class ShareArticleUseCase
 * @implements {IShareArticleUseCase}
 *
 * @description
 * Records a share event for one article via the articles repository. The platform is
 * client-side context only; the backend endpoint accepts no payload.
 */
export class ShareArticleUseCase implements IShareArticleUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param deps - Awilix cradle slice.
     * @param deps.articlesRepository - The articles repository (injected).
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the share-article use case.
     *
     * @param request - The article id and share platform.
     * @returns `ok(boolean)` success flag on success, `err(Failure)` on failure.
     */
    execute({ articleId, platform }: IShareArticleRequest): Promise<Result<boolean>> {
        return this.articlesRepository.shareArticle(articleId, platform);
    }
}
