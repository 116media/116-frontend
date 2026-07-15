import { SITE_URL } from "@/shared/infrastructure/constants/common";
import { SHORTS_PATH } from "@/shared/presentation/constants/paths";

/**
 * shortShareUrl
 *
 * @description
 * Builds the shareable absolute URL for a short — the `/shorts/{slug}` deep-link
 * route, which opens the short directly in the full-screen player. Unlike the shared
 * `resolveShareUrl`, it targets the short's own path rather than the current page, so
 * it is correct even when the player is a modal opened over another route.
 *
 * @param slug - The short's slug.
 * @returns {string} The absolute shareable URL.
 */
export function shortShareUrl(slug: string): string {
    const path = `${SHORTS_PATH}/${slug}`;
    if (typeof window !== "undefined") return `${window.location.origin}${path}`;
    return `${SITE_URL}${path}`;
}

/**
 * prefersReducedMotion
 *
 * @description
 * Reports whether the visitor asked for reduced motion, so animations (the heart
 * burst, smooth scroll) can degrade to instant. Returns false during SSR.
 *
 * @returns {boolean} True when `prefers-reduced-motion: reduce` matches.
 */
export function prefersReducedMotion(): boolean {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
