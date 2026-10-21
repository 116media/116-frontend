"use client";

import { useTranslation } from "react-i18next";

import { useArticleCategories } from "@/modules/articles/presentation/hooks/useArticleCategories";
import { CategoryTabs } from "@/shared/presentation/components/navigation/CategoryTabs";

/**
 * Props for ArticlesToolbarCategoryTabs.
 *
 * @interface ArticlesToolbarCategoryTabsProps
 * @property {string | undefined} value - The selected category id, or undefined for all.
 * @property {(categoryId: string | undefined) => void} onChange - Emits the category id.
 */
export interface ArticlesToolbarCategoryTabsProps {
    value: string | undefined;
    onChange: (categoryId: string | undefined) => void;
}

/**
 * ArticlesToolbarCategoryTabs
 *
 * @description
 * The article feed's category rail: the shared {@link CategoryTabs} fed with the active
 * article categories, with an "all" tab that clears the filter.
 */
export function ArticlesToolbarCategoryTabs({ value, onChange }: ArticlesToolbarCategoryTabsProps) {
    const { t } = useTranslation();
    const { data: categories = [] } = useArticleCategories();

    return (
        <CategoryTabs
            value={value}
            onChange={onChange}
            categories={categories}
            allLabel={t("articles.filters.all")}
        />
    );
}
