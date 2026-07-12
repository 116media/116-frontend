"use client";

import { HeartIcon, ShareIcon } from "@/shared/presentation/components/ui/Icon";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import { formatCount } from "@/shared/presentation/utils/format/format.utils";
import type { ArticlesMegaMenuCardStatsProps } from "./types";

/**
 * ArticlesMegaMenuCardStats
 *
 * @description
 * Like/share stats row composed into the FeaturedOverlay and Compact variants. The
 * "light" variant renders over dark image overlays; "default" uses muted foreground
 * tokens for surface cards.
 */
export function ArticlesMegaMenuCardStats({
    likeCount,
    shareCount,
    variant = "default"
}: ArticlesMegaMenuCardStatsProps) {
    const isLight = variant === "light";

    const itemClass = cn(
        "flex items-center gap-0.5 text-[10px] font-medium",
        isLight ? "text-white/75" : "text-muted-foreground"
    );

    return (
        <div className="flex items-center gap-3">
            <span className={itemClass}>
                <HeartIcon className="h-3 w-3 shrink-0" />
                <span>{formatCount(likeCount)}</span>
            </span>
            <span className={itemClass}>
                <ShareIcon className="h-3 w-3 shrink-0" />
                <span>{formatCount(shareCount)}</span>
            </span>
        </div>
    );
}
