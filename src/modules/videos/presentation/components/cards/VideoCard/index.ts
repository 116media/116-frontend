import { VideoCardDate } from "./VideoCard.Date";
import { Horizontal } from "./VideoCard.Horizontal";
import { VideoCardMedia } from "./VideoCard.Media";
import { VideoCardRating } from "./VideoCard.Rating";
import { VideoCardShareCount } from "./VideoCard.ShareCount";
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
 * Compound component for video (episode) cards: `.Horizontal` (bordered row) and
 * `.Vertical` (poster-style grid card) are the ready-made layouts; `.Media`, `.Date`,
 * `.Rating` and `.ShareCount` are the slots they arrange, for a surface composing its own.
 */
export const VideoCard = {
    Horizontal,
    Vertical,
    Media: VideoCardMedia,
    Date: VideoCardDate,
    Rating: VideoCardRating,
    ShareCount: VideoCardShareCount
} as const;
