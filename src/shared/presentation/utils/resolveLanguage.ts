import { LANGUAGE_LIST } from "@/shared/presentation/constants/languages";

/**
 * resolveLanguage
 *
 * @description
 * Validates a raw language value against the supported list and returns it when valid,
 * otherwise falls back to the default language (the first entry in LANGUAGE_LIST).
 * Pure and environment-agnostic — safe to call on both client and server.
 *
 * @param value - A candidate language code (e.g. from a cookie or storage), possibly unset
 * @returns A supported language code, never undefined
 */
export function resolveLanguage(value: string | undefined | null): string {
    return LANGUAGE_LIST.some((language) => language.code === value)
        ? (value as string)
        : LANGUAGE_LIST[0].code;
}
