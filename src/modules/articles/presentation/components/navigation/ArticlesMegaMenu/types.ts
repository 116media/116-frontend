import type { IArticleCategoryEntity } from "@/modules/articles/domain/entities/IArticleCategoryEntity";
import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import type { IArticleTagEntity } from "@/modules/articles/domain/entities/IArticleTagEntity";

/**
 * ArticlesMegaMenuProps
 *
 * @description
 * Props for the articles mega menu panel.
 * Data is prefetched server-side in PublicLayout and passed down
 * through Header → DesktopNav → ArticlesMegaMenu.
 */
export interface ArticlesMegaMenuProps {
    categories: IArticleCategoryEntity[];
    promotedArticles: IArticleSummaryEntity[];
    popularTags: IArticleTagEntity[];
}

/**
 * ArticlesMegaMenuCategoryListProps
 *
 * @description
 * Props for the category list column inside the articles mega menu.
 */
export interface ArticlesMegaMenuCategoryListProps {
    categories: IArticleCategoryEntity[];
}
