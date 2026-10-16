"use client";

import { useEffect } from "react";

/**
 * AppShell.HeaderHeight
 *
 * @description
 * Publishes the sticky chrome's measured height so anything beneath it clears the header
 * at every width: the chrome is a top bar plus a two-row header on a phone or tablet, a
 * single row on a desktop, and the tablet rows are taller again, so a fixed offset cannot
 * hold. Renders nothing.
 *
 * Two values, because the header's search row stands down while a filter bar is pinned:
 * `--site-header-height` is the live height, for surfaces that never move it, and
 * `--site-header-height-pinned` excludes that row, so a filter bar pinning against it
 * cannot shift its own pin threshold and oscillate.
 */
export function AppShellHeaderHeight() {
    useEffect(() => {
        const chrome = document.querySelector("[data-site-header]");
        if (!chrome) return;

        const publish = () => {
            const full = Math.round(chrome.getBoundingClientRect().height);
            const searchRow = chrome.querySelector("search");
            const searchHeight = searchRow
                ? Math.round(searchRow.getBoundingClientRect().height)
                : 0;
            const style = document.documentElement.style;

            style.setProperty("--site-header-height", `${full}px`);
            style.setProperty("--site-header-height-pinned", `${full - searchHeight}px`);
        };

        publish();
        const observer = new ResizeObserver(publish);
        observer.observe(chrome);

        return () => observer.disconnect();
    }, []);

    return null;
}
