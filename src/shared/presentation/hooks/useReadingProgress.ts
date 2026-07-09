import { type RefObject, useEffect, useState } from "react";

/**
 * useReadingProgress
 *
 * @description
 * Tracks the fraction of a target element that has passed the viewport bottom, as a
 * 0..100 percentage. Handlers are rAF-throttled and passive; SSR-safe (0 on the server).
 *
 * @param targetRef - A ref to the element whose reading progress is measured.
 * @returns The reading progress, 0..100.
 */
export function useReadingProgress(targetRef: RefObject<HTMLElement | null>): number {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (typeof window === "undefined") return;

        let frame = 0;

        const measure = () => {
            frame = 0;
            const el = targetRef.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const elementTop = rect.top + window.scrollY;
            const elementHeight = rect.height;

            if (elementHeight <= 0) {
                setProgress(0);
                return;
            }

            const scrolled = window.scrollY + window.innerHeight - elementTop;
            const ratio = Math.min(1, Math.max(0, scrolled / elementHeight));
            setProgress(ratio * 100);
        };

        const onScroll = () => {
            if (frame === 0) frame = window.requestAnimationFrame(measure);
        };

        measure();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (frame !== 0) window.cancelAnimationFrame(frame);
        };
    }, [targetRef]);

    return progress;
}
