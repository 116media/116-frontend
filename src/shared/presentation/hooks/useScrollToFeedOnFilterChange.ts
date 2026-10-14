"use client";

import { type RefObject, useEffect, useRef } from "react";

/**
 * Where the feed's top should land once the filter changes: just under the sticky
 * TopBar + Header stack, which is also where the filter bar pins.
 */
const STICKY_OFFSET_PX = 112;

/**
 * useScrollToFeedOnFilterChange
 *
 * @description
 * Returns the reader to the top of the feed whenever a filter changes. Without it a
 * narrower result set leaves the viewport parked below the new content — a reader deep
 * in a long list who picks a sparse tag lands on the footer. Only scrolls upward, so a
 * reader already above the feed is never dragged down, and never on first render.
 *
 * @param ref - The element wrapping the filter bar and the results.
 * @param filters - The filter values; a change in any of them triggers the scroll.
 */
export function useScrollToFeedOnFilterChange(
    ref: RefObject<HTMLElement | null>,
    filters: ReadonlyArray<string | undefined>
): void {
    const key = filters.join("|");
    const applied = useRef(key);

    useEffect(() => {
        // The filters the feed is already showing. Seeding it with the first render's
        // value is what keeps a freshly opened page where the reader put it.
        if (applied.current === key) return;
        applied.current = key;

        const node = ref.current;
        if (node === null) return;

        const target = node.getBoundingClientRect().top + window.scrollY - STICKY_OFFSET_PX;

        // Scrolling down would push the reader past results they have not seen; the
        // problem only ever exists when they are below the feed's top.
        if (window.scrollY <= target) return;

        window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
    }, [key, ref]);
}
