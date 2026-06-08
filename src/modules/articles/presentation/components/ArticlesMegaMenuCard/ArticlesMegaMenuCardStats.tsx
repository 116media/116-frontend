"use client";

import { Heart, Share2 } from "lucide-react";

import { cn } from "@/shared/presentation/utils/cn";
import type { ArticlesMegaMenuCardStatsProps } from "./types";

/**
 * ArticlesMegaMenuCardStats
 *
 * @description
 * Engagement stats row composed into ArticlesMegaMenuCard.FeaturedOverlay
 * and ArticlesMegaMenuCard.Compact. Displays like count and share count.
 *
 * The "light" variant uses white/translucent text for rendering over dark
 * image overlays (FeaturedOverlay). The "default" variant uses muted
 * foreground tokens for surface cards (Compact).
 */
export function ArticlesMegaMenuCardStats({
    likeCount,
    shareCount,
    variant = "default"
}: ArticlesMegaMenuCardStatsProps) {
    const isLight = variant === "light";

    const fmt = (n: number) => (n > 999 ? `${(n / 1000).toFixed(1)}k` : n);

    const itemClass = cn(
        "flex items-center gap-0.5 text-[10px] font-medium",
        isLight ? "text-white/75" : "text-muted-foreground"
    );

    return (
        <div className="flex items-center gap-3">
            <span className={itemClass}>
                <Heart className="h-3 w-3 shrink-0" />
                <span>{fmt(likeCount)}</span>
            </span>
            <span className={itemClass}>
                <Share2 className="h-3 w-3 shrink-0" />
                <span>{fmt(shareCount)}</span>
            </span>
        </div>
    );
}
