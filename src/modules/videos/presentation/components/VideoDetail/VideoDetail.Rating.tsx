"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useRateVideo } from "@/modules/videos/presentation/hooks/useRateVideo";
import { StarIcon } from "@/shared/presentation/components/ui/Icon";
import { StarRating } from "@/shared/presentation/components/ui/StarRating";
import { cn } from "@/shared/presentation/utils/cn";

/**
 * The five submittable star positions.
 */
const STAR_POSITIONS = [1, 2, 3, 4, 5] as const;

/**
 * Props for VideoDetail.Rating.
 *
 * @interface VideoDetailRatingProps
 * @property {string} videoId - The video being rated.
 * @property {string} slug - The video slug keying the cached detail entity.
 * @property {number} ratingAverage - Cached average star rating (1–5).
 * @property {number} ratingCount - Cached total number of ratings.
 */
export interface VideoDetailRatingProps {
    videoId: string;
    slug: string;
    ratingAverage: number;
    ratingCount: number;
}

/**
 * VideoDetail.Rating
 *
 * @description
 * The header's rating cluster, two layers side by side: the display (the
 * `VideoCard.Rating` idiom — five stars filled to the average plus the
 * numeric average and count) and the action — five star buttons that preview
 * the hovered value in the warning tone and submit 1–5 through
 * `useRateVideo`. Submission is auth-gated inside the hook (guests get the
 * login modal and the rating resumes after), toasts on both outcomes, and
 * invalidates the detail query so the server-recomputed average comes back.
 * While pending the stars are disabled at reduced opacity. The user's own
 * previous rating is not echoed back (the DTO does not carry it).
 *
 * @param videoId - The video being rated.
 * @param slug - The video slug keying the cached detail entity.
 * @param ratingAverage - Cached average star rating.
 * @param ratingCount - Cached total number of ratings.
 */
export function VideoDetailRating({
    videoId,
    slug,
    ratingAverage,
    ratingCount
}: VideoDetailRatingProps) {
    const { t } = useTranslation();
    const { submit, isPending } = useRateVideo(videoId, slug);
    const [hovered, setHovered] = useState(0);

    return (
        <div className="flex flex-wrap items-center gap-3">
            <StarRating
                ratingAverage={ratingAverage}
                ratingCount={ratingCount}
            />
            {/* biome-ignore lint/a11y/useSemanticElements: a fieldset is semantically wrong for a star-button strip; role="group" keeps the grouping accessible */}
            <div
                role="group"
                aria-label={t("videos.detail.rating.label")}
                className={cn("flex items-center", isPending && "pointer-events-none opacity-50")}
                onMouseLeave={() => setHovered(0)}
            >
                {STAR_POSITIONS.map((position) => (
                    <button
                        key={position}
                        type="button"
                        disabled={isPending}
                        onClick={() => submit(position)}
                        onMouseEnter={() => setHovered(position)}
                        onFocus={() => setHovered(position)}
                        aria-label={t("videos.detail.rating.rateAria", { stars: position })}
                        className="p-0.5 transition-transform hover:scale-110"
                    >
                        <StarIcon
                            className={cn(
                                "size-4 transition-colors",
                                position <= hovered
                                    ? "fill-warning text-warning"
                                    : "text-muted-foreground/40"
                            )}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
