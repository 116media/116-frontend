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

/**
 * The favorites content-type links (route, i18n label key, icon), in display order.
 */
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
 * FavoritesSidebar
 *
 * @description
 * Vertical navigation for the favorites shell (a horizontal scroll strip on mobile).
 * Each link highlights when the current path matches, driven by `usePathname()`; the
 * content type it points to owns the pathname while the inner collection lives in the
 * query string.
 */
export function FavoritesSidebar() {
    const pathname = usePathname();
    const { t } = useTranslation();
    const direction = useScrollDirection();

    return (
        <div className="md:w-60 md:shrink-0 md:rounded-l-lg md:bg-sidebar">
            <nav
                className={cn(
                    "sticky top-28 z-20 flex gap-2 overflow-x-auto rounded-t-lg border-b bg-sidebar p-4 transition-all duration-300",
                    "md:flex-col md:overflow-visible md:rounded-none md:border-b-0 md:bg-transparent",
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
                                "flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 font-medium text-sm transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary"
                                    : "text-foreground/80 hover:bg-foreground/5 hover:text-foreground"
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
