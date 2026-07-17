import { en } from "@/modules/favorites/presentation/i18n/locales/en";
import { fr } from "@/modules/favorites/presentation/i18n/locales/fr";

/**
 * favoritesMessages
 *
 * @description
 * The favorites module's translation bundle, one entry per locale. The i18n composition
 * root imports this and nests each locale under the `favorites` namespace key, so keys
 * resolve as `t("favorites.navigation.articles")`.
 */
export const favoritesMessages = { en, fr } as const;
