import { getCookie } from "cookies-next/server";
import { cookies } from "next/headers";
import { USER_LANG } from "@/shared/presentation/constants/languages";
import { resolveLanguage } from "@/shared/presentation/utils/resolveLanguage";

/**
 * getServerLanguage
 *
 * @description
 * Server-side counterpart to getClientLanguage(). Reads and validates the persisted language
 * cookie, falling back to the default locale when it is absent.
 *
 * @returns The active, validated language code for the current request
 */
export async function getServerLanguage(): Promise<string> {
    const value = await getCookie(USER_LANG, { cookies });
    return resolveLanguage(value);
}
