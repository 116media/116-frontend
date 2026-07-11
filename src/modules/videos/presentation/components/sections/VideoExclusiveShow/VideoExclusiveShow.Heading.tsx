"use client";

import { withAlpha } from "@/shared/presentation/utils/color/color.utils";
import { useExclusiveShow } from "@/modules/videos/presentation/context/ExclusiveShowProvider";


/**
 * VideoExclusiveShowHeading
 *
 * @description
 * The show title and description shared by both layouts. Rendered as a
 * fragment so the parent's vertical rhythm applies between title, description,
 * and the sibling CTA row.
 */
export function VideoExclusiveShowHeading() {
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
                className="max-w-2xl text-sm leading-relaxed line-clamp-3 sm:text-base"
            >
                {category.description}
            </p>
        </>
    );

}
