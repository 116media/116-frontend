import { SHORT_RETURN_TO_PARAM } from "@/modules/shorts/presentation/constants/shortRoutes";
import { HOME_PATH, SHORT_DETAIL_PATH } from "@/shared/presentation/constants/paths";

const INTERNAL_URL_ORIGIN = "http://internal";

/**
 * Builds a short-detail path with an optional internal return destination.
 *
 * @param slug - The short slug.
 * @param returnTo - The page that opened the short.
 * @returns The encoded short-detail path.
 */
export function buildShortDetailPath(slug: string, returnTo?: string): string {
    const detailPath = SHORT_DETAIL_PATH.replace(":slug", slug);
    if (!returnTo) return detailPath;

    const params = new URLSearchParams({ [SHORT_RETURN_TO_PARAM]: returnTo });
    return `${detailPath}?${params.toString()}`;
}

/**
 * Resolves a return destination to a safe same-origin application path.
 *
 * @param candidate - The untrusted query parameter value.
 * @returns A validated internal path, or the homepage.
 */
export function resolveShortReturnPath(candidate?: string | string[]): string {
    if (typeof candidate !== "string" || !candidate.startsWith("/")) return HOME_PATH;

    try {
        const url = new URL(candidate, INTERNAL_URL_ORIGIN);
        if (url.origin !== INTERNAL_URL_ORIGIN) return HOME_PATH;
        return `${url.pathname}${url.search}${url.hash}`;
    } catch {
        return HOME_PATH;
    }
}
