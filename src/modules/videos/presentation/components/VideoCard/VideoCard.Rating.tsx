import type { ComponentProps } from "react";

import { StarRating } from "@/shared/presentation/components/ui/StarRating";

/**
 * Props for VideoCardRating.
 *
 * @interface VideoCardRatingProps
 * @property {number} ratingAverage - Average star rating (1–5).
 * @property {number} ratingCount - Total number of ratings.
 * @property {ComponentProps<typeof StarRating>["mode"]} [mode] - StarRating display mode.
 */
export interface VideoCardRatingProps {
    ratingAverage: number;
    ratingCount: number;
    mode?: ComponentProps<typeof StarRating>["mode"];
}

/**
 * VideoCardRating
 *
 * @description
 * The average-rating display for a VideoCard, wrapping the shared StarRating so each variant
 * picks a `mode` (compact for the poster grid, full for the episode row) while passing only
 * the rating figures.
 *
 * @param ratingAverage - Average star rating (1–5).
 * @param ratingCount - Total number of ratings.
 * @param mode - StarRating display mode.
 */
export function VideoCardRating({ ratingAverage, ratingCount, mode }: VideoCardRatingProps) {
    return (
        <StarRating
            mode={mode}
            ratingAverage={ratingAverage}
            ratingCount={ratingCount}
        />
    );
}
