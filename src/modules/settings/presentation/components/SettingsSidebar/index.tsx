"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";

import { LockIcon, SettingsIcon, UserRoundIcon } from "@/shared/presentation/components/ui/Icon";
import {
    SETTINGS_ACCOUNT_PATH,
    SETTINGS_PROFILE_PATH,
    SETTINGS_SECURITY_PATH
} from "@/shared/presentation/constants/paths";
import { cn } from "@/shared/presentation/utils/cn";

/**
 * The settings tabs in display order — route, label key, and icon.
 */
const SETTINGS_TABS: ReadonlyArray<{
    href: string;
    labelKey: string;
    Icon: ComponentType<{ className?: string }>;
}> = [
    { href: SETTINGS_PROFILE_PATH, labelKey: "settings.nav.profile", Icon: UserRoundIcon },
    { href: SETTINGS_SECURITY_PATH, labelKey: "settings.nav.security", Icon: LockIcon },
    { href: SETTINGS_ACCOUNT_PATH, labelKey: "settings.nav.account", Icon: SettingsIcon }
];

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

    return (
        <nav className="flex gap-1 overflow-x-auto md:w-64 md:flex-col md:overflow-visible">
            {SETTINGS_TABS.map(({ href, labelKey, Icon }) => {
                const isActive = pathname === href || pathname.startsWith(`${href}/`);
                return (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            "flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 font-medium text-sm transition-colors",
                            isActive
                                ? "bg-accent text-accent-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        <Icon className="size-4" />
                        {t(labelKey)}
                    </Link>
                );
            })}
        </nav>
    );
}
