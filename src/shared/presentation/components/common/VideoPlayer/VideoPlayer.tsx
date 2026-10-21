"use client";

import dynamic from "next/dynamic";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import {
    buildYoutubeThumbnailUrl,
    extractYoutubeId
} from "@/shared/presentation/utils/youtube/youtube.utils";
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
 * supportsElementFullscreen
 *
 * @description
 * Whether the browser can present an arbitrary element fullscreen. iPhone offers only a
 * video element's native presentation, which a YouTube embed never exposes, so there the
 * skin's fullscreen action resolves without doing anything.
 *
 * @returns Whether the Fullscreen API can take an element.
 */
function supportsElementFullscreen(): boolean {
    if (typeof document === "undefined") return true;

    const root = document.documentElement as HTMLElement & {
        webkitRequestFullscreen?: unknown;
    };

    return (
        typeof root.requestFullscreen === "function" ||
        typeof root.webkitRequestFullscreen === "function"
    );
}

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
 * @property {boolean} [pinned] - Whether the player is docked to the top of the viewport.
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
    pinned?: boolean;
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
    pinned,
    children
}: VideoPlayerProps) {
    const frameRef = useRef<HTMLDivElement>(null);
    const [isStage, setIsStage] = useState(false);

    const youtubeId = extractYoutubeId(youtubeVideoUrl ?? null);
    const youtubeUrl = youtubeId ? youtubeVideoUrl : null;
    const ratioClass = RATIO_CLASS[ratio] ?? RATIO_CLASS["16:9"];
    const hasSource = Boolean(youtubeUrl) || Boolean(videoUrl);

    const poster = thumbnailUrl ?? (youtubeId ? buildYoutubeThumbnailUrl(youtubeId) : null);

    useEffect(() => {
        const frame = frameRef.current;
        if (!frame || supportsElementFullscreen()) return;

        const onCapture = (event: MouseEvent) => {
            const target = event.target as HTMLElement | null;
            if (!target?.closest(".media-fullscreen-button, .video-fullscreen-trigger")) return;

            event.preventDefault();
            event.stopPropagation();
            setIsStage((open) => !open);
        };

        frame.addEventListener("click", onCapture, true);
        return () => frame.removeEventListener("click", onCapture, true);
    }, []);

    useEffect(() => {
        if (!isStage) return;

        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previous;
        };
    }, [isStage]);

    if (!hasSource) {
        return (
            <div className="video-player w-full overflow-hidden rounded-base">
                <VideoPlayerPoster
                    title={title}
                    thumbnailUrl={poster}
                    ratioClassName={ratioClass}
                />
            </div>
        );
    }

    return (
        <div
            ref={frameRef}
            className={cn(
                "video-player relative w-full overflow-hidden rounded-base",
                isStage
                    ? "player-stage fixed inset-0 z-100 h-dvh w-screen rounded-none"
                    : ratioClass
            )}
        >
            <div className="absolute inset-0">
                <VideoPlayerPoster
                    title={title}
                    thumbnailUrl={poster}
                    ratioClassName={ratioClass}
                />
            </div>
            <div className="relative size-full">
                <VideoPlayerMedia
                    loop={loop}
                    title={title}
                    muted={muted}
                    poster={poster}
                    autoPlay={autoPlay}
                    controls={controls}
                    pinned={pinned || isStage}
                    youtubeUrl={youtubeUrl ?? undefined}
                    videoUrl={videoUrl ?? undefined}
                >
                    {children}
                </VideoPlayerMedia>
            </div>
        </div>
    );
}
