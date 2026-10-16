"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the FeedHeading component.
 *
 * @interface FeedHeadingProps
 * @property {string} title - The feed title, rendered uppercase.
 * @property {string} [subtitle] - A supporting line under the title, for a feed that has
 * to earn the tap rather than simply name itself.
 * @property {string} [actionHref] - Destination of the trailing link; the link is
 * omitted when absent.
 * @property {string} [actionLabel] - Label for the trailing link. Defaults to the
 * shared "view all" string.
 * @property {string} [className] - Extra classes merged onto the heading row.
 */
export interface FeedHeadingProps {
    title: string;
    subtitle?: string;
    actionHref?: string;
    actionLabel?: string;
    className?: string;
}

/**
 * FeedHeading
 *
 * @description
 * Heading block shared by the homepage feeds: the title with an optional supporting line,
 * and the feed's own entry point as a pill that reads as something to press. On a phone the
 * title takes the full width and the pill sits beneath it. Distinct from `SectionHeader`,
 * the boxed-icon header used by the settings tabs and the detail sidebars.
 */
export function FeedHeading({
    title,
    subtitle,
    actionHref,
    actionLabel,
    className
}: FeedHeadingProps) {
    const { t } = useTranslation();

    return (
        <div
            className={cn(
                "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6",
                className
            )}
        >
            <div className="flex min-w-0 flex-col gap-1">
                <h2
                    suppressHydrationWarning
                    className="text-balance font-bold text-foreground text-xl uppercase tracking-tight sm:text-2xl lg:text-3xl"
                >
                    {title}
                </h2>

                {subtitle && (
                    <p
                        suppressHydrationWarning
                        className="text-pretty text-muted-foreground text-sm sm:text-base"
                    >
                        {subtitle}
                    </p>
                )}
            </div>

            {actionHref && (
                <Link
                    href={actionHref}
                    suppressHydrationWarning
                    className="group inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-lg border border-outlined bg-muted px-4 py-2 font-medium text-primary text-sm transition-colors hover:bg-surface-hover sm:min-h-0 sm:self-auto dark:text-secondary"
                >
                    {actionLabel ?? t("general.viewAll")}
                    <span
                        aria-hidden
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                    >
                        →
                    </span>
                </Link>
            )}
        </div>
    );
}
