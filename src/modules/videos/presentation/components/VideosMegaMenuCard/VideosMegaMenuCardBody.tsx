"use client";

import { RelativeDate } from "@/shared/presentation/components/ui/RelativeDate";
import type { VideosMegaMenuCardBodyProps } from "./types";

/**
 * VideosMegaMenuCardBody
 *
 * @description
 * Shared text content piece composed into both VideosMegaMenuCard.Featured
 * and VideosMegaMenuCard.Compact. Renders the video title (2-line clamp),
 * category name in muted text, and a locale-aware relative publication date.
 * The body intentionally does not include stats — those are injected by each
 * card variant directly via VideosMegaMenuCardStats to control placement.
 */
export function VideosMegaMenuCardBody({
    title,
    categoryName,
    publishedAt
}: VideosMegaMenuCardBodyProps) {
    return (
        <div className="flex flex-1 flex-col gap-0.5 min-w-0">
            <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-accent-foreground">
                {title}
            </p>
            <p className="text-xs text-muted-foreground">{categoryName}</p>
            {publishedAt && (
                <p className="text-xs text-muted-foreground/70">
                    <RelativeDate date={publishedAt} />
                </p>
            )}
        </div>
    );
}
