"use client";

import dayjs from "dayjs";
import { useCallback, useMemo, useSyncExternalStore } from "react";
import { LANGUAGE_LIST, USER_LANG } from "@/shared/presentation/constants/languages";
import { i18n } from "@/shared/presentation/i18n/config";
import { getClientLanguage } from "@/shared/presentation/utils/getClientLanguage";
import { setClientLanguage } from "@/shared/presentation/utils/setClientLanguage";
import { setLanguageCookie } from "@/shared/presentation/utils/setLanguageCookie";

function subscribeToLanguage(callback: () => void) {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
}

/**
 * useLanguageDropdown
 *
 * @description
 * Encapsulates current language resolution and language update logic
 * for the language dropdown.
 * Uses useSyncExternalStore so the server always renders the static default
 * snapshot while the client reads from localStorage — eliminating the
 * hydration mismatch without needing useEffect or hardcoded strings.
 *
 * On update it persists the choice, switches the shared i18next instance and the dayjs
 * locale, then dispatches a StorageEvent so every subscriber (including I18nProvider,
 * which mirrors <html lang>) reacts to the change.
 *
 * @returns currentCode, currentLanguage, updateLanguage
 */
export function useLanguageDropdown() {
    const currentCode = useSyncExternalStore(
        subscribeToLanguage,
        () => getClientLanguage(),
        () => LANGUAGE_LIST[0].code
    );

    const currentLanguage = useMemo(
        () => LANGUAGE_LIST.find((lang) => lang.code === currentCode) ?? LANGUAGE_LIST[0],
        [currentCode]
    );

    const updateLanguage = useCallback(
        (code: string) => {
            if (code === currentCode) return;

            setClientLanguage(code);
            setLanguageCookie(code);

            void i18n.changeLanguage(code);
            dayjs.locale(code);

            window.dispatchEvent(new StorageEvent("storage", { key: USER_LANG, newValue: code }));
        },
        [currentCode]
    );

    return { currentCode, currentLanguage, updateLanguage };
}
