"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";

import { FilmIcon, NewspaperIcon, PlayIcon } from "@/shared/presentation/components/ui/Icon";
import {
    FAVORITE_ARTICLES_PATH,
    FAVORITE_SHORTS_PATH,
    FAVORITE_VIDEOS_PATH
} from "@/shared/presentation/constants/paths";
import { useScrollDirection } from "@/shared/presentation/hooks/useScrollDirection";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

const FAVORITES_LINKS: ReadonlyArray<{
    href: string;
    labelKey: string;
    Icon: ComponentType<{ className?: string }>;
}> = [
    {
        href: FAVORITE_ARTICLES_PATH,
        labelKey: "favorites.navigation.articles",
        Icon: NewspaperIcon
    },
    { href: FAVORITE_VIDEOS_PATH, labelKey: "favorites.navigation.videos", Icon: PlayIcon },
    { href: FAVORITE_SHORTS_PATH, labelKey: "favorites.navigation.shorts", Icon: FilmIcon }
];

/**
 * FavoriteLayoutSidebar
 *
 * @description
 *
 * Favorites navigation across the three content types: a tab bar up to `lg`, where it
 * becomes the vertical sidebar beside the content. The rule it sits on and the underline
 * under the current tab are what read as navigation rather than a row of buttons.
 */
export function FavoriteLayoutSidebar() {
    const pathname = usePathname();
    const { t } = useTranslation();
    const direction = useScrollDirection();

    return (
        <div className="lg:w-60 lg:shrink-0 lg:rounded-l-lg lg:bg-sidebar">
            <nav
                className={cn(
                    "sticky top-[var(--site-header-height,7rem)] z-20 flex gap-1 overflow-x-auto border-b bg-background transition-all duration-300 scrollbar-none [&::-webkit-scrollbar]:hidden",
                    "lg:flex-col lg:gap-2 lg:overflow-visible lg:border-b-0 lg:bg-transparent lg:p-4",
                    direction === "down" && "-translate-y-2 pointer-events-none opacity-0"
                )}
            >
                {FAVORITES_LINKS.map(({ href, labelKey, Icon }) => {
                    const isActive = pathname === href || pathname.startsWith(`${href}/`);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "relative flex items-center gap-2 whitespace-nowrap px-3 py-2.5 font-medium text-sm transition-colors",
                                "lg:rounded-md lg:py-2",
                                isActive
                                    ? [
                                          "text-primary after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary",
                                          "dark:text-secondary dark:after:bg-secondary",
                                          "lg:bg-primary/10 lg:after:hidden dark:lg:bg-secondary/15"
                                      ]
                                    : "text-muted-foreground hover:text-foreground lg:text-foreground/80 lg:hover:bg-foreground/5"
                            )}
                        >
                            <Icon className="size-4" />
                            {t(labelKey)}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
