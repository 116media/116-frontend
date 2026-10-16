"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import { extractYoutubeId } from "@/shared/presentation/utils/youtube/youtube.utils";
import { VideoPlayerPoster } from "./VideoPlayer.Poster";

/**
 * The Video.js embed, loaded with SSR off so the player and its skin stylesheet stay out
 * of the server bundle. The poster layer underneath holds the frame's height until the
 * chunk resolves, so there is no layout shift.
 */
const VideoPlayerMedia = dynamic(() => import("./VideoPlayer.Media"), {
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
 * @property {"full" | "reel"} [controls] - Skin preset; "reel" is the shorts transport.
 * @property {boolean} [autoPlay] - Autoplay on mount.
 * @property {boolean} [muted] - Start muted (required for autoplay).
 * @property {boolean} [loop] - Loop playback.
 * @property {ReactNode} [children] - Rendered inside the player context, where `usePlayer()` resolves.
 */
export interface VideoPlayerProps {
    title: string;
    thumbnailUrl: string | null;
    youtubeVideoUrl?: string | null;
    videoUrl?: string | null;
    ratio?: string;
    controls?: "full" | "reel";
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
    children?: ReactNode;
}

/**
 * VideoPlayer
 *
 * @description
 * Entity-agnostic playback surface: a client-only Video.js 10 embed above a poster layer,
 * so server HTML and the chunk-loading window both show the thumbnail. Plays either a
 * YouTube URL or a direct file/remote URL (YouTube wins when both are set); with no source
 * it renders the poster permanently. `ratio` / `controls` / playback flags configure the
 * frame, so the detail page (16:9, full) and shorts (9:16, reel) share it. Anything passed
 * as `children` renders inside the player context and may drive it through `usePlayer()`.
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
    loop,
    children
}: VideoPlayerProps) {
    const youtubeUrl = extractYoutubeId(youtubeVideoUrl ?? null) ? youtubeVideoUrl : null;
    const ratioClass = RATIO_CLASS[ratio] ?? RATIO_CLASS["16:9"];
    const hasSource = Boolean(youtubeUrl) || Boolean(videoUrl);

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
                <VideoPlayerMedia
                    loop={loop}
                    title={title}
                    muted={muted}
                    autoPlay={autoPlay}
                    controls={controls}
                    poster={thumbnailUrl}
                    youtubeUrl={youtubeUrl ?? undefined}
                    videoUrl={videoUrl ?? undefined}
                >
                    {children}
                </VideoPlayerMedia>
            </div>
        </div>
    );
}
