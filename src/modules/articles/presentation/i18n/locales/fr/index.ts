import { articleDetail } from "@/modules/articles/presentation/i18n/locales/fr/article-detail";
import { articles } from "@/modules/articles/presentation/i18n/locales/fr/articles";
import { bookmarks } from "@/modules/articles/presentation/i18n/locales/fr/bookmarks";
import { home } from "@/modules/articles/presentation/i18n/locales/fr/home";

/**
 * fr
 *
 * @description
 * French translation catalog for the articles module. Composes the module's namespaces;
 * the composition root nests the result under the `articles` key, so keys resolve as
 * `t("articles.home.categories")`. Must stay key-aligned with the English mirror.
 */
export const fr = {
    ...articles,
    ...articleDetail,
    ...bookmarks,
    home
} as const;
