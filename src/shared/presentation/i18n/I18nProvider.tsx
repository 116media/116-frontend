"use client";

import dayjs from "dayjs";
import { type ReactNode, useEffect, useMemo } from "react";
import { I18nextProvider } from "react-i18next";
import { USER_LANG } from "@/shared/presentation/constants/languages";
import { createI18nInstance, i18n } from "@/shared/presentation/i18n/config";
import { getClientLanguage } from "@/shared/presentation/utils/getClientLanguage";
import { setLanguageCookie } from "@/shared/presentation/utils/setLanguageCookie";

interface I18nProviderProps {
    initialLanguage: string;
    children: ReactNode;
}

/**
 * I18nProvider
 *
 * @description
 * Binds the React tree to an i18next instance already rendering in `initialLanguage` —
 * the language the server resolved from the request cookie. The server render, the
 * server-sent HTML, and the first client render therefore all agree, so there is no
 * post-mount language flip and no hydration mismatch.
 *
 * - On the server it builds a fresh per-request instance (via `createI18nInstance`) so
 *   two concurrent requests in different languages can never corrupt each other.
 * - In the browser it reuses the shared singleton — the one the API client and the
 *   notification/validation configs read — but aligns its language to `initialLanguage`
 *   synchronously, before the first paint, so those consumers never lag a language behind.
 *
 * After hydration it reconciles with the visitor's persisted preference in localStorage
 * (normally a no-op, since the cookie and localStorage are kept in sync) and subscribes
 * to the same `storage` event the language dropdown dispatches, keeping <html lang>
 * aligned with the active language.
 *
 * Mirrors the ThemeProvider pattern: a thin "use client" wrapper mounted once at the
 * app root.
 *
 * @param {I18nProviderProps} props - The initial language and the subtree to translate
 */
export function I18nProvider({ initialLanguage, children }: I18nProviderProps) {
    const instance = useMemo(() => {
        if (typeof window === "undefined") return createI18nInstance(initialLanguage);
        if (i18n.language !== initialLanguage) void i18n.changeLanguage(initialLanguage);

        dayjs.locale(initialLanguage);
        return i18n;
    }, [initialLanguage]);

    useEffect(() => {
        /**
         * applyLanguage
         *
         * @description
         * Aligns the i18next instance and the <html lang> attribute with a language code,
         * only switching i18next when the code actually changed.
         */
        const applyLanguage = (code: string) => {
            if (i18n.language !== code) void i18n.changeLanguage(code);

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

    return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}
