"use client";

import { useTranslation } from "react-i18next";

import { useArticleCategories } from "@/modules/articles/presentation/hooks/useArticleCategories";
import { CategoryTabs } from "@/shared/presentation/layouts/CategoryTabs";

/**
 * Props for ArticlesToolbarCategoryTabs.
 *
 * @interface ArticlesToolbarCategoryTabsProps
 * @property {string | undefined} value - The selected category slug, or undefined for all.
 * @property {(categorySlug: string | undefined) => void} onChange - Emits the category slug.
 */
export interface ArticlesToolbarCategoryTabsProps {
    value: string | undefined;
    onChange: (categorySlug: string | undefined) => void;
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

    // The rail emits the value it is keyed by, and the URL carries slugs, not identifiers.
    const tabs = categories.map((category) => ({ id: category.slug, name: category.name }));

    return (
        <CategoryTabs
            value={value}
            onChange={onChange}
            categories={tabs}
            allLabel={t("articles.filters.all")}
        />
    );
}
