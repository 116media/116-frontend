import { Star } from "lucide-react";

import { cn } from "@/shared/presentation/utils/cn";
import { formatCount } from "@/shared/presentation/utils/formatCount";

interface StarRatingProps {
    ratingAverage: number;
    ratingCount: number;
    mode?: "compact" | "detailed";
    variant?: "default" | "light";
    className?: string;
}

/**
 * StarRating
 *
 * @description
 * Presentational rating display with two modes, so it can replace the ad-hoc
 * star markup repeated across the article and video cards:
 *
 * - "detailed" (default): a five-star row filled to the rounded average. When the
 *   item has ratings it also shows the numeric average and the total count
 *   (compacted via formatCount); when no one has rated it shows the five empty
 *   stars alone.
 * - "compact": a single star with a number — the average when rated, or an
 *   outlined star with the zero count when not yet rated. Suited to dense card
 *   meta rows.
 *
 * The "light" variant renders white/translucent stars and text for dark image
 * overlays; "default" uses muted foreground tokens for surface cards.
 *
 * @param ratingAverage - Average star rating (1–5)
 * @param ratingCount - Total number of ratings
 * @param mode - "detailed" (five stars) | "compact" (single star)
 * @param variant - Visual treatment: "default" (surface) | "light" (dark overlays)
 * @param className - Optional extra classes for the wrapper
 */
export function StarRating({
    ratingAverage,
    ratingCount,
    mode = "detailed",
    variant = "default",
    className
}: StarRatingProps) {
    const isLight = variant === "light";
    const hasRatings = ratingCount > 0;

    const textClass = cn(
        "text-[9pt] font-medium",
        isLight ? "text-white/75" : "text-muted-foreground"
    );

    const filledClass = isLight
        ? "fill-amber-300 text-yellow-300"
        : "fill-amber-400 text-yellow-400";
    const emptyClass = isLight ? "text-white/30" : "text-muted-foreground/30";

    if (mode === "compact") {
        return (
            <span className={cn("flex items-center gap-1", className)}>
                <Star className={cn("h-3 w-3 shrink-0", hasRatings ? filledClass : emptyClass)} />
                <span className={cn(textClass, "tabular-nums")}>
                    {hasRatings ? ratingAverage.toFixed(1) : ratingCount}
                </span>
            </span>
        );
    }

    const stars = [1, 2, 3, 4, 5].map((position) => {
        const filled = hasRatings && position <= Math.round(ratingAverage);
        return (
            <Star
                key={position}
                className={cn("h-3 w-3 shrink-0", filled ? filledClass : emptyClass)}
            />
        );
    });

    return (
        <span className={cn("flex items-center gap-1", className)}>
            <span className="flex items-center gap-0.5">{stars}</span>
            {hasRatings && (
                <>
                    <span className={cn(textClass, "tabular-nums")}>
                        {ratingAverage.toFixed(1)}
                    </span>
                    <span className={cn(textClass, "opacity-70")}>
                        ({formatCount(ratingCount)})
                    </span>
                </>
            )}
        </span>
    );
}
