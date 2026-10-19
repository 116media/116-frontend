"use client";

import type { RefObject } from "react";
import { useSiteHeaderHeight } from "@/modules/articles/presentation/hooks/useSiteHeaderHeight";
import { readingProgressColor } from "@/modules/articles/presentation/utils/reading-progress/reading-progress.utils";
import { Progress } from "@/shared/presentation/components/ui/Progress";
import { useReadingProgress } from "@/shared/presentation/hooks/useReadingProgress";

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
 * ArticleDetail.ReadingProgress
 *
 * @description
 * Reading-progress bar pinned to the bottom edge of the sticky site header, driven by
 * useReadingProgress over the shared body ref. The fill color shifts by reading depth
 * using theme tokens; nothing renders until the header height is measured.
 */
export function ArticleDetailReadingProgress({ bodyRef }: ArticleDetailReadingProgressProps) {
    const headerHeight = useSiteHeaderHeight();
    const progress = useReadingProgress(bodyRef);

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
