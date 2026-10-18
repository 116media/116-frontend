"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";

import { SearchOverlay } from "@/modules/search/presentation/components/modals/SearchOverlay";

/**
 * The search overlay's open state, shared by every control that can raise it.
 *
 * @interface SearchOverlayContextValue
 * @property {boolean} isOpen - Whether the overlay is showing.
 * @property {() => void} open - Raises the overlay.
 * @property {() => void} close - Dismisses it.
 */
interface SearchOverlayContextValue {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

const SearchOverlayContext = createContext<SearchOverlayContextValue>({
    isOpen: false,
    open: () => undefined,
    close: () => undefined
});

/**
 * useSearchOverlay
 *
 * @description
 * Raises the search overlay from anywhere in the chrome: the header button, the
 * mobile menu's field, or a keyboard shortcut.
 *
 * @returns The overlay's open state and its controls.
 */
export function useSearchOverlay(): SearchOverlayContextValue {
    return useContext(SearchOverlayContext);
}

/**
 * Props for the SearchOverlayProvider component.
 *
 * @interface SearchOverlayProviderProps
 * @property {ReactNode} children - The subtree that can raise the overlay.
 */
export interface SearchOverlayProviderProps {
    children: ReactNode;
}

/**
 * SearchOverlayProvider
 *
 * @description
 * Owns the one search overlay the chrome shares, so the header and the mobile menu
 * raise the same surface instead of each mounting their own.
 */
export function SearchOverlayProvider({ children }: SearchOverlayProviderProps) {
    const [isOpen, setIsOpen] = useState(false);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);

    const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);

    return (
        <SearchOverlayContext.Provider value={value}>
            {children}
            <SearchOverlay
                isOpen={isOpen}
                onOpenChange={setIsOpen}
            />
        </SearchOverlayContext.Provider>
    );
}
