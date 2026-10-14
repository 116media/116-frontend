import type { ArticlesMegaMenuProps } from "@/modules/articles/presentation/components/navigation/ArticlesMegaMenu/types";

/**
 * ArticlesMobileMenuProps
 *
 * @description
 * The articles mega menu payload plus the callback that closes the hosting panel
 * once a row, card or tag navigates.
 */
export interface ArticlesMobileMenuProps extends ArticlesMegaMenuProps {
    onNavigate: () => void;
}
