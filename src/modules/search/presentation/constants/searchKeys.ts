import type { ESearchScope } from "@/modules/search/domain/enums/ESearchScope";

/**
 * The shortest term the API accepts. Below it no request is made at all.
 */
export const MIN_SEARCH_TERM_LENGTH = 2;

/**
 * The longest term the API accepts.
 */
export const MAX_SEARCH_TERM_LENGTH = 120;

/**
 * How long typing settles before the overlay navigates or the page refetches.
 */
export const SEARCH_DEBOUNCE_MS = 300;

/**
 * Results per page on the search route.
 */
export const SEARCH_PAGE_SIZE = 20;

/**
 * How many hits the overlay previews before handing off to the results route.
 */
export const SEARCH_OVERLAY_RESULTS = 6;

/**
 * Stable TanStack Query keys for search. The term and the scope are both in the key,
 * so switching tabs reuses a cached page rather than refetching it.
 */
export const searchKeys = {
    all: ["search"] as const,
    results: (query: string, scope: ESearchScope, pageIndex: number) =>
        [...searchKeys.all, "results", query, scope, pageIndex] as const
};
