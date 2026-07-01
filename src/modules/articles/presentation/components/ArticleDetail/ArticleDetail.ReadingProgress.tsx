"use client";

import type { RefObject } from "react";

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
 * Maps a reading-progress percentage to a semantic token background class: `bg-destructive`
 * (red) near the start, `bg-warning` (orange) through the middle, and `bg-success` (green)
 * as the reader approaches the end. Uses the theme tokens verbatim; the Progress indicator's
 * background-color transition morphs smoothly between them as the reader scrolls past a
 * threshold.
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
 * ArticleDetail.ReadingProgress
 *
 * @description
 * The slim reading-progress bar pinned flush to the top of the viewport, above the sticky
 * header (`z-50`), with a transparent track so only the colored fill shows — no white band
 * or gap against the header. It reads the article body's scroll position via
 * useReadingProgress and fills 0..100% as the body scrolls past the viewport. The fill color
 * shifts by reading depth — red near the start, orange through the middle, green approaching
 * the end — using theme tokens, and morphs smoothly thanks to the indicator's
 * background-color transition. The body ref is shared with ArticleDetail.Body so both
 * measure the same element.
 *
 * @param bodyRef - Ref to the article body element.
 */
export function ArticleDetailReadingProgress({ bodyRef }: ArticleDetailReadingProgressProps) {
    const progress = useReadingProgress(bodyRef);
    return (
        <div className="fixed inset-x-0 top-0 z-50">
            <Progress
                value={progress}
                className="rounded-none bg-transparent"
                indicatorClassName={readingProgressColor(progress)}
            />
        </div>
    );
}
