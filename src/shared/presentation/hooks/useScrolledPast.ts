"use client";

import { type RefObject, useEffect, useRef, useState } from "react";

/**
 * useScrolledPast
 *
 * @description
 * Tracks whether the viewport top has passed the bottom of `ref`, for surfaces that reveal
 * after a region. The crossing line is measured once and refreshed only when the document
 * height actually changes, so each scroll frame is a number comparison with no layout read.
 *
 * @param ref - The element whose bottom edge is the crossing line.
 * @returns Whether the page is scrolled past that element.
 */
export function useScrolledPast(ref: RefObject<HTMLElement | null>): boolean {
    const threshold = useRef(Number.POSITIVE_INFINITY);
    const [isScrolledPast, setIsScrolledPast] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (node === null) return;

        const evaluate = () => {
            setIsScrolledPast((current) => {
                const next = window.scrollY > threshold.current;
                return current === next ? current : next;
            });
        };

        let lastHeight = 0;
        const measure = () => {
            threshold.current = node.getBoundingClientRect().bottom + window.scrollY;
            evaluate();
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

        // Content above the element (images, embeds) settles after mount and moves the line;
        // anything that leaves the document height alone cannot have moved it.
        const observer = new ResizeObserver(() => {
            const height = document.documentElement.scrollHeight;
            if (height === lastHeight) return;
            lastHeight = height;
            measure();
        });

        measure();
        lastHeight = document.documentElement.scrollHeight;
        observer.observe(document.body);
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", onScroll);
        };
    }, [ref]);

    return isScrolledPast;
}
