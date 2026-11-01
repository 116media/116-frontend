import { en } from "@/modules/coming-soon/presentation/i18n/locales/en";
import { fr } from "@/modules/coming-soon/presentation/i18n/locales/fr";

/**
 * comingSoonMessages
 *
 * @description
 * The coming-soon module's translation bundle, one entry per locale. The i18n
 * composition root nests each locale under the `comingSoon` namespace key, so keys
 * resolve as `t("comingSoon.launch.title")`.
 */
export const comingSoonMessages = { en, fr } as const;
