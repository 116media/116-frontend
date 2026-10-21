"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { CheckIcon, ChevronRightIcon } from "@/shared/presentation/components/ui/Icon";
import { Tag } from "@/shared/presentation/components/ui/Tag";
import { PAGE_GUTTER } from "@/shared/presentation/constants/layout";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import type { MobileMegaMenuComingSoonProps } from "./types";

/**
 * MobileMegaMenu.ComingSoon
 *
 * @description
 * The panel a tab shows while its feature is still announced rather than open: the same
 * badge, name, promise and points as the feature's own page, at the density a menu column
 * allows, over a link through to that page.
 */
export function MobileMegaMenuComingSoon({
    feature,
    href,
    onNavigate
}: MobileMegaMenuComingSoonProps) {
    const { t } = useTranslation();
    const name = t(feature.nameKey);

    return (
        <section className={cn("flex flex-col gap-4 py-6", PAGE_GUTTER)}>
            <div className="flex flex-col items-center gap-3 rounded-base bg-primary/5 p-5 text-center dark:bg-secondary/10">
                <Tag
                    as="span"
                    size="md"
                    variant="brand"
                    prefix={
                        <span
                            aria-hidden
                            className="relative flex size-2"
                        >
                            <span className="absolute inline-flex size-full animate-status-ping rounded-full bg-primary-foreground dark:bg-secondary-foreground" />
                            <span className="relative inline-flex size-2 rounded-full bg-primary-foreground dark:bg-secondary-foreground" />
                        </span>
                    }
                >
                    {t("comingSoon.feature.badge")}
                </Tag>

                <p className="font-semibold text-primary text-xs uppercase tracking-[0.2em] dark:text-secondary">
                    {name}
                </p>

                <h3 className="text-balance font-bold text-3xl text-foreground">
                    {t("comingSoon.feature.heading")}
                </h3>

                <p className="text-balance text-muted-foreground text-sm">
                    {t(feature.descriptionKey)}
                </p>
            </div>

            <ul className="flex flex-col gap-3">
                {feature.pointKeys.map((pointKey) => (
                    <li
                        key={pointKey}
                        className="flex items-start gap-3 text-foreground text-sm"
                    >
                        <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary dark:text-secondary" />
                        <span>{t(pointKey)}</span>
                    </li>
                ))}
            </ul>

            <Link
                href={href}
                onClick={onNavigate}
                className="flex min-h-11 items-center justify-center gap-0.5 rounded-base border border-primary/30 font-semibold text-primary text-sm transition-colors hover:bg-primary/10 dark:border-secondary/30 dark:text-secondary dark:hover:bg-secondary/10"
            >
                {t("general.learnMore")}
                <ChevronRightIcon
                    aria-hidden="true"
                    className="size-4"
                />
            </Link>
        </section>
    );
}
