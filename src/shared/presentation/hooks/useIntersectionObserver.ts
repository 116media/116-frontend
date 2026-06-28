"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useIntersectionObserver
 *
 * @description
 * Observes a target element and reports whether it currently intersects the viewport
 * (or a given root). Returns a callback ref to attach to the target and the latest
 * intersection state. The observer is recreated only when the options identity changes.
 *
 * @param options - Standard IntersectionObserver options (rootMargin, threshold, root).
 * @returns A tuple `[ref, isIntersecting]` — attach `ref` to the sentinel.
 */
export function useIntersectionObserver(
    options?: IntersectionObserverInit
): [(node: Element | null) => void, boolean] {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const ref = useCallback(
        (node: Element | null) => {
            observerRef.current?.disconnect();
            if (!node) return;
            observerRef.current = new IntersectionObserver(
                ([entry]) => setIsIntersecting(entry.isIntersecting),
                options
            );
            observerRef.current.observe(node);
        },
        [options]
    );

    useEffect(() => () => observerRef.current?.disconnect(), []);

    return [ref, isIntersecting];
}
