"use client";

import { useEffect, useState } from "react";

/**
 * Minimum scroll distance (px) before a direction change is registered,
 * preventing jitter from tiny scroll adjustments.
 */
const DIRECTION_THRESHOLD = 8;

/**
 * Scroll offset (px) under which the direction always reads "up", so surfaces
 * revealed on scroll-up are never hidden near the top of the page.
 */
const TOP_OFFSET = 120;

/**
 * useScrollDirection
 *
 * @description
 * Tracks the window's vertical scroll direction for hide-on-scroll surfaces:
 * "down" while scrolling deeper, "up" while scrolling back or near the top.
 * rAF-throttled with a passive listener; SSR-safe (initially "up").
 *
 * @returns The current scroll direction.
 */
export function useScrollDirection(): "up" | "down" {
    const [direction, setDirection] = useState<"up" | "down">("up");

    useEffect(() => {
        let lastY = window.scrollY;
        let ticking = false;

        const onScroll = () => {
            if (ticking) return;
            ticking = true;

            requestAnimationFrame(() => {
                const y = window.scrollY;

                if (Math.abs(y - lastY) >= DIRECTION_THRESHOLD) {
                    setDirection(y > lastY && y > TOP_OFFSET ? "down" : "up");
                    lastY = y;
                }

                ticking = false;
            });
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return direction;
}
