import { articlesMessages } from "@/modules/articles/presentation/i18n";
import { authMessages } from "@/modules/auth/presentation/i18n";
import { settingsMessages } from "@/modules/settings/presentation/i18n";
import { shortsMessages } from "@/modules/shorts/presentation/i18n";
import { videosMessages } from "@/modules/videos/presentation/i18n";
import sharedEn from "@/shared/presentation/i18n/locales/en";
import sharedFr from "@/shared/presentation/i18n/locales/fr";

/**
 * en
 *
 * @description
 * The composed English translation catalog: shared cross-cutting namespaces plus each
 * module's bundle nested under its module key. Its type is the canonical key shape
 * consumed by the react-i18next augmentation, so it must stay key-complete.
 */
export const en = {
    ...sharedEn,
    articles: articlesMessages.en,
    videos: videosMessages.en,
    shorts: shortsMessages.en,
    auth: authMessages.en,
    settings: settingsMessages.en
} as const;

/**
 * fr
 *
 * @description
 * The composed French catalog, mirror of {@link en}. French is the default and fallback
 * locale; it must hold the exact same keys as the English catalog.
 */
export const fr = {
    ...sharedFr,
    articles: articlesMessages.fr,
    videos: videosMessages.fr,
    shorts: shortsMessages.fr,
    auth: authMessages.fr,
    settings: settingsMessages.fr
} as const;

/**
 * resources
 *
 * @description
 * The i18n composition root: aggregates each module's `<m>Messages` alongside the shared
 * namespaces into one resource store, one entry per locale. Each locale exposes a single
 * `translation` namespace that `config.ts` registers with i18next.
 */
export const resources = {
    fr: { translation: fr },
    en: { translation: en }
} as const;
