import { ArticlesMegaMenuCard } from "@/modules/articles/presentation/components/cards/ArticlesMegaMenuCard";
import { DUMMY_ARTICLES } from "@/modules/articles/presentation/data/mega-menu.dummy";
import { ARTICLES_PATH } from "@/shared/presentation/constants/paths";
import {
    MegaMenuShell,
    MegaMenuShellCards,
    MegaMenuShellCategories
} from "@/shared/presentation/layouts/MegaMenuShell";
import { ArticlesMegaMenuCategoryList } from "./ArticlesMegaMenu.CategoryList";
import type { ArticlesMegaMenuProps } from "./types";

/**
 * ArticlesMegaMenu
 *
 * @description
 * Mega menu panel for the NEWS nav item, built on MegaMenuShell. Data is prefetched
 * server-side and received as props; dummy placeholders stand in when no promoted
 * articles are available.
 */
export function ArticlesMegaMenu({
    categories,
    promotedArticles,
    popularTags
}: ArticlesMegaMenuProps) {
    const cards = promotedArticles.length > 0 ? promotedArticles.slice(0, 4) : DUMMY_ARTICLES;
    const featured = cards.slice(0, 2);
    const compact = cards.slice(2, 4);

    return (
        <MegaMenuShell
            popularTags={popularTags}
            tagsBasePath={ARTICLES_PATH}
        >
            <MegaMenuShellCategories>
                <ArticlesMegaMenuCategoryList categories={categories} />
            </MegaMenuShellCategories>

            <MegaMenuShellCards viewAllHref={ARTICLES_PATH}>
                <div className="grid grid-cols-2 gap-2 grid-rows-[288px] lg:grid-rows-[320px]">
                    <ArticlesMegaMenuCard.FeaturedOverlay article={featured[0]} />
                    <ArticlesMegaMenuCard.FeaturedGradient article={featured[1]} />
                </div>
                <div className="grid grid-cols-2 gap-2 grid-rows-[168px] lg:grid-rows-[180px]">
                    {compact.map((article) => (
                        <ArticlesMegaMenuCard.Compact
                            key={article.id}
                            article={article}
                        />
                    ))}
                </div>
            </MegaMenuShellCards>
        </MegaMenuShell>
    );
}
