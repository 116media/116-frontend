import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";

/**
 * VideoFeedSectionViewProps
 *
 * @description
 * Props for the VideoFeedSection presentation component — a titled grid of
 * vertical video cards (one pinned category's latest videos).
 *
 * @property {string} title - Section heading shown at the top-left
 * @property {string} viewAllHref - Destination of the "view all" link at the top-right
 * @property {IVideoSummaryEntity[]} videos - The videos rendered in the grid
 */
export interface VideoFeedSectionViewProps {
    title: string;
    viewAllHref: string;
    videos: IVideoSummaryEntity[];
}
