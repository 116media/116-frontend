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
 * VideosMegaMenuCardImageProps
 *
 * @description
 * Props for the shared image piece used inside both card variants.
 * - size="full"  → full-width aspect-video (Featured)
 * - size="thumb" → fixed square thumbnail with spinning border on hover (Compact)
 */
export interface VideosMegaMenuCardImageProps {
    src: string | null;
    alt: string;
    categoryName: string;
    size: "full" | "thumb";
}

/**
 * VideosMegaMenuCardBodyProps
 *
 * @description
 * Props for the shared text content piece used inside both card variants.
 */
export interface VideosMegaMenuCardBodyProps {
    title: string;
    categoryName: string;
    publishedAt: string | null;
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
