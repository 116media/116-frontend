"use client";

import { useTranslation } from "react-i18next";

import { MegaMenuRow } from "@/shared/presentation/components/ui/MegaMenuRow";
import { ARTICLES_PATH } from "@/shared/presentation/constants/paths";
import type { ArticlesMegaMenuCategoryListProps } from "./types";

/**
 * ArticlesMegaMenuCategoryList
 *
 * @description
 * Left column of the articles mega menu: an "all articles" row above every article
 * category, each linking to the articles list filtered by it.
 */
export function ArticlesMegaMenuCategoryList({ categories }: ArticlesMegaMenuCategoryListProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col">
            <p className="mb-3 pr-3 font-bold text-muted-foreground text-xs uppercase tracking-wider">
                {t("articles.home.categories")}
            </p>
            <div className="h-px bg-border/60" />

            <MegaMenuRow
                href={ARTICLES_PATH}
                label={t("general.all")}
            />

            {categories.map((category) => (
                <MegaMenuRow
                    key={category.id}
                    label={category.name}
                    count={category.publishedCount}
                    href={`${ARTICLES_PATH}?categoryId=${category.id}`}
                />
            ))}
        </div>
    );
}
