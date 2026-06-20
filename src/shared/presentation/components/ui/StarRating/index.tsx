import { Star } from "lucide-react";

import { cn } from "@/shared/presentation/utils/cn";

interface StarRatingProps {
    ratingAverage: number;
    ratingCount: number;
    variant?: "default" | "light";
    className?: string;
}

/**
 * StarRating
 *
 * @description
 * Presentational five-star rating display. Renders filled stars based on the
 * average (rounded to the nearest whole star), the numeric average to one
 * decimal, and the total count in parentheses (compacted to "k" above 999).
 * The "light" variant renders white/translucent for dark image overlays; the
 * "default" variant uses muted foreground tokens for surface cards.
 *
 * @param ratingAverage - Average star rating (1–5)
 * @param ratingCount - Total number of ratings
 * @param variant - Visual treatment: "default" (surface) | "light" (dark overlays)
 * @param className - Optional extra classes for the wrapper
 */
export function StarRating({
    ratingAverage,
    ratingCount,
    variant = "default",
    className
}: StarRatingProps) {
    const isLight = variant === "light";

    const textClass = cn(
        "text-[9pt] font-medium",
        isLight ? "text-white/75" : "text-muted-foreground"
    );

    const stars = [1, 2, 3, 4, 5].map((position) => {
        const filled = position <= Math.round(ratingAverage);
        return (
            <Star
                key={position}
                className={cn(
                    "h-3 w-3 shrink-0",
                    filled
                        ? isLight
                            ? "fill-amber-300 text-yellow-300"
                            : "fill-amber-400 text-yellow-400"
                        : isLight
                          ? "text-white/30"
                          : "text-muted-foreground/30"
                )}
            />
        );
    });

    return (
        <span className={cn("flex items-center gap-1", className)}>
            <span className="flex items-center gap-0.5">{stars}</span>
            <span className={cn(textClass, "tabular-nums")}>{ratingAverage.toFixed(1)}</span>
            {ratingCount > 0 && (
                <span className={cn(textClass, "opacity-70")}>
                    ({ratingCount > 999 ? `${(ratingCount / 1000).toFixed(1)}k` : ratingCount})
                </span>
            )}
        </span>
    );
}
