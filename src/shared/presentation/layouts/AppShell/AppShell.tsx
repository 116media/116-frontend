import type { ReactNode } from "react";

import { unwrap } from "@/shared/domain/results/result";
import { createServerCradle } from "@/shared/infrastructure/server.cradle";
import { Header } from "@/shared/presentation/layouts/Header";
import { PageContainer } from "@/shared/presentation/layouts/PageContainer";
import { TopBar } from "@/shared/presentation/layouts/TopBar";

/**
 * Props for AppShell.
 *
 * @interface AppShellProps
 * @property {ReactNode} children - Page content rendered inside the chrome.
 */
export interface AppShellProps {
    children: ReactNode;
}

/**
 * AppShell
 *
 * @description
 * The universal app chrome shared by the public and private route groups: a sticky TopBar
 * and Header wrapped around the page content in a PageContainer. Navigation data is
 * prefetched server-side so the mega menus are populated on first paint. Both the
 * `(public)` and `(private)` group layouts render this, so every route shares one chrome.
 */
export async function AppShell({ children }: AppShellProps) {
    const cradle = await createServerCradle();
    const result = await cradle.prefetchNavigationUseCase.execute();

    const { articles, videos } = unwrap(result, {
        videos: { categories: [], promotedVideos: [], popularTags: [] },
        articles: { categories: [], promotedArticles: [], popularTags: [] }
    });

    return (
        <>
            <div
                data-site-header
                className="sticky top-0 z-40"
            >
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
