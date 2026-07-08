import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";

/**
 * VideosMegaMenuCardProps
 *
 * @description
 * Shared props for both VideosMegaMenuCard.Featured and
 * VideosMegaMenuCard.Compact sub-components.
 */
export interface VideosMegaMenuCardProps {
    video: IVideoSummaryEntity;
}

/**
 * VideosMegaMenuCardStatsProps
 *
 * @description
 * Props for the rating + share stats piece used inside both card variants.
 * Displays a star rating row (average + count) and share count.
 */
export interface VideosMegaMenuCardStatsProps {
    shareCount: number;
    ratingAverage: number;
    ratingCount: number;
    /** "light" for stats overlaid on dark images, "default" for surface cards */
    variant?: "light" | "default";
}
