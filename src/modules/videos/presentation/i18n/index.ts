import { en } from "@/modules/videos/presentation/i18n/locales/en";
import { fr } from "@/modules/videos/presentation/i18n/locales/fr";

/**
 * videosMessages
 *
 * @description
 * The videos module's translation bundle, one entry per locale. The i18n
 * composition root nests each locale under the `videos` namespace key, so
 * keys resolve as `t("videos.home.watchNow")`.
 */
export const videosMessages = { en, fr } as const;
