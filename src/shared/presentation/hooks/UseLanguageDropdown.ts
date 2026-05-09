"use client";

import { useCallback, useMemo, useState } from "react";
import { LANGUAGE_LIST, USER_LANG } from "@/shared/presentation/constants/languages";
import { getLanguage } from "@/shared/presentation/utils/getLanguage";

/**
 * useLanguageDropdown
 *
 * @description
 * Encapsulates current language resolution and language update logic
 * for the language dropdown.
 * Initializes from localStorage via getLanguage() using a lazy useState
 * initializer — this runs only on the client so there is no SSR mismatch.
 * Persists the selected language to localStorage under the USER_LANG key.
 *
 * @returns currentCode, currentLanguage, updateLanguage
 */
export function useLanguageDropdown() {
    const [currentCode, setCurrentCode] = useState<string>(() => getLanguage());

    const currentLanguage = useMemo(
        () => LANGUAGE_LIST.find((lang) => lang.code === currentCode) ?? LANGUAGE_LIST[0],
        [currentCode]
    );

    const updateLanguage = useCallback(
        (code: string) => {
            if (code === currentCode) return;
            setCurrentCode(code);
            localStorage.setItem(USER_LANG, code);
            // TODO: sync with i18next when translations are wired up
        },
        [currentCode]
    );

    return { currentCode, currentLanguage, updateLanguage };
}
