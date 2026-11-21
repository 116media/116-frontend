import { VideoPlayer as VideoPlayerRoot } from "./VideoPlayer";
import { VideoPlayerAutostart } from "./VideoPlayer.Autostart";
import { VideoPlayerPoster } from "./VideoPlayer.Poster";

export type { VideoPlayerProps } from "./VideoPlayer";

/**
 * VideoPlayer
 *
 * @description
 * Entity-agnostic playback surface: the root arranges the embed over `.Poster`, its 16:9
 * placeholder layer, with `.Autostart` as an opt-in child that plays on arrival.
 * Consumed by any feature that plays a video. `.Media` is deliberately
 * absent — the root loads it through `next/dynamic` with `ssr: false`, and naming it here
 * would pull that chunk back into the static graph.
 */
export const VideoPlayer = {
    Root: VideoPlayerRoot,
    Autostart: VideoPlayerAutostart,
    Poster: VideoPlayerPoster
} as const;
