import { VideoPlayer as VideoPlayerRoot } from "./VideoPlayer";
import { VideoPlayerPoster } from "./VideoPlayer.Poster";

export type { VideoPlayerProps } from "./VideoPlayer";

/**
 * VideoPlayer
 *
 * @description
 * Entity-agnostic playback surface: the root arranges the embed over `.Poster`, its 16:9
 * placeholder layer. Consumed by any feature that plays a video. `.Media` is deliberately
 * absent — the root loads it through `next/dynamic` with `ssr: false`, and naming it here
 * would pull that chunk back into the static graph.
 */
export const VideoPlayer = {
    Root: VideoPlayerRoot,
    Poster: VideoPlayerPoster
} as const;
