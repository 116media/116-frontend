"use client";

import { useEffect, useState } from "react";

/**
 * useDebouncedValue
 *
 * @description
 * Returns a debounced copy of a rapidly-changing value: it updates to the latest
 * `value` only after `delayMs` has elapsed without a further change.
 *
 * @typeParam T - The value type.
 * @param value - The live value (e.g. the raw search string).
 * @param delayMs - Idle time before the debounced value updates.
 * @returns The debounced value.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(id);
    }, [value, delayMs]);

    return debounced;
}
