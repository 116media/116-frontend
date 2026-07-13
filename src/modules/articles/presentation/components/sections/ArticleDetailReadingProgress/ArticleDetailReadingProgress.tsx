"use client";

import { type RefObject, useEffect, useState } from "react";

import { Progress } from "@/shared/presentation/components/ui/Progress";
import { useReadingProgress } from "@/shared/presentation/hooks/useReadingProgress";

const WARNING_FROM = 40;

const SUCCESS_FROM = 75;

/**
 * Props for the ArticleDetail.ReadingProgress component.
 *
 * @interface ArticleDetailReadingProgressProps
 * @property {RefObject<HTMLDivElement | null>} bodyRef - Ref to the article body element,
 * shared with ArticleDetail.Body so both measure the same element.
 */
export interface ArticleDetailReadingProgressProps {
    bodyRef: RefObject<HTMLDivElement | null>;
}

/**
 * readingProgressColor
 *
 * @description
 * Maps a reading-progress percentage to a semantic token background class:
 * `bg-destructive` near the start, `bg-warning` through the middle, and `bg-success`
 * approaching the end.
 *
 * @param progress - The reading progress, 0..100.
 * @returns The token background class for the current band.
 */
function readingProgressColor(progress: number): string {
    if (progress < WARNING_FROM) return "bg-destructive";
    if (progress < SUCCESS_FROM) return "bg-warning";
    return "bg-success";
}

/**
 * useSiteHeaderHeight
 *
 * @description
 * Live height of the sticky site-header stack (`[data-site-header]`), tracked with a
 * ResizeObserver so the value follows responsive breakpoints. Null until first measure.
 *
 * @returns The header stack height in pixels, or null before measurement.
 */
function useSiteHeaderHeight(): number | null {
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

/**
 * ArticleDetail.ReadingProgress
 *
 * @description
 * Reading-progress bar pinned to the bottom edge of the sticky site header, driven by
 * useReadingProgress over the shared body ref. The fill color shifts by reading depth
 * using theme tokens; nothing renders until the header height is measured.
 */
export function ArticleDetailReadingProgress({ bodyRef }: ArticleDetailReadingProgressProps) {
    const progress = useReadingProgress(bodyRef);
    const headerHeight = useSiteHeaderHeight();

    if (headerHeight === null) return null;

    return (
        <div
            style={{ top: headerHeight }}
            className="fixed inset-x-0 z-50"
        >
            <Progress
                value={progress}
                className="rounded-none bg-transparent"
                indicatorClassName={readingProgressColor(progress)}
            />
        </div>
    );
}
