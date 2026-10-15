import { ArticlesMegaMenu as ArticlesMegaMenuRoot } from "./ArticlesMegaMenu";
import { ArticlesMegaMenuCategoryList } from "./ArticlesMegaMenu.CategoryList";

export type { ArticlesMegaMenuProps } from "./types";

/**
 * ArticlesMegaMenu
 *
 * @description
 * The articles mega menu: the root composes the shell, `.CategoryList` the category column.
 */
export const ArticlesMegaMenu = {
    Root: ArticlesMegaMenuRoot,
    CategoryList: ArticlesMegaMenuCategoryList
} as const;
