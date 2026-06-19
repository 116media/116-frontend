"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

/**
 * @interface MegaMenuShellCardsProps
 *
 * @property {string} viewAllHref - URL for the "view all" link in the section header
 * @property {React.ReactNode} children - Card grids to render inside the column
 */
export interface MegaMenuShellCardsProps {
    viewAllHref: string;
    children: React.ReactNode;
}

/**
 * MegaMenuShellCards
 *
 * @description
 * Centre column slot of MegaMenuShell.
 * Renders the localised "featured" section header with a "view all" link,
 * then the injected card grids below it.
 */
export function MegaMenuShellCards({ viewAllHref, children }: MegaMenuShellCardsProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-2 border-x border-border px-3 lg:gap-3 lg:px-4">
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("general.featured")}
                </p>
                <Link
                    href={viewAllHref}
                    className="text-xs text-primary dark:text-secondary hover:underline"
                >
                    {t("general.viewAll")} →
                </Link>
            </div>
            {children}
        </div>
    );
}
