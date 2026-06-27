import { articlesMessages } from "@/modules/articles/presentation/i18n";
import { authMessages } from "@/modules/auth/presentation/i18n";
import { settingsMessages } from "@/modules/settings/presentation/i18n";
import { videosMessages } from "@/modules/videos/presentation/i18n";
import sharedEn from "@/shared/presentation/i18n/locales/en";
import sharedFr from "@/shared/presentation/i18n/locales/fr";

/**
 * en
 *
 * @description
 * The composed English translation catalog. Spreads the shared cross-cutting namespaces
 * (general, navigation, form, validator, apiErrors) and nests each module's English bundle
 * under its module key. This object's type is the canonical key shape consumed by the
 * react-i18next augmentation in `resources.d.ts`, so it must stay key-complete:
 * `t("general.viewAll")` for shared keys, `t("videos.home.watchNow")` for module keys.
 */
export const en = {
    ...sharedEn,
    articles: articlesMessages.en,
    videos: videosMessages.en,
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
    auth: authMessages.fr,
    settings: settingsMessages.fr
} as const;

/**
 * resources
 *
 * @description
 * The i18n composition root for the frontend — the translation analogue of
 * `service.locator.ts`. Just as the DI container aggregates each module's
 * `registerXDependencies`, this file aggregates each module's `<m>Messages` alongside the
 * shared namespaces into one resource store, one entry per locale. Modules own their
 * strings; this root composes them. Each locale exposes a single `translation` namespace
 * (the flat composed object) that `config.ts` registers with i18next.
 */
export const resources = {
    fr: { translation: fr },
    en: { translation: en }
} as const;
