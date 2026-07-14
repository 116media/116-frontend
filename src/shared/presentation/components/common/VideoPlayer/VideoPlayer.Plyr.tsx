"use client";

import { type APITypes, Plyr as PlyrReact } from "plyr-react";
import type { Ref } from "react";
import "plyr-react/plyr.css";
import "./video-plyr.css";

import { videoMimeType } from "@/shared/presentation/utils/video/video.utils";

/**
 * Control-set presets: `full` is the dashboard-proven transport for the detail
 * page; `reel` is the shorts transport (large play, play toggle, seek, time — audio
 * lives in a custom overlay control); `bare` strips the chrome to a progress bar.
 */
const CONTROL_PRESETS: Record<"full" | "reel" | "bare", Plyr.Options["controls"]> = {
    full: [
        "play-large",
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "settings",
        "fullscreen"
    ],
    reel: ["play-large", "play", "progress", "current-time"],
    bare: ["progress"]
};

/**
 * Props for VideoPlayer.Plyr.
 *
 * @interface VideoPlayerPlyrProps
 * @property {string} [youtubeId] - The 11-character YouTube video id (takes precedence).
 * @property {string} [videoUrl] - Direct file/remote URL source.
 * @property {string} [ratio] - Aspect ratio, e.g. "16:9" (default) or "9:16".
 * @property {"full" | "reel" | "bare"} [controls] - Control-set preset. Defaults to "full".
 * @property {boolean} [autoPlay] - Autoplay on mount.
 * @property {boolean} [muted] - Start muted (required for autoplay).
 * @property {number} [volume] - Initial playback volume (0 to 1).
 * @property {boolean} [loop] - Loop playback.
 * @property {Ref<APITypes>} [plyrApiRef] - Ref receiving the Plyr API (`{ plyr }`) for imperative control.
 */
export interface VideoPlayerPlyrProps {
    youtubeId?: string;
    videoUrl?: string;
    ratio?: string;
    controls?: "full" | "reel" | "bare";
    autoPlay?: boolean;
    muted?: boolean;
    volume?: number;
    loop?: boolean;
    plyrApiRef?: Ref<APITypes>;
}

/**
 * VideoPlayer.Plyr
 *
 * @description
 * The client-only inner player: a plyr-react embed for either a YouTube id or a
 * direct file URL, carrying the brand skin (`video-plyr.css` binds Plyr's CSS
 * variables to theme tokens). Plyr touches `window` at import time, so this file is
 * only loaded through `next/dynamic(..., { ssr: false })`. The API ref is passed as
 * a plain prop so it survives the dynamic boundary.
 */
export default function VideoPlayerPlyr({
    youtubeId,
    videoUrl,
    ratio = "16:9",
    controls = "full",
    autoPlay,
    muted,
    volume,
    loop,
    plyrApiRef
}: VideoPlayerPlyrProps) {
    const source: Plyr.SourceInfo = youtubeId
        ? { type: "video", sources: [{ src: youtubeId, provider: "youtube" }] }
        : {
              type: "video",
              sources: [{ src: videoUrl ?? "", type: videoMimeType(videoUrl ?? "") }]
          };

    const options: Plyr.Options = {
        controls: CONTROL_PRESETS[controls],
        settings: ["quality", "speed"],
        ratio,
        clickToPlay: controls !== "bare",
        hideControls: true,
        resetOnEnd: !loop,
        autoplay: Boolean(autoPlay),
        muted: Boolean(muted),
        storage: { enabled: false },
        loop: { active: Boolean(loop) },
        ...(typeof volume === "number" ? { volume } : {})
    };

    return (
        <PlyrReact
            ref={plyrApiRef}
            source={source}
            options={options}
        />
    );
}
