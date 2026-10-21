"use client";

import { useEffect, useState } from "react";

/**
 * useMediaQuery
 *
 * @description
 * Tracks a CSS media query through `matchMedia`, so a layout that cannot be expressed
 * in Tailwind variants alone (a different component configuration, not a different
 * class) can branch on the breakpoint. No resize listener: the browser notifies only
 * when the query's result flips.
 *
 * @param query - The media query to evaluate, e.g. `(min-width: 1024px)`.
 * @returns Whether the query currently matches; false during the server pass.
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const list = window.matchMedia(query);
        setMatches(list.matches);

        const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
        list.addEventListener("change", onChange);

        return () => list.removeEventListener("change", onChange);
    }, [query]);

    return matches;
}
