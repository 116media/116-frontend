"use client";

import { I18nProvider } from "@videojs/react/i18n";
import { YouTubeVideo } from "@videojs/react/media/youtube-video";
import { NeutralVideoSkin, Video, VideoPlayer as VideoJsPlayer } from "@videojs/react/video";
import Image from "next/image";
import { type ComponentProps, type ReactNode, useEffect, useState } from "react";
import "@videojs/react/video/neutral-skin.css";
import "./video-player.css";

import { VideoPlayerMobileSkin } from "./VideoPlayer.MobileSkin";
import { VideoPlayerReelSkin } from "./VideoPlayer.ReelSkin";

/**
 * Phones, by pointer rather than width alone, so a narrow desktop window keeps the
 * pointer-sized skin it is built for.
 */
const PHONE_QUERY = "(max-width: 639px) and (pointer: coarse)";

/**
 * useIsPhone
 *
 * @description
 * Tracks {@link PHONE_QUERY}, seeded on the first render rather than after it: this
 * module is loaded with SSR off, and a second pass would rebuild the media element.
 *
 * @returns Whether the viewport is a phone.
 */
function useIsPhone(): boolean {
    const [isPhone, setIsPhone] = useState(
        () => typeof window !== "undefined" && window.matchMedia(PHONE_QUERY).matches
    );

    useEffect(() => {
        const list = window.matchMedia(PHONE_QUERY);
        setIsPhone(list.matches);

        const onChange = (event: MediaQueryListEvent) => setIsPhone(event.matches);
        list.addEventListener("change", onChange);

        return () => list.removeEventListener("change", onChange);
    }, []);

    return isPhone;
}

/**
 * useArrivedByGesture
 *
 * @description
 * Whether the document had already been interacted with when the player mounted — true
 * when a card click routed here, false on a cold load. Read once: the embed URL is built
 * on the first render and never rebuilt.
 *
 * @returns Whether a gesture preceded this mount.
 */
function useArrivedByGesture(): boolean {
    // Absent on browsers that do not carry the API, where assuming a gesture is the safer
    // miss: a page nobody navigated to simply starts muted, instead of never starting.
    const [arrived] = useState(
        () => typeof navigator === "undefined" || (navigator.userActivation?.hasBeenActive ?? true)
    );

    return arrived;
}

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
    pinned,
    children
}: VideoPlayerMediaProps) {
    const isPhone = useIsPhone();
    const arrivedByGesture = useArrivedByGesture();

    // iOS refuses a play it did not handle inside the gesture itself, so an embed only
    // starts there when its URL carries the intent. Muted is the price iOS sets on that.
    const startsMuted = isPhone && arrivedByGesture && !autoPlay;
    const media = youtubeUrl ? (
        <YouTubeVideo
            playsInline
            loop={loop}
            src={youtubeUrl}
            muted={muted || startsMuted}
            autoPlay={autoPlay || startsMuted}
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
                ) : isPhone ? (
                    <VideoPlayerMobileSkin
                        renderPoster={renderPoster}
                        variant={pinned ? "pinned" : "inline"}
                    >
                        {media}
                    </VideoPlayerMobileSkin>
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
