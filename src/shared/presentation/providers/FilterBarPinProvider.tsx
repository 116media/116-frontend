"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";

/**
 * The pin state shared between a page's sticky filter bar and the site header.
 *
 * @interface FilterBarPinContextValue
 * @property {boolean} isPinned - Whether a filter bar is currently pinned under the header.
 * @property {boolean} isHidden - Whether the pinned bar is currently scrolled out of view.
 * @property {(state: { isPinned: boolean; isHidden: boolean }) => void} report - Reports a change.
 */
interface FilterBarPinContextValue {
    isPinned: boolean;
    isHidden: boolean;
    report: (state: { isPinned: boolean; isHidden: boolean }) => void;
}

const FilterBarPinContext = createContext<FilterBarPinContextValue>({
    isPinned: false,
    isHidden: false,
    report: () => undefined
});

/**
 * useFilterBarPin
 *
 * @description
 * Reads whether a page's filter bar is pinned under the header and whether it is
 * currently out of view. The header uses both to decide when it owns the search row.
 *
 * @returns The pin state, the hidden state, and the reporter.
 */
export function useFilterBarPin(): FilterBarPinContextValue {
    return useContext(FilterBarPinContext);
}

/**
 * FilterBarPinProvider
 *
 * @description
 * Carries the filter bar's state to the header, so the header owns the search row
 * exactly when the bar does not: hidden while the bar is pinned and on screen, shown
 * again once the bar scrolls away. Values change on state crossings, not per frame.
 */
export function FilterBarPinProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState({ isPinned: false, isHidden: false });

    const report = useCallback((next: { isPinned: boolean; isHidden: boolean }) => {
        setState((current) =>
            current.isPinned === next.isPinned && current.isHidden === next.isHidden
                ? current
                : next
        );
    }, []);

    const value = useMemo(
        () => ({ isPinned: state.isPinned, isHidden: state.isHidden, report }),
        [state.isPinned, state.isHidden, report]
    );

    return <FilterBarPinContext.Provider value={value}>{children}</FilterBarPinContext.Provider>;
}
