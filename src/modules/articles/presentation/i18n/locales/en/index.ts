import { articleDetail } from "@/modules/articles/presentation/i18n/locales/en/article-detail";
import { articles } from "@/modules/articles/presentation/i18n/locales/en/articles";
import { home } from "@/modules/articles/presentation/i18n/locales/en/home";

/**
 * en
 *
 * @description
 * English translation catalog for the articles module. This barrel composes the
 * module's namespaces (one per usage area, e.g. `home`, plus the spread `articles`
 * bundle covering `card`, `grid` and `filters`, and the spread `articleDetail` bundle
 * covering `detail`, `share`, `comments` and `sidebar`), mirroring the shared locale
 * barrel. The composition root nests it under the `articles` key, so keys resolve as
 * `t("articles.home.categories")` or `t("articles.detail.backToArticles")`. Must stay
 * key-aligned with the French mirror.
 */
export const en = {
    ...articles,
    ...articleDetail,
    home
} as const;
