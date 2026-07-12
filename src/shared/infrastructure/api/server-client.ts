import { cookies } from "next/headers";

import { Api } from "@/shared/infrastructure/api/generated/116.api";
import { API_INTERNAL_URL, CLIENT_APP } from "@/shared/infrastructure/constants/common";
import { getServerLanguage } from "@/shared/presentation/utils/language/language.server.utils";

/**
 * createServerApiClient
 *
 * @description
 * Creates an authenticated API client for server components and server actions.
 * Forwards the request's cookies, resolves Accept-Language from the language cookie,
 * and sends the same Client-App header as the browser client over API_INTERNAL_URL.
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
