"use client";

import { useTranslation } from "react-i18next";

import { VIDEO_BROWSE_CHIP_LIMIT } from "@/modules/videos/presentation/constants/videoKeys";
import { useVideoCategories } from "@/modules/videos/presentation/hooks/useVideoCategories";
import { Button } from "@/shared/presentation/components/ui/Button";
import { LayoutGridIcon } from "@/shared/presentation/components/ui/Icon";
import { CategoryTabs } from "@/shared/presentation/layouts/CategoryTabs";

/**
 * Props for VideosToolbarCategoryTabs.
 *
 * @interface VideosToolbarCategoryTabsProps
 * @property {string | undefined} value - The selected category slug, or undefined for all.
 * @property {(categorySlug: string | undefined) => void} onChange - Emits the category slug.
 * @property {() => void} onBrowseAll - Opens the "browse all shows" modal.
 */
export interface VideosToolbarCategoryTabsProps {
    value: string | undefined;
    onBrowseAll: () => void;
    onChange: (categorySlug: string | undefined) => void;
}

/**
 * VideosToolbarCategoryTabs
 *
 * @description
 * The browse feed's category rail: the shared {@link CategoryTabs} fed with the active
 * video categories, trailed by the "browse all shows" trigger.
 */
export function VideosToolbarCategoryTabs({
    value,
    onChange,
    onBrowseAll
}: VideosToolbarCategoryTabsProps) {
    const { t } = useTranslation();
    const { data: categories = [] } = useVideoCategories();

    // The rail emits the value it is keyed by, and the URL carries slugs, not identifiers.
    const tabs = categories.map((category) => ({ id: category.slug, name: category.name }));

    return (
        <CategoryTabs
            value={value}
            onChange={onChange}
            categories={tabs}
            limit={VIDEO_BROWSE_CHIP_LIMIT}
            allLabel={t("videos.browse.filters.all")}
            action={
                <Button
                    variant="outline"
                    onClick={onBrowseAll}
                    className="h-9 shrink-0 px-3 sm:h-10 sm:px-4"
                >
                    <LayoutGridIcon className="size-4" />
                    {t("videos.browse.filters.browseAllShows")}
                </Button>
            }
        />
    );
}
