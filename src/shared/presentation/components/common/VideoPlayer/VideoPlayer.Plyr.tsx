"use client";

import { Plyr as PlyrReact } from "plyr-react";
import "plyr-react/plyr.css";
import "./video-plyr.css";

/**
 * The dashboard-proven Plyr control set for YouTube embeds: full transport,
 * quality/speed settings, 16:9 frame, click-to-play, auto-hiding controls,
 * and a reset to the poster when playback ends.
 */
const PLYR_OPTIONS: Plyr.Options = {
    controls: [
        "play-large",
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "settings",
        "fullscreen"
    ],
    settings: ["quality", "speed"],
    ratio: "16:9",
    clickToPlay: true,
    hideControls: true,
    resetOnEnd: true
};

/**
 * Props for VideoPlayer.Plyr.
 *
 * @interface VideoPlayerPlyrProps
 * @property {string} youtubeId - The 11-character YouTube video id to embed.
 */
export interface VideoPlayerPlyrProps {
    youtubeId: string;
}

/**
 * VideoPlayer.Plyr
 *
 * @description
 * The client-only inner player: a plyr-react YouTube embed carrying the brand skin
 * (`video-plyr.css` binds Plyr's CSS variables to theme tokens). Plyr touches `window`
 * at import time, so this file is only loaded through `next/dynamic(..., { ssr: false })`.
 */
export default function VideoPlayerPlyr({ youtubeId }: VideoPlayerPlyrProps) {
    return (
        <PlyrReact
            options={PLYR_OPTIONS}
            source={{ type: "video", sources: [{ src: youtubeId, provider: "youtube" }] }}
        />
    );
}
