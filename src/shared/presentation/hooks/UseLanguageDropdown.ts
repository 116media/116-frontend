"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { LANGUAGE_LIST, USER_LANG } from "@/shared/presentation/constants/languages";
import { getLanguage } from "@/shared/presentation/utils/getLanguage";

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
 * Persists the selected language to localStorage under the USER_LANG key.
 *
 * @returns currentCode, currentLanguage, updateLanguage
 */
export function useLanguageDropdown() {
    const currentCode = useSyncExternalStore(
        subscribeToLanguage,
        () => getLanguage(),
        () => LANGUAGE_LIST[0].code
    );

    const currentLanguage = useMemo(
        () => LANGUAGE_LIST.find((lang) => lang.code === currentCode) ?? LANGUAGE_LIST[0],
        [currentCode]
    );

    const updateLanguage = useCallback(
        (code: string) => {
            if (code === currentCode) return;
            localStorage.setItem(USER_LANG, code);
            window.dispatchEvent(new StorageEvent("storage", { key: USER_LANG, newValue: code }));
            // TODO: sync with i18next when translations are wired up
        },
        [currentCode]
    );

    return { currentCode, currentLanguage, updateLanguage };
}
