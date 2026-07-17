import type { IShortVideoActivityPage } from "@/modules/shorts/domain/entities/IShortVideoActivityPage";
import { SHORTS_FAVORITES_PAGE_SIZE } from "@/modules/shorts/presentation/constants/shortKeys";

import { generateDummyShorts } from "./shorts.dummy";

/**
 * Fixed epoch the dummy favorites timestamps count back from (deterministic, SSR-safe).
 */
const DUMMY_BASE_MS = Date.parse("2026-06-01T09:00:00Z");

/**
 * One hour in milliseconds.
 */
const HOUR_MS = 3_600_000;

/**
 * Number of items every dummy shorts favorites page carries.
 */
const FAVORITES_COUNT = 8;

/**
 * isoHoursFromBase
 *
 * @description
 * Deterministic ISO timestamp for a dummy favorites entry: `DUMMY_BASE_MS` minus `index`
 * hours, so newer items sort first and the value never depends on the current time.
 *
 * @param index - The entry's position in the list.
 * @returns An ISO 8601 timestamp string.
 */
function isoHoursFromBase(index: number): string {
    return new Date(DUMMY_BASE_MS - index * HOUR_MS).toISOString();
}

/**
 * buildShortsActivityPage
 *
 * @description
 * Builds a single dummy `IShortVideoActivityPage` from the shared dummy shorts pool,
 * stamping each entry with the given interaction count. Always the only page
 * (`hasNextPage: false`) so infinite scroll renders once and stops.
 *
 * @param pageIndex - Zero-based page index the query requested.
 * @param interactionCount - Interaction count stamped on every entry.
 * @returns The dummy shorts activity page.
 */
function buildShortsActivityPage(
    pageIndex: number,
    interactionCount: number
): IShortVideoActivityPage {
    const shorts = generateDummyShorts(FAVORITES_COUNT);
    const items = shorts.map((shortVideo, index) => ({
        shortVideo,
        lastInteractedAt: isoHoursFromBase(index),
        interactionCount
    }));
    return {
        items,
        pageIndex,
        pageSize: SHORTS_FAVORITES_PAGE_SIZE,
        count: items.length,
        hasNextPage: false
    };
}

/**
 * dummyLikedShortsPage
 *
 * @description
 * A single dummy page of the authenticated user's liked shorts as an
 * `IShortVideoActivityPage`.
 *
 * @param pageIndex - Zero-based page index the query requested.
 * @returns The dummy liked-shorts page.
 */
export function dummyLikedShortsPage(pageIndex: number): IShortVideoActivityPage {
    return buildShortsActivityPage(pageIndex, 1);
}

/**
 * dummySavedShortsPage
 *
 * @description
 * A single dummy page of the authenticated user's saved shorts as an
 * `IShortVideoActivityPage`; saves are single interactions (`interactionCount: 1`).
 *
 * @param pageIndex - Zero-based page index the query requested.
 * @returns The dummy saved-shorts page.
 */
export function dummySavedShortsPage(pageIndex: number): IShortVideoActivityPage {
    return buildShortsActivityPage(pageIndex, 1);
}

/**
 * dummySharedShortsPage
 *
 * @description
 * A single dummy page of the authenticated user's shared shorts as an
 * `IShortVideoActivityPage`; shares carry an `interactionCount` above one so the
 * multi-share badge is exercised.
 *
 * @param pageIndex - Zero-based page index the query requested.
 * @returns The dummy shared-shorts page.
 */
export function dummySharedShortsPage(pageIndex: number): IShortVideoActivityPage {
    return buildShortsActivityPage(pageIndex, 3);
}
