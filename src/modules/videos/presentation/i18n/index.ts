import { en } from "@/modules/videos/presentation/i18n/locales/en";
import { fr } from "@/modules/videos/presentation/i18n/locales/fr";

/**
 * videosMessages
 *
 * @description
 * The videos module's translation bundle, one entry per locale. The i18n composition
 * root (`src/shared/presentation/i18n/resources.ts`) imports this and nests each locale
 * under the `videos` namespace key, mirroring how `service.locator.ts` aggregates each
 * module's `registerXDependencies`. Each locale barrel composes the module's
 * namespaces (one per usage area, e.g. `home`), so keys resolve as
 * `t("videos.home.watchNow")`.
 */
export const videosMessages = { en, fr } as const;
