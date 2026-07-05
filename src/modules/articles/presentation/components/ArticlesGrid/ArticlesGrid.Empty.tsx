"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { NewspaperIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for ArticlesGridEmpty.
 *
 * @interface ArticlesGridEmptyProps
 * @property {boolean} [filtered] - Whether the emptiness is due to active filters.
 * @property {() => void} [onClear] - Clears all filters (shown only when `filtered`).
 */
export interface ArticlesGridEmptyProps {
    filtered?: boolean;
    onClear?: () => void;
}

/**
 * ArticlesGridEmpty
 *
 * @description
 * Empty state for the article grid. With `filtered`, the current search/category/tag
 * matched nothing and a "Clear filters" action is offered; without it, the feed itself
 * has no content ("no articles yet"). Centered, muted, icon-led.
 *
 * @param filtered - Whether the emptiness is due to active filters.
 * @param onClear - Clears all filters (shown only when `filtered`).
 */
export function ArticlesGridEmpty({ filtered, onClear }: ArticlesGridEmptyProps) {
    const { t } = useTranslation();
    const key = filtered ? "noResults" : "empty";
    return (
        <EmptyState
            context="articles-feed"
            title={t(`articles.grid.${key}.title`)}
            subtitle={t(`articles.grid.${key}.body`)}
            icon={<NewspaperIcon className="size-16" />}
            action={
                filtered && onClear ? (
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={onClear}
                    >
                        {t("articles.filters.clear")}
                    </Button>
                ) : undefined
            }
        />
    );
}
