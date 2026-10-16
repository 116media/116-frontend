"use client";

import { useTranslation } from "react-i18next";

import { ArticlesMegaMenuCard } from "@/modules/articles/presentation/components/cards/ArticlesMegaMenuCard";
import { DUMMY_ARTICLES } from "@/modules/articles/presentation/data/mega-menu.dummy";
import { MegaMenuRow } from "@/shared/presentation/components/ui/MegaMenuRow";
import { ARTICLES_PATH } from "@/shared/presentation/constants/paths";
import { MobileMegaMenu } from "@/shared/presentation/layouts/MobileMegaMenu";

import type { ArticlesMobileMenuProps } from "./types";

/**
 * ArticlesMobileMenu
 *
 * @description
 * The NEWS panel of the mobile menu: every article category with its published
 * count, the promoted cards and the popular tags. Mirrors ArticlesMegaMenu with the
 * three columns stacked.
 */
export function ArticlesMobileMenu({
    categories,
    promotedArticles,
    popularTags,
    onNavigate
}: ArticlesMobileMenuProps) {
    const { t } = useTranslation();

    const cards = promotedArticles.length > 0 ? promotedArticles.slice(0, 4) : DUMMY_ARTICLES;
    const featured = cards.slice(0, 2);
    const compact = cards.slice(2, 4);

    return (
        <div className="flex flex-col pb-4">
            <MobileMegaMenu.Section title={t("articles.home.categories")}>
                <div className="flex flex-col">
                    <MegaMenuRow
                        href={ARTICLES_PATH}
                        onNavigate={onNavigate}
                        label={t("general.all")}
                    />
                    {categories.map((category) => (
                        <MegaMenuRow
                            key={category.id}
                            label={category.name}
                            onNavigate={onNavigate}
                            count={category.publishedCount}
                            href={`${ARTICLES_PATH}?categoryId=${category.id}`}
                        />
                    ))}
                </div>
            </MobileMegaMenu.Section>

            <MobileMegaMenu.Featured
                variant="plain"
                onNavigate={onNavigate}
                viewAllHref={ARTICLES_PATH}
            >
                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 grid-rows-[200px] gap-3 md:grid-rows-[264px]">
                        {featured[0] && (
                            <ArticlesMegaMenuCard.FeaturedOverlay article={featured[0]} />
                        )}
                        {featured[1] && (
                            <ArticlesMegaMenuCard.FeaturedGradient article={featured[1]} />
                        )}
                    </div>
                    {compact.length > 0 && (
                        <div className="grid grid-cols-2 grid-rows-[150px] gap-3 md:grid-rows-[196px]">
                            {compact.map((article) => (
                                <ArticlesMegaMenuCard.Compact
                                    key={article.id}
                                    article={article}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </MobileMegaMenu.Featured>

            <MobileMegaMenu.Tags
                tags={popularTags}
                onNavigate={onNavigate}
                basePath={ARTICLES_PATH}
            />
        </div>
    );
}
