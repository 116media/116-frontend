import { Header } from "@/shared/presentation/layouts/Header";
import { PageContainer } from "@/shared/presentation/layouts/PageContainer";
import { TopBar } from "@/shared/presentation/layouts/TopBar";

/**
 * PublicLayout
 *
 * @description
 * Root layout for all public-facing pages under the `(public)` route group.
 * TopBar and Header are wrapped in a single sticky container so they scroll
 * together and never overlap page content. Page content is wrapped in
 * PageContainer for consistent horizontal padding across all screen sizes.
 *
 * @param children - Page content rendered within the layout
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="sticky top-0 z-40">
                <TopBar />
                <Header />
            </div>
            <main className="min-h-screen py-8">
                <PageContainer>{children}</PageContainer>
            </main>
        </>
    );
}
