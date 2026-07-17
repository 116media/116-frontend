"use client";

import type { APITypes } from "plyr-react";
import { useEffect, useRef, useState } from "react";

import { VideoPlayer } from "@/shared/presentation/components/common/VideoPlayer";

import { ShortVideoPlayerLoading } from "./ShortVideoPlayer.Loading";

/**
 * Props for the ShortVideoPlayer component.
 *
 * @interface ShortVideoPlayerProps
 * @property {string | null} videoUrl - Cloudinary file URL, or null (poster only).
 * @property {string | null} thumbnailUrl - Poster URL.
 * @property {string} title - Accessible label.
 * @property {boolean} isActive - Whether this is the visible short.
 * @property {boolean} isPlaying - Desired play state for the active short.
 * @property {boolean} isMuted - Session mute state.
 * @property {number} volume - Session playback volume (0 to 1).
 */
export interface ShortVideoPlayerProps {
    videoUrl: string | null;
    thumbnailUrl: string | null;
    title: string;
    isActive: boolean;
    isPlaying: boolean;
    isMuted: boolean;
    volume: number;
}

/**
 * ShortVideoPlayer
 *
 * @description
 * The shared `VideoPlayer` configured for shorts, matching the dashboard réel
 * preview: 9:16, the `reel` control set (large play, play toggle, seek, time), with
 * mute/volume driven from the session's custom overlay control. Drives play/pause on
 * the underlying Plyr instance as the slide becomes active; rewinds when it leaves
 * view. A skeleton covers the stage until the clip can play.
 */
export function ShortVideoPlayer({
    videoUrl,
    thumbnailUrl,
    title,
    isActive,
    isPlaying,
    isMuted,
    volume
}: ShortVideoPlayerProps) {
    const playerRef = useRef<APITypes>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const plyr = playerRef.current?.plyr;
        if (!plyr || typeof plyr.play !== "function") return;
        if (isActive && isPlaying) {
            void Promise.resolve(plyr.play()).catch(() => undefined);
        } else {
            plyr.pause();
            if (!isActive) plyr.currentTime = 0;
        }
    }, [isActive, isPlaying]);

    useEffect(() => {
        const plyr = playerRef.current?.plyr;
        if (!plyr) return;
        plyr.muted = isMuted;
        plyr.volume = volume;
    }, [isMuted, volume]);

    useEffect(() => {
        setIsReady(false);
        let cancelled = false;
        let detach: (() => void) | undefined;

        const attach = () => {
            if (cancelled) return;
            const media = (
                playerRef.current?.plyr as unknown as
                    | { media?: HTMLMediaElement | null }
                    | undefined
            )?.media;
            if (!media) {
                window.setTimeout(attach, 120);
                return;
            }
            if (media.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
                setIsReady(true);
                return;
            }
            const markReady = () => {
                if (!cancelled) setIsReady(true);
            };
            media.addEventListener("canplay", markReady);
            media.addEventListener("playing", markReady);
            detach = () => {
                media.removeEventListener("canplay", markReady);
                media.removeEventListener("playing", markReady);
            };
        };

        attach();
        return () => {
            cancelled = true;
            detach?.();
        };
    }, []);

    return (
        <div className="relative size-full">
            <VideoPlayer
                loop
                ratio="9:16"
                title={title}
                controls="reel"
                muted={isMuted}
                volume={volume}
                videoUrl={videoUrl}
                playerRef={playerRef}
                autoPlay={isActive}
                thumbnailUrl={thumbnailUrl}
            />
            {videoUrl && !isReady && <ShortVideoPlayerLoading />}
        </div>
    );
}
