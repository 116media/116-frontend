import { cookies } from "next/headers";

import { Api } from "@/shared/infrastructure/api/generated/116.api";
import { API_INTERNAL_URL, CLIENT_APP } from "@/shared/infrastructure/constants/common";
import { getServerLanguage } from "@/shared/presentation/utils/getServerLanguage";

/**
 * createServerApiClient
 *
 * @description
 * Factory that creates an authenticated API client for use in server components
 * and server actions. Reads the incoming request's cookie store and forwards it
 * in the Authorization header so session cookies are included server-side.
 * The Accept-Language header is resolved from the language cookie (written client-side
 * via setLanguageCookie), so server-rendered requests negotiate the same language the
 * user selected — falling back to the default locale for first-time visitors. The
 * Client-App header identifies the calling app and is sent on every request, matching
 * the browser client so SSR and client-side calls are indistinguishable to the backend.
 * Uses API_INTERNAL_URL when available (intra-cluster calls) and falls back to
 * the public NEXT_PUBLIC_API_URL.
 *
 * @returns Configured Api instance scoped to the current request
 */
export async function createServerApiClient() {
    const cookieStore = await cookies();
    const language = await getServerLanguage();

    return new Api({
        baseURL: API_INTERNAL_URL,
        withCredentials: true,
        headers: {
            Cookie: cookieStore.toString(),
            "Accept-Language": language,
            "Client-App": CLIENT_APP
        }
    });
}
