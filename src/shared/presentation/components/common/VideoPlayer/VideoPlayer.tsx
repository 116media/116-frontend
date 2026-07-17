"use client";

import dynamic from "next/dynamic";
import type { APITypes } from "plyr-react";
import type { Ref } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import { extractYoutubeId } from "@/shared/presentation/utils/youtube/youtube.utils";
import { VideoPlayerPoster } from "./VideoPlayer.Poster";

/**
 * The client-only Plyr embed, loaded with SSR off because Plyr touches `window` at
 * import time. The poster layer underneath holds the frame's height until the chunk
 * resolves, so there is no layout shift.
 */
const PlyrPlayer = dynamic(() => import("./VideoPlayer.Plyr"), {
    ssr: false,
    loading: () => null
});

/**
 * Aspect-ratio utilities keyed by the `ratio` prop; unknown ratios fall back to 16:9.
 */
const RATIO_CLASS: Record<string, string> = {
    "16:9": "aspect-video",
    "9:16": "aspect-9/16"
};

/**
 * Props for VideoPlayer.
 *
 * @interface VideoPlayerProps
 * @property {string} title - The video title, used as the poster image alt text.
 * @property {string | null} thumbnailUrl - The video thumbnail, shown as the poster frame.
 * @property {string | null} [youtubeVideoUrl] - YouTube URL source (takes precedence over videoUrl).
 * @property {string | null} [videoUrl] - Direct file/remote URL source (Cloudinary shorts).
 * @property {string} [ratio] - Aspect ratio, e.g. "16:9" (default) or "9:16".
 * @property {"full" | "reel" | "bare"} [controls] - Control-set preset; "reel" is the shorts transport.
 * @property {boolean} [autoPlay] - Autoplay on mount.
 * @property {boolean} [muted] - Start muted (required for autoplay).
 * @property {number} [volume] - Initial playback volume (0 to 1).
 * @property {boolean} [loop] - Loop playback.
 * @property {Ref<APITypes>} [playerRef] - Ref receiving the Plyr API (`{ plyr }`) for imperative control.
 */
export interface VideoPlayerProps {
    title: string;
    thumbnailUrl: string | null;
    youtubeVideoUrl?: string | null;
    videoUrl?: string | null;
    ratio?: string;
    controls?: "full" | "reel" | "bare";
    autoPlay?: boolean;
    muted?: boolean;
    volume?: number;
    loop?: boolean;
    playerRef?: Ref<APITypes>;
}

/**
 * VideoPlayer
 *
 * @description
 * Entity-agnostic playback surface: a client-only Plyr embed above a poster layer,
 * so server HTML and the chunk-loading window both show the thumbnail. Plays either
 * a YouTube URL or a direct file/remote URL (YouTube wins when both are set); with
 * no source it renders the poster permanently. `ratio` / `controls` / playback flags
 * configure the frame, so the detail page (16:9, full) and shorts (9:16, bare) share it.
 */
export function VideoPlayer({
    youtubeVideoUrl,
    videoUrl,
    thumbnailUrl,
    title,
    ratio = "16:9",
    controls = "full",
    autoPlay,
    muted,
    volume,
    loop,
    playerRef
}: VideoPlayerProps) {
    const youtubeId = extractYoutubeId(youtubeVideoUrl ?? null);
    const ratioClass = RATIO_CLASS[ratio] ?? RATIO_CLASS["16:9"];
    const hasSource = Boolean(youtubeId) || Boolean(videoUrl);

    if (!hasSource) {
        return (
            <div className="video-player w-full overflow-hidden rounded-lg">
                <VideoPlayerPoster
                    title={title}
                    thumbnailUrl={thumbnailUrl}
                    ratioClassName={ratioClass}
                />
            </div>
        );
    }

    return (
        <div className={cn("video-player relative w-full overflow-hidden rounded-lg", ratioClass)}>
            <div className="absolute inset-0">
                <VideoPlayerPoster
                    title={title}
                    thumbnailUrl={thumbnailUrl}
                    ratioClassName={ratioClass}
                />
            </div>
            <div className="relative size-full">
                <PlyrPlayer
                    loop={loop}
                    ratio={ratio}
                    muted={muted}
                    volume={volume}
                    autoPlay={autoPlay}
                    controls={controls}
                    plyrApiRef={playerRef}
                    youtubeId={youtubeId ?? undefined}
                    videoUrl={videoUrl ?? undefined}
                />
            </div>
        </div>
    );
}
