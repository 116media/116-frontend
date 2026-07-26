import { Horizontal } from "./VideoCard.Horizontal";
import { Vertical } from "./VideoCard.Vertical";

export type {
    VideoCardHorizontalProps,
    VideoCardHorizontalVideo,
    VideoCardProps
} from "./types";

/**
 * VideoCard
 *
 * @description
 * Compound component for video (episode) cards: `.Horizontal` (bordered row)
 * and `.Vertical` (poster-style grid card). Each variant renders one video in
 * a different layout; members are documented at their own files.
 */
export const VideoCard = { Horizontal, Vertical } as const;
