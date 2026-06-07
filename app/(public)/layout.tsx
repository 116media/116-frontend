import { unwrap } from "@/shared/domain/results/result";
import { createServerCradle } from "@/shared/infrastructure/server.cradle";
import { Header } from "@/shared/presentation/layouts/Header";
import { PageContainer } from "@/shared/presentation/layouts/PageContainer";
import { TopBar } from "@/shared/presentation/layouts/TopBar";

/**
 * PublicLayout
 *
 * @description
 * Root layout for all public-facing pages under the `(public)` route group.
 * Prefetches all navigation data in parallel server-side via
 * `PrefetchNavigationUseCase` so the mega menus are fully populated the
 * instant the page becomes interactive — no loading flash on first hover.
 * TopBar and Header are wrapped in a single sticky container so they scroll
 * together and never overlap page content.
 *
 * @param children - Page content rendered within the layout
 */
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
    const cradle = await createServerCradle();
    const result = await cradle.prefetchNavigationUseCase.execute();

    const { articles, videos } = unwrap(result, {
        articles: { categories: [], promotedArticles: [], popularTags: [] },
        videos: { categories: [], promotedVideos: [], popularTags: [] }
    });

    return (
        <>
            <div className="sticky top-0 z-40">
                <TopBar />
                <Header
                    videos={videos}
                    articles={articles}
                />
            </div>
            <main className="min-h-screen py-4">
                <PageContainer>{children}</PageContainer>
            </main>
        </>
    );
}
