import { USER_LANG } from "@/shared/presentation/constants/languages";

/**
 * setClientLanguage
 *
 * @description
 * Persists the active language to localStorage — the client-side source of truth read back by
 * getClientLanguage(). No-op during SSR, where localStorage is unavailable, mirroring the
 * guard in setLanguageCookie. Pair with setLanguageCookie to keep the browser store and the
 * server-readable cookie in sync.
 *
 * @param code - The active language code to persist (e.g. "fr", "en")
 */
export function setClientLanguage(code: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(USER_LANG, code);
}
