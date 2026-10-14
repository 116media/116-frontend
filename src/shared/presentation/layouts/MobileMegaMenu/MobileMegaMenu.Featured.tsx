"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { ChevronRightIcon, StarIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

import type { MobileMegaMenuFeaturedProps } from "./types";

/**
 * MobileMegaMenu.Featured
 *
 * @description
 * The "featured" block: a starred heading with a view-all link above the promoted
 * content. `panel` draws the accent-tinted inset used by the list variants; `plain`
 * lets a card grid use the panel's full content width.
 */
export function MobileMegaMenuFeatured({
    viewAllHref,
    onNavigate,
    children,
    title,
    variant = "panel"
}: MobileMegaMenuFeaturedProps) {
    const { t } = useTranslation();

    return (
        <section
            className={cn(
                "flex flex-col gap-3",
                variant === "panel"
                    ? "mx-4 rounded-lg bg-primary/5 p-4 dark:bg-secondary/10"
                    : "p-3",
            )}
        >
            <div className="flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-1.5 font-bold text-primary text-xs uppercase tracking-wider dark:text-secondary">
                    <StarIcon
                        aria-hidden="true"
                        className="size-3.5"
                    />
                    {title ?? t("general.featured")}
                </h3>
                <Link
                    href={viewAllHref}
                    onClick={onNavigate}
                    className="flex min-h-11 items-center gap-0.5 font-medium text-primary text-xs hover:underline dark:text-secondary"
                >
                    {t("general.viewAll")}
                    <ChevronRightIcon
                        aria-hidden="true"
                        className="size-3.5"
                    />
                </Link>
            </div>
            {children}
        </section>
    );
}
