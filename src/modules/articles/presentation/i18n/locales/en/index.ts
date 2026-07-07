import { articleDetail } from "@/modules/articles/presentation/i18n/locales/en/article-detail";
import { articles } from "@/modules/articles/presentation/i18n/locales/en/articles";
import { home } from "@/modules/articles/presentation/i18n/locales/en/home";

/**
 * en
 *
 * @description
 * English translation catalog for the articles module. Composes the module's namespaces;
 * the composition root nests the result under the `articles` key, so keys resolve as
 * `t("articles.home.categories")`. Must stay key-aligned with the French mirror.
 */
export const en = {
    ...articles,
    ...articleDetail,
    home
} as const;
