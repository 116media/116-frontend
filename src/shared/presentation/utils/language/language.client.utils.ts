import { setCookie } from "cookies-next/client";
import { USER_LANG } from "@/shared/presentation/constants/languages";

const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

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

/**
 * setClientLanguage
 *
 * @description
 * Persists the active language to localStorage — the client-side source of truth read
 * back by getClientLanguage(). No-op during SSR. Pair with setLanguageCookie to keep
 * the browser store and the server-readable cookie in sync.
 *
 * @param code - The active language code to persist (e.g. "fr", "en")
 */
export function setClientLanguage(code: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(USER_LANG, code);
}

/**
 * setLanguageCookie
 *
 * @description
 * Persists the active language in a cookie so the server can read the user's choice.
 *
 * @param code - The active language code (e.g. "fr", "en")
 */
export function setLanguageCookie(code: string): void {
    setCookie(USER_LANG, code, {
        maxAge: LANGUAGE_COOKIE_MAX_AGE,
        path: "/",
        sameSite: "lax"
    });
}
