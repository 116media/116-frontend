import type { ArticlesMegaMenuProps } from "@/modules/articles/presentation/components/navigation/ArticlesMegaMenu/types";
import { NotificationBellContainer } from "@/modules/notifications/presentation/containers/NotificationBellContainer";
import type { VideosMegaMenuProps } from "@/modules/videos/presentation/components/navigation/VideosMegaMenu/types";
import { LanguageDropdown } from "@/shared/presentation/components/common/LanguageDropdown";
import { ThemeToggle } from "@/shared/presentation/components/common/ThemeToggle";
import { UserAccountControl } from "@/shared/presentation/components/common/UserAccountControl";
import { Logo } from "@/shared/presentation/components/ui/Logo";
import { DesktopNav } from "@/shared/presentation/layouts/DesktopNav";
import { HeaderSearch } from "@/shared/presentation/layouts/HeaderSearch";
import { MobileMegaMenu } from "@/shared/presentation/layouts/MobileMegaMenu";
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
 * Main navigation header below the TopBar on every public page: logo, DesktopNav
 * above `md` and MobileMegaMenu below it. Theme and language sit here above `md`
 * and in the mobile menu's footer below it; the account control shows at every
 * width. Mega menu data is prefetched server-side and forwarded to both navs.
 */
export function Header({ articles, videos }: HeaderProps) {
    return (
        <header className="w-full border-b bg-background/80 backdrop-blur-lg">
            <PageContainer>
                <div className="flex h-16 items-center justify-between gap-2">
                    <div className="flex flex-1 justify-start lg:hidden">
                        <MobileMegaMenu
                            videos={videos}
                            articles={articles}
                        />
                    </div>

                    <Logo
                        priority
                        canRedirect
                        className="size-9 sm:size-12 md:size-10 lg:size-12"
                    />

                    <DesktopNav
                        videos={videos}
                        articles={articles}
                    />

                    <div className="flex flex-1 items-center justify-end gap-1 lg:flex-none lg:gap-6">
                        <div className="hidden items-center gap-1 lg:flex">
                            <ThemeToggle />
                            <LanguageDropdown placement="bottom" />
                        </div>
                        <NotificationBellContainer />
                        <UserAccountControl />
                    </div>
                </div>

                <HeaderSearch className="lg:hidden" />
            </PageContainer>
        </header>
    );
}
