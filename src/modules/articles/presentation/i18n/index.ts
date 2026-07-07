import { en } from "@/modules/articles/presentation/i18n/locales/en";
import { fr } from "@/modules/articles/presentation/i18n/locales/fr";

/**
 * articlesMessages
 *
 * @description
 * The articles module's translation bundle, one entry per locale. The i18n composition
 * root imports this and nests each locale under the `articles` namespace key, so keys
 * resolve as `t("articles.home.categories")`.
 */
export const articlesMessages = { en, fr } as const;
