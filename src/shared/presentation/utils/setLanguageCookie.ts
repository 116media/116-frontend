import { setCookie } from "cookies-next/client";
import { USER_LANG } from "@/shared/presentation/constants/languages";

const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

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
