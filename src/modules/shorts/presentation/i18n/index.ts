import { en } from "@/modules/shorts/presentation/i18n/locales/en";
import { fr } from "@/modules/shorts/presentation/i18n/locales/fr";

/**
 * shortsMessages
 *
 * @description
 * The shorts module's translation bundle, one entry per locale. The i18n
 * composition root nests each locale under the `shorts` namespace key, so keys
 * resolve as `t("shorts.player.next")`.
 */
export const shortsMessages = { en, fr } as const;
