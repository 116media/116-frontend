import Image from "next/image";
import Link from "next/link";

import { LanguageDropdown } from "@/shared/presentation/components/common/LanguageDropdown";
import { ThemeToggle } from "@/shared/presentation/components/common/ThemeToggle";
import { UserAccountControl } from "@/shared/presentation/components/common/UserAccountControl";
import { DesktopNav } from "@/shared/presentation/layouts/Navigation/DesktopNav";
import { PageContainer } from "@/shared/presentation/layouts/PageContainer";

/**
 * Header
 *
 * @description
 * Main navigation header displayed below the TopBar on every public page.
 * Three-column layout: logo (left) | nav + search (centre) | auth + theme toggle (right).
 * Sticky with backdrop blur. Uses PageContainer for consistent horizontal padding.
 * Shows the correct logo variant per theme (light/dark).
 *
 * The centre column (DesktopNav) is hidden on mobile — a hamburger drawer
 * will be added in a later iteration.
 * UserAccountControl shows "Se connecter" for anonymous visitors or an avatar
 * for authenticated users. User is null until auth is wired up.
 */
export function Header() {
    return (
        <header className="w-full border-b border-border bg-background/80 backdrop-blur-lg">
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
                            className="dark:hidden"
                        />
                        <Image
                            priority
                            width={48}
                            height={48}
                            alt="116 Media"
                            src="/images/logo/light/icon.svg"
                            className="hidden dark:block"
                        />
                    </Link>

                    <DesktopNav />

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
