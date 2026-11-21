"use client";

import { I18nProvider } from "@videojs/react/i18n";
import { YouTubeVideo } from "@videojs/react/media/youtube-video";
import { Video, VideoPlayer as VideoJsPlayer } from "@videojs/react/video";
import type { ReactNode } from "react";
import "@videojs/react/video/neutral-skin.css";
import "./video-player.css";

import { VideoPlayerSkin } from "./VideoPlayer.Skin";

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
 * @property {boolean} [pinned] - Whether the player is docked to the top of the viewport.
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
    pinned?: boolean;
    children?: ReactNode;
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
    pinned,
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
                <VideoPlayerSkin
                    title={title}
                    pinned={pinned}
                    controls={controls}
                >
                    {media}
                </VideoPlayerSkin>
                {children}
            </VideoJsPlayer>
        </I18nProvider>
    );
}

export default VideoPlayerMedia;
