import { USER_LANG } from "@/shared/presentation/constants/languages";

/**
 * getClientLanguage
 *
 * @description
 * Reads the user's preferred language from localStorage.
 * Falls back to "fr" if no preference is stored or during SSR.
 *
 * @returns The active language code ("fr" or "en")
 */
export function getClientLanguage(): string {
    if (typeof window === "undefined") return "fr";
    return localStorage.getItem(USER_LANG) ?? "fr";
}
