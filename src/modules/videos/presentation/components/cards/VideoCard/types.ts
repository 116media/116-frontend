import type { ReactNode } from "react";
import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";

/**
 * VideoCardProps
 *
 * @description
 * Shared props for all VideoCard variants. Each card renders a single video
 * (episode).
 *
 * @property {IVideoSummaryEntity} video - The video (episode) to display
 */
export interface VideoCardProps {
    video: IVideoSummaryEntity;
}

/**
 * Video data required by the horizontal card.
 *
 * @property {string} slug - URL slug for the video detail link.
 * @property {string} title - Video title.
 * @property {string | null} [thumbnailUrl] - Optional thumbnail URL.
 * @property {string | null} [publishedAt] - Optional publication timestamp.
 * @property {number} [shareCount] - Optional share tally.
 * @property {number} ratingAverage - Average rating.
 * @property {number} ratingCount - Rating tally.
 * @property {string} [categoryName] - Optional category label.
 */
export interface VideoCardHorizontalVideo {
    slug: string;
    title: string;
    shareCount?: number;
    ratingCount: number;
    categoryName?: string;
    ratingAverage: number;
    thumbnailUrl?: string | null;
    publishedAt?: string | null;
}

/**
 * Props for the horizontal video-card variant.
 *
 * @property {VideoCardHorizontalVideo} video - Video fields rendered by the row.
 * @property {ReactNode} [trailingAction] - Interactive action rendered outside navigation links.
 * @property {boolean} [showCategory] - Whether to show the optional category label.
 * @property {string} [className] - Extra classes merged onto the card shell.
 */
export interface VideoCardHorizontalProps {
    className?: string;
    showCategory?: boolean;
    trailingAction?: ReactNode;
    video: VideoCardHorizontalVideo;
}
