import { en } from "@/modules/auth/presentation/i18n/locales/en";
import { fr } from "@/modules/auth/presentation/i18n/locales/fr";

/**
 * authMessages
 *
 * @description
 * The auth module's translation bundle, one entry per locale. The composition root
 * (`resources.ts`) nests each locale under the `auth` namespace key, so keys resolve
 * as `t("auth.login.title")`.
 */
export const authMessages = { en, fr } as const;
