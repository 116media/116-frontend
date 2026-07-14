import type { IArticlesRepositoryPort } from "@/modules/articles/application/repositories/articles.repository.port";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * Request payload for {@link ShareArticleUseCase}.
 *
 * @interface IShareArticleRequest
 * @property {string} articleId - The article being shared.
 * @property {string} shareChannel - The share channel (e.g. "WebShare", "Clipboard").
 */
export interface IShareArticleRequest {
    articleId: string;
    shareChannel: string;
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
 * Records a share event for one article via the articles repository, tagged with the
 * share channel for per-channel analytics.
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
     * @param request - The article id and share channel.
     * @returns `ok(boolean)` success flag on success, `err(Failure)` on failure.
     */
    execute({ articleId, shareChannel }: IShareArticleRequest): Promise<Result<boolean>> {
        return this.articlesRepository.shareArticle(articleId, shareChannel);
    }
}
