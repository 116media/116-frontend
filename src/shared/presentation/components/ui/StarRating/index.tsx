import { StarIcon } from "@/shared/presentation/components/ui/Icon";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import { formatCount } from "@/shared/presentation/utils/format/format.utils";

/**
 * Props for the StarRating component.
 *
 * @interface StarRatingProps
 * @property {number} ratingAverage - Average star rating, 0–5.
 * @property {number} ratingCount - Total number of ratings.
 * @property {"compact" | "detailed"} [mode] - Layout mode; defaults to compact.
 * @property {"default" | "light"} [variant] - Color scheme for light or dark surfaces.
 * @property {string} [className] - Extra classes merged onto the row.
 */
export interface StarRatingProps {
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
 * Presentational rating display shared by article and video cards. "detailed" mode
 * renders a five-star row with the average and count; "compact" renders a single
 * star with a number. The "light" variant suits dark image overlays.
 */
export function StarRating({
    ratingAverage,
    ratingCount,
    mode = "detailed",
    variant = "default",
    className
}: StarRatingProps) {
    const hasRatings = ratingCount > 0;
    const isLight = variant === "light";

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
                <StarIcon
                    className={cn("h-3 w-3 shrink-0", hasRatings ? filledClass : emptyClass)}
                />
                <span className={cn(textClass, "tabular-nums")}>
                    {hasRatings ? ratingAverage.toFixed(1) : ratingCount}
                </span>
            </span>
        );
    }

    const stars = [1, 2, 3, 4, 5].map((position) => {
        const filled = hasRatings && position <= Math.round(ratingAverage);
        return (
            <StarIcon
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
