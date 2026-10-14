"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { XIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for VideosToolbarClearFilters.
 *
 * @interface VideosToolbarClearFiltersProps
 * @property {() => void} onClear - Resets every active filter.
 */
export interface VideosToolbarClearFiltersProps {
    onClear: () => void;
}

/**
 * VideosToolbarClearFilters
 *
 * @description
 * The "Clear filters" control shown in the toolbar while any filter is active. A single
 * ghost button that resets search, category and tag in one click via `onClear`.
 */
export function VideosToolbarClearFilters({ onClear }: VideosToolbarClearFiltersProps) {
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
                {t("videos.browse.filters.clear")}
            </Button>
        </div>
    );
}
