import { favorites } from "@/modules/favorites/presentation/i18n/locales/en/favorites";

/**
 * en
 *
 * @description
 * English translation catalog for the favorites module. The composition root nests the
 * result under the `favorites` key, so keys resolve as `t("favorites.navigation.articles")`.
 * Must stay key-aligned with the French mirror.
 */
export const en = {
    ...favorites
} as const;
