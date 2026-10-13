"use client";

import { useTranslation } from "react-i18next";

import { VIDEO_BROWSE_CHIP_LIMIT } from "@/modules/videos/presentation/constants/videoKeys";
import { useVideoCategories } from "@/modules/videos/presentation/hooks/useVideoCategories";
import { CategoryTabs } from "@/shared/presentation/components/navigation/CategoryTabs";
import { Button } from "@/shared/presentation/components/ui/Button";
import { LayoutGridIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for VideosToolbarCategoryTabs.
 *
 * @interface VideosToolbarCategoryTabsProps
 * @property {string | undefined} value - The selected category id, or undefined for all.
 * @property {(categoryId: string | undefined) => void} onChange - Emits the category id.
 * @property {() => void} onBrowseAll - Opens the "browse all shows" modal.
 */
export interface VideosToolbarCategoryTabsProps {
    value: string | undefined;
    onBrowseAll: () => void;
    onChange: (categoryId: string | undefined) => void;
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

    return (
        <CategoryTabs
            value={value}
            onChange={onChange}
            categories={categories}
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
