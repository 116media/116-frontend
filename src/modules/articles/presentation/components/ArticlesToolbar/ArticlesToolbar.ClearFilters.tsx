"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { XIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for ArticlesToolbarClearFilters.
 *
 * @interface ArticlesToolbarClearFiltersProps
 * @property {() => void} onClear - Resets every active filter.
 */
export interface ArticlesToolbarClearFiltersProps {
    onClear: () => void;
}

/**
 * ArticlesToolbarClearFilters
 *
 * @description
 * The "Clear filters" control shown in the toolbar while any filter is active. A single
 * ghost button that resets search, category, and tag in one click via `onClear`.
 *
 * @param onClear - Resets every active filter.
 */
export function ArticlesToolbarClearFilters({ onClear }: ArticlesToolbarClearFiltersProps) {
    const { t } = useTranslation();
    return (
        <div className="flex justify-end">
            <Button
                size="sm"
                variant="ghost"
                onClick={onClear}
                className="text-muted-foreground"
            >
                <XIcon className="size-4" />
                {t("articles.filters.clear")}
            </Button>
        </div>
    );
}
