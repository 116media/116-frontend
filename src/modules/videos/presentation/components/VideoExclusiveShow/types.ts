import type { IVideoExclusiveShowEntity } from "@/modules/videos/domain/entities/IVideoExclusiveShowEntity";
import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";

/**
 * VideoExclusiveShowViewProps
 *
 * @description
 * Props for the exclusive show presentation component.
 *
 * @property {IVideoExclusiveShowEntity} category - Pre-mapped exclusive category (show) with its episodes
 */
export interface VideoExclusiveShowViewProps {
    category: IVideoExclusiveShowEntity;
}

/**
 * VideoExclusiveShowPosterProps
 *
 * @description
 * Props for the poster panel (left side) of the exclusive show section.
 *
 * @property {IVideoExclusiveShowEntity} category - The exclusive category (show)
 */
export interface VideoExclusiveShowPosterProps {
    category: IVideoExclusiveShowEntity;
}

/**
 * VideoExclusiveShowEpisodesProps
 *
 * @description
 * Props for the episodes panel (right side) of the exclusive show section.
 *
 * @property {IVideoSummaryEntity[]} episodes - The show's episodes
 */
export interface VideoExclusiveShowEpisodesProps {
    episodes: IVideoSummaryEntity[];
}
