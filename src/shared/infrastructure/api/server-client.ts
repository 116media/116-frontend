import { cookies } from "next/headers";

import { Api } from "@/shared/infrastructure/api/generated/116.api";
import { API_INTERNAL_URL } from "@/shared/infrastructure/constants/common";

/**
 * createServerApiClient
 *
 * @description
 * Factory that creates an authenticated API client for use in server components
 * and server actions. Reads the incoming request's cookie store and forwards it
 * in the Authorization header so session cookies are included server-side.
 * Uses API_INTERNAL_URL when available (intra-cluster calls) and falls back to
 * the public NEXT_PUBLIC_API_URL.
 *
 * @returns Configured Api instance scoped to the current request
 */
export async function createServerApiClient() {
    const cookieStore = await cookies();

    return new Api({
        baseURL: API_INTERNAL_URL,
        withCredentials: true,
        headers: {
            Cookie: cookieStore.toString(),
            "Accept-Language": "fr"
        }
    });
}
