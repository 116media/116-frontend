import type { GetArticleCategoriesUseCase } from "@/modules/articles/application/usecases/getarticlecategories.usecase";
import type { GetArticlePopularTagsUseCase } from "@/modules/articles/application/usecases/getarticlepopulartags.usecase";
import type { GetPromotedArticlesUseCase } from "@/modules/articles/application/usecases/getpromotedarticles.usecase";
import type { ArticlesMegaMenuProps } from "@/modules/articles/presentation/components/ArticlesMegaMenu/types";
import type { GetPromotedVideosUseCase } from "@/modules/videos/application/usecases/getpromotedvideos.usecase";
import type { GetVideoCategoriesUseCase } from "@/modules/videos/application/usecases/getvideocategories.usecase";
import type { GetVideoPopularTagsUseCase } from "@/modules/videos/application/usecases/getvideopopulartags.usecase";
import type { VideosMegaMenuProps } from "@/modules/videos/presentation/components/VideosMegaMenu/types";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import { ok, type Result, unwrap } from "@/shared/domain/results/result";

const PROMOTED_LIMIT = 4;

/**
 * Shape returned by PrefetchNavigationUseCase on success.
 *
 * @description
 * Matches the Header component's props exactly so the layout can
 * spread the result directly into `<Header articles={...} videos={...} />`.
 */
export interface INavigationData {
    videos: VideosMegaMenuProps;
    articles: ArticlesMegaMenuProps;
}

/**
 * @interface IPrefetchNavigationUseCase
 * @extends {IResultUseCase<void, INavigationData>}
 */
interface IPrefetchNavigationUseCase extends IResultUseCase<void, INavigationData> {}

/**
 * Composite use case that prefetches all navigation data in parallel.
 *
 * @class PrefetchNavigationUseCase
 * @implements {IPrefetchNavigationUseCase}
 *
 * @description
 * Orchestrates six child use cases (article categories, promoted articles,
 * article popular tags, video categories, promoted videos, video popular tags)
 * into a single parallel call. Unwraps each `Result` with a safe fallback to
 * an empty array so the navigation always renders — even if one API call fails.
 * Designed to be resolved from the Awilix container and called once per request
 * in the public layout server component.
 */
export class PrefetchNavigationUseCase implements IPrefetchNavigationUseCase {
    private readonly getArticleCategoriesUseCase: GetArticleCategoriesUseCase;
    private readonly getPromotedArticlesUseCase: GetPromotedArticlesUseCase;
    private readonly getArticlePopularTagsUseCase: GetArticlePopularTagsUseCase;
    private readonly getVideoCategoriesUseCase: GetVideoCategoriesUseCase;
    private readonly getPromotedVideosUseCase: GetPromotedVideosUseCase;
    private readonly getVideoPopularTagsUseCase: GetVideoPopularTagsUseCase;

    /**
     * @param deps - Child use cases injected by Awilix from the container cradle
     */
    constructor({
        getArticleCategoriesUseCase,
        getPromotedArticlesUseCase,
        getArticlePopularTagsUseCase,
        getVideoCategoriesUseCase,
        getPromotedVideosUseCase,
        getVideoPopularTagsUseCase
    }: {
        getArticleCategoriesUseCase: GetArticleCategoriesUseCase;
        getPromotedArticlesUseCase: GetPromotedArticlesUseCase;
        getArticlePopularTagsUseCase: GetArticlePopularTagsUseCase;
        getVideoCategoriesUseCase: GetVideoCategoriesUseCase;
        getPromotedVideosUseCase: GetPromotedVideosUseCase;
        getVideoPopularTagsUseCase: GetVideoPopularTagsUseCase;
    }) {
        this.getArticleCategoriesUseCase = getArticleCategoriesUseCase;
        this.getPromotedArticlesUseCase = getPromotedArticlesUseCase;
        this.getArticlePopularTagsUseCase = getArticlePopularTagsUseCase;
        this.getVideoCategoriesUseCase = getVideoCategoriesUseCase;
        this.getPromotedVideosUseCase = getPromotedVideosUseCase;
        this.getVideoPopularTagsUseCase = getVideoPopularTagsUseCase;
    }

    /**
     * Executes all navigation data fetches in parallel.
     *
     * @returns {Promise<Result<INavigationData>>} `ok(INavigationData)` with safe defaults for failed sub-calls
     */
    async execute(): Promise<Result<INavigationData>> {
        const [
            articleCategoriesResult,
            promotedArticlesResult,
            articlePopularTagsResult,
            videoCategoriesResult,
            promotedVideosResult,
            videoPopularTagsResult
        ] = await Promise.all([
            this.getArticleCategoriesUseCase.execute(),
            this.getPromotedArticlesUseCase.execute(),
            this.getArticlePopularTagsUseCase.execute(),
            this.getVideoCategoriesUseCase.execute(),
            this.getPromotedVideosUseCase.execute(),
            this.getVideoPopularTagsUseCase.execute()
        ]);

        return ok({
            articles: {
                categories: unwrap(articleCategoriesResult, []),
                promotedArticles: unwrap(promotedArticlesResult, []).slice(0, PROMOTED_LIMIT),
                popularTags: unwrap(articlePopularTagsResult, [])
            },
            videos: {
                categories: unwrap(videoCategoriesResult, []),
                promotedVideos: unwrap(promotedVideosResult, []).slice(0, PROMOTED_LIMIT),
                popularTags: unwrap(videoPopularTagsResult, [])
            }
        });
    }
}
