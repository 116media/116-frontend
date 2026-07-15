import Image from "next/image";
import Link from "next/link";

import type { ArticlesMegaMenuProps } from "@/modules/articles/presentation/components/navigation/ArticlesMegaMenu/types";
import type { VideosMegaMenuProps } from "@/modules/videos/presentation/components/navigation/VideosMegaMenu/types";
import { LanguageDropdown } from "@/shared/presentation/components/common/LanguageDropdown";
import { ThemeToggle } from "@/shared/presentation/components/common/ThemeToggle";
import { UserAccountControl } from "@/shared/presentation/components/common/UserAccountControl";
import { DesktopNav } from "@/shared/presentation/layouts/DesktopNav";
import { PageContainer } from "@/shared/presentation/layouts/PageContainer";

/**
 * Props for the Header component.
 *
 * @interface HeaderProps
 * @property {ArticlesMegaMenuProps} articles - Prefetched data for the articles mega menu.
 * @property {VideosMegaMenuProps} videos - Prefetched data for the videos mega menu.
 */
export interface HeaderProps {
    articles: ArticlesMegaMenuProps;
    videos: VideosMegaMenuProps;
}

/**
 * Header
 *
 * @description
 * Main navigation header below the TopBar on every public page: logo, DesktopNav,
 * and account/theme/language controls. Mega menu data is prefetched server-side in
 * PublicLayout and forwarded here.
 */
export function Header({ articles, videos }: HeaderProps) {
    return (
        <header className="w-full border-b bg-background/80 backdrop-blur-lg">
            <PageContainer>
                <div className="flex h-16 items-center justify-between">
                    <Link
                        href="/"
                        aria-label="116 — Accueil"
                    >
                        <Image
                            priority
                            width={48}
                            height={48}
                            alt="116 Media"
                            src="/images/logo/dark/icon.svg"
                            className="size-9 dark:hidden sm:size-12 md:size-10 lg:size-12"
                        />
                        <Image
                            priority
                            width={48}
                            height={48}
                            alt="116 Media"
                            src="/images/logo/light/icon.svg"
                            className="hidden size-9 dark:block sm:size-12 md:size-10 lg:size-12"
                        />
                    </Link>

                    <DesktopNav
                        videos={videos}
                        articles={articles}
                    />

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1">
                            <ThemeToggle />
                            <LanguageDropdown placement="bottom" />
                        </div>
                        <UserAccountControl />
                    </div>
                </div>
            </PageContainer>
        </header>
    );
}
