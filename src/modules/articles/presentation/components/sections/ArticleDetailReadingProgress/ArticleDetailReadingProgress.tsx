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
 * ArticleDetail.ReadingProgress
 *
 * @description
 * Reading-progress bar pinned above the sticky header, driven by useReadingProgress over
 * the shared body ref. The fill color shifts by reading depth using theme tokens.
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
