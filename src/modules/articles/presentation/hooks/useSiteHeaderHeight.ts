"use client";

import { useEffect, useState } from "react";

/**
 * useSiteHeaderHeight
 *
 * @description
 * Live height of the sticky site-header stack (`[data-site-header]`), tracked with a
 * ResizeObserver so the value follows responsive breakpoints. Null until first measure.
 *
 * @returns {number | null} The header stack height in pixels, or null before measurement.
 */
export function useSiteHeaderHeight(): number | null {
    const [height, setHeight] = useState<number | null>(null);

    useEffect(() => {
        const header = document.querySelector("[data-site-header]");
        if (!header) return;

        const update = () => setHeight(header.getBoundingClientRect().height);
        update();

        const observer = new ResizeObserver(update);
        observer.observe(header);

        return () => observer.disconnect();
    }, []);

    return height;
}
