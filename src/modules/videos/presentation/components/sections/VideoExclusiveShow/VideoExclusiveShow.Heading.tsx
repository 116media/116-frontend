"use client";

import { useExclusiveShow } from "@/modules/videos/presentation/context/ExclusiveShowProvider";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import { withAlpha } from "@/shared/presentation/utils/color/color.utils";

/**
 * Props for the VideoExclusiveShowHeading component.
 *
 * @interface VideoExclusiveShowHeadingProps
 * @property {boolean} [clamp] - Whether the description is clamped to three
 * lines (default); pass false to render the full text.
 */
export interface VideoExclusiveShowHeadingProps {
    clamp?: boolean;
}

/**
 * VideoExclusiveShowHeading
 *
 * @description
 * The show title and description shared by the exclusive show layouts and the
 * show hero. Rendered as a fragment so the parent's vertical rhythm applies
 * between title, description, and the sibling CTA row.
 */
export function VideoExclusiveShowHeading({ clamp = true }: VideoExclusiveShowHeadingProps) {
    const { category, foreground } = useExclusiveShow();

    return (
        <>
            <h1
                style={{ color: foreground }}
                className="max-w-3xl text-2xl font-bold leading-tight lg:text-xl xl:text-3xl"
            >
                {category.name}
            </h1>
            <p
                style={{ color: withAlpha(foreground, 0.85) }}
                className={cn(
                    "max-w-2xl text-sm leading-relaxed sm:text-base",
                    clamp && "line-clamp-3"
                )}
            >
                {category.description}
            </p>
        </>
    );
}
