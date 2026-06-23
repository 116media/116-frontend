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
