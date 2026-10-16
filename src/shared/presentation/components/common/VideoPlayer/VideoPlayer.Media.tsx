"use client";

import { I18nProvider } from "@videojs/react/i18n";
import { YouTubeVideo } from "@videojs/react/media/youtube-video";
import { NeutralVideoSkin, Video, VideoPlayer as VideoJsPlayer } from "@videojs/react/video";
import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";
import "@videojs/react/video/neutral-skin.css";
import "./video-player.css";

import { VideoPlayerReelSkin } from "./VideoPlayer.ReelSkin";

/**
 * Props for VideoPlayer.Media.
 *
 * @interface VideoPlayerMediaProps
 * @property {string} title - Accessible title handed to the player's metadata.
 * @property {string | null} [poster] - Poster frame URL.
 * @property {string} [youtubeUrl] - YouTube URL source (takes precedence).
 * @property {string} [videoUrl] - Direct file/remote URL source.
 * @property {"full" | "reel"} [controls] - Skin preset. Defaults to "full".
 * @property {boolean} [autoPlay] - Autoplay on mount.
 * @property {boolean} [muted] - Start muted (required for autoplay).
 * @property {boolean} [loop] - Loop playback.
 * @property {ReactNode} [children] - Rendered inside the player context, for `usePlayer()` consumers.
 */
export interface VideoPlayerMediaProps {
    title: string;
    poster?: string | null;
    youtubeUrl?: string;
    videoUrl?: string;
    controls?: "full" | "reel";
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
    children?: ReactNode;
}

/**
 * renderPoster
 *
 * @description
 * Draws the poster through `next/image` instead of the skin's own `<img>`, so the frame
 * goes through the image pipeline like every other thumbnail in the app.
 *
 * @param props - The image props the skin resolves, including the poster `src`.
 * @returns {ReactNode} The poster image, or null before a source resolves.
 */
function renderPoster({ src, alt }: ComponentProps<"img">) {
    if (typeof src !== "string" || !src) return null;

    return (
        <Image
            fill
            priority
            src={src}
            alt={alt ?? ""}
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover"
        />
    );
}

/**
 * VideoPlayer.Media
 *
 * @description
 * The Video.js 10 embed: a YouTube adapter or a native `<video>` under one of two skins,
 * `full` (the packaged neutral control set) or `reel` (the shorts transport). The brand
 * palette binds to the `--media-*` variables in `video-player.css`, and the control copy
 * follows `<html lang>` through the i18n provider.
 */
export function VideoPlayerMedia({
    title,
    poster,
    youtubeUrl,
    videoUrl,
    controls = "full",
    autoPlay,
    muted,
    loop,
    children
}: VideoPlayerMediaProps) {
    const media = youtubeUrl ? (
        <YouTubeVideo
            playsInline
            loop={loop}
            src={youtubeUrl}
            muted={muted}
            autoPlay={autoPlay}
        />
    ) : (
        <Video
            playsInline
            loop={loop}
            src={videoUrl}
            muted={muted}
            autoPlay={autoPlay}
            preload="metadata"
        />
    );

    return (
        <I18nProvider>
            <VideoJsPlayer
                title={title}
                poster={poster}
            >
                {controls === "reel" ? (
                    <VideoPlayerReelSkin renderPoster={renderPoster}>{media}</VideoPlayerReelSkin>
                ) : (
                    <NeutralVideoSkin
                        className="size-full"
                        renderPoster={renderPoster}
                    >
                        {media}
                    </NeutralVideoSkin>
                )}
                {children}
            </VideoJsPlayer>
        </I18nProvider>
    );
}

export default VideoPlayerMedia;
