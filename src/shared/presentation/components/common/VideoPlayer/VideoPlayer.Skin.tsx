"use client";

import { NeutralVideoSkin } from "@videojs/react/video";
import type { ReactNode } from "react";

import { useIsPhone } from "@/shared/presentation/hooks/useIsPhone";

import { VideoPlayerMobileSkin } from "./VideoPlayer.MobileSkin";
import { VideoPlayerPosterImage } from "./VideoPlayer.PosterImage";
import { VideoPlayerReelSkin } from "./VideoPlayer.ReelSkin";

/**
 * Props for VideoPlayer.Skin.
 *
 * @interface VideoPlayerSkinProps
 * @property {ReactNode} children - The media component the skin wraps.
 * @property {string} title - Accessible name for controls that stand for the whole frame.
 * @property {"full" | "reel"} controls - Which transport the surface asks for.
 * @property {boolean} [pinned] - Whether the player is docked to the top of the viewport.
 */
export interface VideoPlayerSkinProps {
    children: ReactNode;
    title: string;
    controls: "full" | "reel";
    pinned?: boolean;
}

/**
 * VideoPlayer.Skin
 *
 * @description
 * Picks the transport the surface and the device call for: the shorts reel wherever it is
 * asked for, the touch-sized one on a phone, and the packaged neutral set everywhere else.
 */
export function VideoPlayerSkin({ children, title, controls, pinned }: VideoPlayerSkinProps) {
    const isPhone = useIsPhone();

    if (controls === "reel") {
        return (
            <VideoPlayerReelSkin renderPoster={VideoPlayerPosterImage}>
                {children}
            </VideoPlayerReelSkin>
        );
    }

    if (isPhone) {
        return (
            <VideoPlayerMobileSkin
                showControlsLabel={title}
                variant={pinned ? "pinned" : "inline"}
            >
                {children}
            </VideoPlayerMobileSkin>
        );
    }

    return (
        <NeutralVideoSkin
            className="size-full"
            renderPoster={VideoPlayerPosterImage}
        >
            {children}
        </NeutralVideoSkin>
    );
}
