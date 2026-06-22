import { home } from "@/modules/articles/presentation/i18n/locales/en/home";

/**
 * en
 *
 * @description
 * English translation catalog for the articles module. This barrel composes the
 * module's namespaces (one per usage area, e.g. `home`), mirroring the shared
 * locale barrel. The composition root nests it under the `articles` key, so keys
 * resolve as `t("articles.home.categories")`. Must stay key-aligned with the French mirror.
 */
export const en = {
    home
} as const;
