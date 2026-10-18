import { en } from "@/modules/search/presentation/i18n/locales/en";
import { fr } from "@/modules/search/presentation/i18n/locales/fr";

/**
 * searchMessages
 *
 * @description
 * The search module's translation bundle, one entry per locale. The i18n composition
 * root nests each locale under the `search` namespace key, so keys resolve as
 * `t("search.field.label")`.
 */
export const searchMessages = { en, fr } as const;
