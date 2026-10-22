"use client";

import { CaptionsButton, Container, Controls, Gesture } from "@videojs/react";
import { CaptionsOffIcon, CaptionsOnIcon } from "@videojs/react/icons";
import { usePlayer } from "@videojs/react/video";
import { type ReactNode, useRef } from "react";

import { useInteractiveEmbed } from "@/shared/presentation/hooks/useInteractiveEmbed";

import { MOBILE_CONTROL_TARGET } from "./mobileSkinVariants";
import { VideoPlayerMobileScrubber } from "./VideoPlayer.MobileScrubber";
import { VideoPlayerMobileSeekRow } from "./VideoPlayer.MobileSeekRow";
import { VideoPlayerMobileStatusRow } from "./VideoPlayer.MobileStatusRow";

/**
 * How far a double tap on either half of the frame moves playback, in seconds.
 */
const DOUBLE_TAP_SECONDS = 10;

/**
 * Props for VideoPlayer.MobileSkin.
 *
 * @interface VideoPlayerMobileSkinProps
 * @property {ReactNode} children - The media component the skin wraps.
 * @property {"pinned" | "inline"} variant - `pinned` is the full-bleed band at the top of
 * the screen, `inline` the framed player sitting in the page.
 * @property {string} showControlsLabel - Accessible name for the surface that brings the
 * transport back, since the embed takes the taps the skin would otherwise read.
 */
export interface VideoPlayerMobileSkinProps {
    children: ReactNode;
    variant: "pinned" | "inline";
    showControlsLabel: string;
}

/**
 * VideoPlayer.MobileSkin
 *
 * @description
 * The phone transport, arranged: captions above, the embed's own play button in the
 * middle, and the timeline below. The pinned band adds the seeks either side of that play
 * button and carries its scrub line on the very bottom edge.
 */
export function VideoPlayerMobileSkin({
    children,
    variant,
    showControlsLabel
}: VideoPlayerMobileSkinProps) {
    const store = usePlayer();
    const isPinned = variant === "pinned";
    const frameRef = useRef<HTMLDivElement>(null);
    const controlsVisible = usePlayer((state) => state.controlsVisible);

    // This skin hands the play control to the embed, so the frame has to take taps.
    useInteractiveEmbed(frameRef);

    return (
        <Container
            ref={frameRef}
            className="media-container relative size-full bg-black"
        >
            {children}

            {!controlsVisible && (
                <button
                    type="button"
                    aria-label={showControlsLabel}
                    onClick={() => store.toggleControls(true)}
                    className="absolute inset-0 z-10 cursor-default"
                />
            )}

            <Controls.Root>
                <Controls.Backdrop className="mobile-skin-scrim absolute inset-0" />

                <Controls.Content className="mobile-skin-controls absolute inset-0 flex flex-col justify-between">
                    <Controls.Group
                        className="flex items-center justify-end gap-1 p-2"
                        aria-label="Options"
                    >
                        <CaptionsButton
                            className={MOBILE_CONTROL_TARGET}
                            render={(props, state) => (
                                <button {...props}>
                                    {state.subtitlesShowing ? (
                                        <CaptionsOnIcon className="size-6" />
                                    ) : (
                                        <CaptionsOffIcon className="size-6" />
                                    )}
                                </button>
                            )}
                        />
                    </Controls.Group>

                    {isPinned && <VideoPlayerMobileSeekRow />}

                    {isPinned ? (
                        <div className="flex flex-col gap-1">
                            <VideoPlayerMobileStatusRow isPinned />
                            <VideoPlayerMobileScrubber isPinned />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1 px-3 pb-2">
                            <VideoPlayerMobileScrubber isPinned={false} />
                            <VideoPlayerMobileStatusRow isPinned={false} />
                        </div>
                    )}
                </Controls.Content>
            </Controls.Root>

            <Gesture
                type="doubletap"
                region="left"
                action="seekStep"
                value={DOUBLE_TAP_SECONDS}
            />
            <Gesture
                type="doubletap"
                region="right"
                action="seekStep"
                value={DOUBLE_TAP_SECONDS}
            />
        </Container>
    );
}
