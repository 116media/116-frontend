"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the FeedHeading component.
 *
 * @interface FeedHeadingProps
 * @property {string} title - The feed title, rendered uppercase.
 * @property {string} [actionHref] - Destination of the trailing link; the link is
 * omitted when absent.
 * @property {string} [actionLabel] - Label for the trailing link. Defaults to the
 * shared "view all" string.
 * @property {string} [className] - Extra classes merged onto the heading row.
 */
export interface FeedHeadingProps {
    title: string;
    actionHref?: string;
    actionLabel?: string;
    className?: string;
}

/**
 * FeedHeading
 *
 * @description
 * Heading row shared by the homepage feeds: the title on the left and an optional
 * link on the right. Distinct from `SectionHeader`, the boxed-icon header used by
 * the settings tabs and the detail sidebars.
 */
export function FeedHeading({ title, actionHref, actionLabel, className }: FeedHeadingProps) {
    const { t } = useTranslation();

    return (
        <div className={cn("flex items-end justify-between gap-4", className)}>
            <h2
                suppressHydrationWarning
                className="text-balance font-bold text-foreground text-xl uppercase tracking-tight sm:text-2xl lg:text-3xl"
            >
                {title}
            </h2>

            {actionHref && (
                <Link
                    href={actionHref}
                    suppressHydrationWarning
                    className="shrink-0 pb-1 font-medium text-primary text-sm transition-colors hover:underline dark:text-secondary"
                >
                    {actionLabel ?? t("general.viewAll")} →
                </Link>
            )}
        </div>
    );
}
