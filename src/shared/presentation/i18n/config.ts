import dayjs from "dayjs";
import "dayjs/locale/fr";
import "dayjs/locale/en";
import relativeTime from "dayjs/plugin/relativeTime";
import i18next, { type i18n as I18nInstance } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import { LANGUAGE_LIST } from "@/shared/presentation/constants/languages";
import { resources } from "@/shared/presentation/i18n/resources";

/**
 * DEFAULT_NAMESPACE
 *
 * @description
 * The single namespace every translation key resolves against. Each locale barrel
 * spreads all of its namespace modules into this one flat namespace, so call sites
 * use `t("general.viewAll")` without selecting a namespace.
 */
export const DEFAULT_NAMESPACE = "translation";

/**
 * SUPPORTED_LANGUAGES
 *
 * @description
 * The language codes i18next will accept. Derived from LANGUAGE_LIST so the switcher
 * and the i18n engine can never drift out of sync. The first entry ("fr") is the
 * default and fallback.
 */
export const SUPPORTED_LANGUAGES = LANGUAGE_LIST.map((language) => language.code);

/**
 * DEFAULT_LANGUAGE
 *
 * @description
 * The SSR-stable default locale (the first entry in LANGUAGE_LIST, "fr"). The server and the
 * first client render both use this language, so the rendered markup matches and hydration never
 * mismatches. The user's persisted language is applied after mount by I18nProvider — never during
 * the initial render — because it lives in localStorage, which the server cannot read.
 */
export const DEFAULT_LANGUAGE = LANGUAGE_LIST[0].code;

/**
 * i18n
 *
 * @description
 * The shared, pre-initialized i18next instance for the entire app. Initialized once at
 * module load with the React bindings and the SSR-stable default language.
 *
 * - `lng` is seeded with DEFAULT_LANGUAGE so the server snapshot and the first client render
 *   agree; I18nProvider switches to the persisted language on mount (no hydration mismatch)
 * - `fallbackLng` is "fr" so missing keys resolve to French rather than the raw key
 * - `supportedLngs` restricts switching to the configured locales
 * - `interpolation.escapeValue` is false because React already escapes rendered output
 */
export const i18n: I18nInstance = i18next.createInstance();

i18n.use(initReactI18next).init({
    resources,
    fallbackLng: "fr",
    lng: DEFAULT_LANGUAGE,
    ns: [DEFAULT_NAMESPACE],
    defaultNS: DEFAULT_NAMESPACE,
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: {
        escapeValue: false
    },
    react: {
        useSuspense: false
    }
});

/**
 * dayjs locale + plugin bootstrap.
 *
 * @description
 * Registers the relativeTime plugin and the supported locale data, then sets the default dayjs
 * locale so server-rendered and first-paint dates match. I18nProvider (on mount) and the language
 * switch move the active locale to the user's persisted language.
 */
dayjs.extend(relativeTime);
dayjs.locale(DEFAULT_LANGUAGE);

export default i18n;
