import type { IVideoExclusiveShowEntity } from "@/modules/videos/domain/entities/IVideoExclusiveShowEntity";

/**
 * VideoExclusiveShowLabels
 *
 * @description
 * Pre-translated chrome labels for the exclusive show section, resolved on the
 * server from the request language. Passing them in keeps the section a server
 * component so its streamed markup never mismatches on hydration.
 *
 * @property {string} exclusive - Label for the "exclusive" badge
 * @property {string} episodes - Heading for the episodes list
 * @property {string} watchNow - Label for the watch call-to-action
 */
export interface VideoExclusiveShowLabels {
    exclusive: string;
    episodes: string;
    watchNow: string;
}

/**
 * VideoExclusiveShowViewProps
 *
 * @description
 * Props for the exclusive show presentation component.
 *
 * @property {IVideoExclusiveShowEntity} category - Pre-mapped exclusive category (show) with its episodes
 * @property {VideoExclusiveShowLabels} labels - Server-resolved translated chrome labels
 */
export interface VideoExclusiveShowViewProps {
    category: IVideoExclusiveShowEntity;
    labels: VideoExclusiveShowLabels;
}
