"use client";

import { Share2 } from "lucide-react";

import { StarRating } from "@/shared/presentation/components/ui/StarRating";
import { cn } from "@/shared/presentation/utils/cn";
import { formatCount } from "@/shared/presentation/utils/formatCount";
import type { VideosMegaMenuCardStatsProps } from "./types";

/**
 * VideosMegaMenuCardStats
 *
 * @description
 * Rating and share stats row composed into both VideosMegaMenuCard.Featured
 * and VideosMegaMenuCard.Compact.
 *
 * Displays:
 * - Star rating via the shared StarRating component (detailed mode)
 * - Share count with a share icon
 *
 * The "light" variant renders white/translucent for dark image overlays.
 * The "default" variant uses muted foreground tokens for surface cards.
 */
export function VideosMegaMenuCardStats({
    shareCount,
    ratingAverage,
    ratingCount,
    variant = "default"
}: VideosMegaMenuCardStatsProps) {
    const isLight = variant === "light";

    const textClass = cn(
        "text-[10px] font-medium",
        isLight ? "text-white/75" : "text-muted-foreground"
    );

    return (
        <div className="flex items-center gap-2.5">
            <StarRating
                mode="detailed"
                variant={variant}
                ratingAverage={ratingAverage}
                ratingCount={ratingCount}
            />
            <span className={cn("flex items-center gap-0.5", textClass)}>
                <Share2 className="h-2.5 w-2.5 shrink-0" />
                <span>{formatCount(shareCount)}</span>
            </span>
        </div>
    );
}
