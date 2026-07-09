"use client";

import dayjs from "dayjs";
import { useCallback, useMemo, useSyncExternalStore } from "react";
import { LANGUAGE_LIST, USER_LANG } from "@/shared/presentation/constants/languages";
import { i18n } from "@/shared/presentation/i18n/config";
import {
    getClientLanguage,
    setClientLanguage,
    setLanguageCookie
} from "@/shared/presentation/utils/language/language.client.utils";

function subscribeToLanguage(callback: () => void) {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
}

/**
 * useLanguageDropdown
 *
 * @description
 * Current-language resolution and update logic for the language dropdown. Uses
 * useSyncExternalStore to avoid hydration mismatches; updates persist the choice,
 * switch i18next and dayjs, and dispatch a StorageEvent for subscribers.
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
