"use client";

import { ShareIcon } from "@/shared/presentation/components/ui/Icon";

import { StarRating } from "@/shared/presentation/components/ui/StarRating";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import { formatCount } from "@/shared/presentation/utils/format/format.utils";
import type { VideosMegaMenuCardStatsProps } from "./types";

/**
 * VideosMegaMenuCardStats
 *
 * @description
 * Rating and share stats row composed into the VideosMegaMenuCard variants.
 * The "light" variant renders white/translucent for dark image overlays;
 * "default" uses muted foreground tokens for surface cards.
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
                <ShareIcon className="h-2.5 w-2.5 shrink-0" />
                <span>{formatCount(shareCount)}</span>
            </span>
        </div>
    );
}
