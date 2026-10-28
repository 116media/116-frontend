"use client";

import { usePlayer } from "@videojs/react/video";
import { useEffect, useState } from "react";

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
 * Props for the transport that drives the player from the session state.
 *
 * @interface ShortVideoTransportProps
 * @property {boolean} isActive - Whether this is the visible short.
 * @property {boolean} isPlaying - Desired play state for the active short.
 * @property {boolean} isMuted - Session mute state.
 * @property {number} volume - Session playback volume (0 to 1).
 * @property {(canPlay: boolean) => void} onCanPlayChange - Reports when the clip can play.
 */
interface ShortVideoTransportProps {
    isActive: boolean;
    isPlaying: boolean;
    isMuted: boolean;
    volume: number;
    onCanPlayChange: (canPlay: boolean) => void;
}

/**
 * ShortVideoTransport
 *
 * @description
 * Drives playback from the session state. Video.js exposes the player only through
 * `usePlayer()` inside the player's own subtree, so this renders nothing and exists
 * purely to hold those effects.
 */
function ShortVideoTransport({
    isActive,
    isPlaying,
    isMuted,
    volume,
    onCanPlayChange
}: ShortVideoTransportProps) {
    const player = usePlayer();
    const canPlay = usePlayer((state) => state.canPlay);
    // The Player provider attaches the media in its own effect, which React runs after
    // this child's: a resolved source is the first state the store reports once attached.
    const isAttached = usePlayer((state) => state.currentSrc !== "");

    useEffect(() => {
        if (!isAttached) return;
        if (isActive && isPlaying) {
            void player.play().catch(() => undefined);
            return;
        }
        player.pause();
        if (!isActive) void player.seek(0).catch(() => undefined);
    }, [player, isAttached, isActive, isPlaying]);

    useEffect(() => {
        if (!isAttached) return;
        player.setMuted(isMuted);
        player.setVolume(volume);
    }, [player, isAttached, isMuted, volume]);

    useEffect(() => {
        onCanPlayChange(canPlay);
    }, [onCanPlayChange, canPlay]);

    return null;
}

/**
 * ShortVideoPlayer
 *
 * @description
 * The shared `VideoPlayer` configured for shorts, matching the dashboard réel preview:
 * 9:16, the `reel` transport (centred play, play toggle, seek, time), with mute/volume
 * driven from the session's custom overlay control. Plays and pauses as the slide becomes
 * active; rewinds when it leaves view. A skeleton covers the stage until the clip can play.
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
    const [canPlay, setCanPlay] = useState(false);

    return (
        <div className="relative size-full">
            <VideoPlayer.Root
                loop
                ratio="9:16"
                title={title}
                controls="reel"
                muted={isMuted}
                videoUrl={videoUrl}
                autoPlay={isActive}
                thumbnailUrl={thumbnailUrl}
            >
                <ShortVideoTransport
                    volume={volume}
                    isMuted={isMuted}
                    isActive={isActive}
                    isPlaying={isPlaying}
                    onCanPlayChange={setCanPlay}
                />
            </VideoPlayer.Root>
            {videoUrl && !canPlay && <ShortVideoPlayerLoading />}
        </div>
    );
}
