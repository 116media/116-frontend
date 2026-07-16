"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { SETTINGS_TABS } from "@/modules/settings/presentation/constants/settingsTabs";

import { useScrollDirection } from "@/shared/presentation/hooks/useScrollDirection";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * SettingsSidebar
 *
 * @description
 * Vertical navigation for the settings shell (a horizontal scroll strip on mobile).
 * Each tab is a link that highlights when the current path matches, driven by
 * `usePathname()`. The frontend equivalent of the dashboard's settings menu.
 */
export function SettingsSidebar() {
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
                {SETTINGS_TABS.map(({ href, labelKey, Icon }) => {
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
