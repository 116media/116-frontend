import dayjs from "dayjs";
import "dayjs/locale/fr";
import "dayjs/locale/en";
import relativeTime from "dayjs/plugin/relativeTime";
import i18next, { type i18n as I18nInstance } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import { LANGUAGE_LIST } from "@/shared/presentation/constants/languages";
import { resources } from "@/shared/presentation/i18n/resources";

export const DEFAULT_NAMESPACE = "translation";

export const SUPPORTED_LANGUAGES = LANGUAGE_LIST.map((language) => language.code);

export const DEFAULT_LANGUAGE = LANGUAGE_LIST[0].code;

/**
 * BASE_INIT_OPTIONS
 *
 * @description
 * The i18next init options shared by every instance (browser singleton and per-request
 * server instances). Only the active language varies, so `lng` is supplied by
 * `createI18nInstance`. French is the fallback for missing keys.
 */
const BASE_INIT_OPTIONS = {
    resources,
    fallbackLng: "fr",
    ns: [DEFAULT_NAMESPACE],
    defaultNS: DEFAULT_NAMESPACE,
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: {
        escapeValue: false
    },
    react: {
        useSuspense: false
    }
} as const;

/**
 * createI18nInstance
 *
 * @description
 * Builds a fully-initialized i18next instance bound to React and seeded to `lng`. The
 * server calls this once per request so concurrent requests never share a mutable
 * language, while the browser uses the module singleton below.
 *
 * @param lng - The language the instance renders in
 * @returns A ready-to-use i18next instance
 */
export function createI18nInstance(lng: string): I18nInstance {
    const instance = i18next.createInstance();
    instance.use(initReactI18next).init({ ...BASE_INIT_OPTIONS, lng });
    return instance;
}

/**
 * i18n
 *
 * @description
 * The browser-side singleton shared by consumers that read the active language outside
 * React (API client headers, notification configs, validation messages). Seeded to
 * DEFAULT_LANGUAGE; I18nProvider aligns it with the server language before first paint.
 */
export const i18n: I18nInstance = createI18nInstance(DEFAULT_LANGUAGE);

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
