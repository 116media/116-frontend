import { en } from "@/modules/settings/presentation/i18n/locales/en";
import { fr } from "@/modules/settings/presentation/i18n/locales/fr";

/**
 * settingsMessages
 *
 * @description
 * The settings module's translation bundle, one entry per locale. The composition
 * root (`resources.ts`) nests each locale under the `settings` namespace key, so
 * keys resolve as `t("settings.profile.title")`.
 */
export const settingsMessages = { en, fr } as const;
