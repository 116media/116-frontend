"use client";

import dayjs from "dayjs";
import { type ReactNode, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { USER_LANG } from "@/shared/presentation/constants/languages";
import { i18n } from "@/shared/presentation/i18n/config";
import { getClientLanguage } from "@/shared/presentation/utils/getClientLanguage";
import { setLanguageCookie } from "@/shared/presentation/utils/setLanguageCookie";

interface I18nProviderProps {
    children: ReactNode;
}

/**
 * I18nProvider
 *
 * @description
 * Binds the React tree to the shared i18next instance so any component can read
 * translations through useTranslation(). On mount it re-applies the language persisted
 * in localStorage (the SSR snapshot is always "fr"), then subscribes to the same
 * `storage` event the language dropdown dispatches so a switch in one place updates
 * the whole tree. Keeps <html lang> aligned with the active language.
 *
 * Mirrors the ThemeProvider pattern: a thin "use client" wrapper mounted once at the
 * app root.
 *
 * @param {I18nProviderProps} props - The subtree to provide translations to
 */
export function I18nProvider({ children }: I18nProviderProps) {
    useEffect(() => {
        /**
         * applyLanguage
         *
         * @description
         * Aligns the i18next instance and the <html lang> attribute with a language code,
         * only switching i18next when the code actually changed.
         */
        const applyLanguage = (code: string) => {
            if (i18n.language !== code) {
                void i18n.changeLanguage(code);
            }
            dayjs.locale(code);
            document.documentElement.lang = code;
        };

        applyLanguage(getClientLanguage());

        // Bridge: ensure the language cookie exists for visitors who set their preference
        // before cookie persistence was added, so the server API client can read it.
        setLanguageCookie(getClientLanguage());

        /**
         * handleStorage
         *
         * @description
         * Responds to the StorageEvent dispatched by the language dropdown (and to native
         * cross-tab storage events) by re-reading the persisted language and applying it.
         */
        const handleStorage = (event: StorageEvent) => {
            if (event.key && event.key !== USER_LANG) return;
            applyLanguage(getClientLanguage());
        };

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
