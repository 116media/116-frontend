import { GetArticleCategoriesUseCase } from "@/modules/articles/application/usecases/getarticlecategories.usecase";
import { GetArticlePopularTagsUseCase } from "@/modules/articles/application/usecases/getarticlepopulartags.usecase";
import { GetPromotedArticlesUseCase } from "@/modules/articles/application/usecases/getpromotedarticles.usecase";
import { ArticlesRepositoryImpl } from "@/modules/articles/infrastructure/repositories/articles.repository.impl";
import { GetPromotedVideosUseCase } from "@/modules/videos/application/usecases/getpromotedvideos.usecase";
import { GetVideoCategoriesUseCase } from "@/modules/videos/application/usecases/getvideocategories.usecase";
import { GetVideoPopularTagsUseCase } from "@/modules/videos/application/usecases/getvideopopulartags.usecase";
import { VideosRepositoryImpl } from "@/modules/videos/infrastructure/repositories/videos.repository.impl";
import { createServerApiClient } from "@/shared/infrastructure/api/server-client";
import { Header } from "@/shared/presentation/layouts/Header";
import { PageContainer } from "@/shared/presentation/layouts/PageContainer";
import { TopBar } from "@/shared/presentation/layouts/TopBar";

const PROMOTED_LIMIT = 4;

/**
 * PublicLayout
 *
 * @description
 * Root layout for all public-facing pages under the `(public)` route group.
 * Fetches all mega menu data in parallel server-side before rendering so that
 * the navigation is fully populated the instant the page becomes interactive —
 * no loading flash on first hover.
 * TopBar and Header are wrapped in a single sticky container so they scroll
 * together and never overlap page content.
 *
 * @param children - Page content rendered within the layout
 */
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
    const ssrClient = await createServerApiClient();

    const articlesRepo = new ArticlesRepositoryImpl({ client: ssrClient });
    const videosRepo = new VideosRepositoryImpl({ client: ssrClient });

    const [
        articleCategoriesResult,
        promotedArticlesResult,
        articlePopularTagsResult,
        videoCategoriesResult,
        promotedVideosResult,
        videoPopularTagsResult
    ] = await Promise.all([
        new GetArticleCategoriesUseCase({ articlesRepository: articlesRepo }).execute(),
        new GetPromotedArticlesUseCase({ articlesRepository: articlesRepo }).execute(),
        new GetArticlePopularTagsUseCase({ articlesRepository: articlesRepo }).execute(),
        new GetVideoCategoriesUseCase({ videosRepository: videosRepo }).execute(),
        new GetPromotedVideosUseCase({ videosRepository: videosRepo }).execute(),
        new GetVideoPopularTagsUseCase({ videosRepository: videosRepo }).execute()
    ]);

    return (
        <>
            <div className="sticky top-0 z-40">
                <TopBar />
                <Header
                    articles={{
                        categories: articleCategoriesResult.ok ? articleCategoriesResult.value : [],
                        promotedArticles: promotedArticlesResult.ok
                            ? promotedArticlesResult.value.slice(0, PROMOTED_LIMIT)
                            : [],
                        popularTags: articlePopularTagsResult.ok
                            ? articlePopularTagsResult.value
                            : []
                    }}
                    videos={{
                        categories: videoCategoriesResult.ok ? videoCategoriesResult.value : [],
                        promotedVideos: promotedVideosResult.ok
                            ? promotedVideosResult.value.slice(0, PROMOTED_LIMIT)
                            : [],
                        popularTags: videoPopularTagsResult.ok ? videoPopularTagsResult.value : []
                    }}
                />
            </div>
            <main className="min-h-screen py-8">
                <PageContainer>{children}</PageContainer>
            </main>
        </>
    );
}
