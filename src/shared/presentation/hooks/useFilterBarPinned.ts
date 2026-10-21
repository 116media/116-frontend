"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useMediaQuery } from "@/shared/presentation/hooks/useMediaQuery";
import { useScrollDirection } from "@/shared/presentation/hooks/useScrollDirection";
import { useFilterBarPin } from "@/shared/presentation/providers/FilterBarPinProvider";

/**
 * Hide-on-scroll is a phone affordance: it buys reading room on a short viewport. From
 * `md` up the bar stays pinned, because there is height to spare and a filter row that
 * comes and goes while reading is noise.
 */
const HIDE_ON_SCROLL_QUERY = "(max-width: 767px)";

/**
 * readStickyTop
 *
 * @description
 * The line the bar pins at, read from the bar's own `top` rather than a copy of the
 * header's height, so the two can never drift apart. The bar is the sentinel's next
 * sibling; anything else means no offset.
 *
 * @param sentinel - The sentinel sitting directly above the bar.
 * @returns The bar's sticky offset in pixels.
 */
function readStickyTop(sentinel: HTMLDivElement): number {
    const bar = sentinel.nextElementSibling;
    if (bar === null) return 0;

    const top = Number.parseFloat(getComputedStyle(bar).top);
    return Number.isFinite(top) ? top : 0;
}

/**
 * useFilterBarPinned
 *
 * @description
 * Tracks whether a page's filter bar has reached the header, and whether it should be
 * out of the way. Pinned means the sentinel has scrolled above the bar's own sticky
 * offset, not merely that it is off screen, which is also true while the bar is below the
 * fold. On phones the pinned bar rides down with the reader and steps out of the way on
 * the way back up, handing the row to the header's search; from `md` up it simply stays
 * pinned. The sentinel's document offset and
 * the bar's offset are read once per reflow, so each scroll frame is a comparison.
 *
 * @returns The sentinel ref to place directly above the bar, whether it is pinned, and
 * whether it should currently be out of the way.
 */
export function useFilterBarPinned(): {
    sentinelRef: (node: HTMLDivElement | null) => void;
    isPinned: boolean;
    isHidden: boolean;
} {
    const { report } = useFilterBarPin();
    const direction = useScrollDirection();
    const canHide = useMediaQuery(HIDE_ON_SCROLL_QUERY);
    const [isPinned, setIsPinned] = useState(false);

    const sentinel = useRef<HTMLDivElement | null>(null);
    const offset = useRef<number>(Number.POSITIVE_INFINITY);
    const stickyTop = useRef(0);

    const sentinelRef = useCallback((node: HTMLDivElement | null) => {
        sentinel.current = node;
        if (node) offset.current = node.getBoundingClientRect().top + window.scrollY;
    }, []);

    useEffect(() => {
        const node = sentinel.current;
        if (node === null) return;

        // One read per layout change rather than one per scroll frame: neither the
        // sentinel's position nor the bar's offset moves except on reflow.
        const measure = () => {
            offset.current = node.getBoundingClientRect().top + window.scrollY;
            stickyTop.current = readStickyTop(node);
            evaluate();
        };

        const evaluate = () => {
            setIsPinned((current) => {
                const next = window.scrollY + stickyTop.current >= offset.current;
                return current === next ? current : next;
            });
        };

        let ticking = false;

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                evaluate();
                ticking = false;
            });
        };

        measure();

        const resizeObserver = new ResizeObserver(measure);
        resizeObserver.observe(document.body);

        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    const isHidden = canHide && isPinned && direction === "up";

    useEffect(() => {
        report({ isPinned, isHidden });
        return () => report({ isPinned: false, isHidden: false });
    }, [isPinned, isHidden, report]);

    return { sentinelRef, isPinned, isHidden };
}
