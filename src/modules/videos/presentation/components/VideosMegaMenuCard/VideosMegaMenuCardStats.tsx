"use client";

import { Share2, Star } from "lucide-react";

import { cn } from "@/shared/presentation/utils/cn";
import type { VideosMegaMenuCardStatsProps } from "./types";

/**
 * VideosMegaMenuCardStats
 *
 * @description
 * Rating and share stats row composed into both VideosMegaMenuCard.Featured
 * and VideosMegaMenuCard.Compact.
 *
 * Displays:
 * - Star rating: filled stars based on ratingAverage (rounded to nearest 0.5),
 *   the numeric average, and the total rating count in parentheses
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

    const stars = [1, 2, 3, 4, 5].map((position) => {
        const filled = position <= Math.round(ratingAverage);
        return (
            <Star
                key={position}
                className={cn(
                    "h-2.5 w-2.5 shrink-0",
                    filled
                        ? isLight
                            ? "fill-yellow-300 text-yellow-300"
                            : "fill-yellow-400 text-yellow-400"
                        : isLight
                          ? "text-white/30"
                          : "text-muted-foreground/30"
                )}
            />
        );
    });

    return (
        <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1">
                <div className="flex items-center gap-0.5">{stars}</div>
                <span className={cn(textClass, "tabular-nums")}>{ratingAverage.toFixed(1)}</span>
                {ratingCount > 0 && (
                    <span className={cn(textClass, "opacity-70")}>
                        ({ratingCount > 999 ? `${(ratingCount / 1000).toFixed(1)}k` : ratingCount})
                    </span>
                )}
            </div>
            <span className={cn("flex items-center gap-0.5", textClass)}>
                <Share2 className="h-2.5 w-2.5 shrink-0" />
                <span>{shareCount > 999 ? `${(shareCount / 1000).toFixed(1)}k` : shareCount}</span>
            </span>
        </div>
    );
}
