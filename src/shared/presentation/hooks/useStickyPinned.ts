"use client";

import { type RefObject, useEffect, useState } from "react";

/**
 * useStickyPinned
 *
 * @description
 * Whether a `position: sticky` element is currently pinned at its offset, for chrome that
 * only applies while it is. Compares the element's laid-out top against its computed
 * `top`, so it works whatever that offset resolves to, and reports false before it pins,
 * after it leaves with its container, and wherever it is not sticky at all. Any transform
 * on the element is discounted, so a pinned element that slides itself out of the way
 * still reads as pinned. rAF-throttled with a passive listener.
 *
 * @param ref - The sticky element.
 * @returns Whether the element is pinned at its sticky offset.
 */
export function useStickyPinned(ref: RefObject<HTMLElement | null>): boolean {
    const [isPinned, setIsPinned] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (node === null) return;

        const evaluate = () => {
            const styles = getComputedStyle(node);
            const offset = Number.parseFloat(styles.top);

            if (styles.position !== "sticky" || !Number.isFinite(offset)) {
                setIsPinned((current) => (current ? false : current));
                return;
            }

            const shift =
                styles.transform === "none" ? 0 : new DOMMatrixReadOnly(styles.transform).m42;
            const top = node.getBoundingClientRect().top - shift;
            const next = Math.abs(top - offset) <= 1;

            setIsPinned((current) => (current === next ? current : next));
        };

        let isTicking = false;
        const onScroll = () => {
            if (isTicking) return;
            isTicking = true;
            requestAnimationFrame(() => {
                evaluate();
                isTicking = false;
            });
        };

        evaluate();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [ref]);

    return isPinned;
}
