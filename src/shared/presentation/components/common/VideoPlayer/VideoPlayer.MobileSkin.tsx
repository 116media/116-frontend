"use client";

import {
    CaptionsButton,
    Container,
    Controls,
    FullscreenButton,
    Gesture,
    MuteButton,
    PlayButton,
    Poster,
    SeekButton,
    Time,
    TimeSlider
} from "@videojs/react";
import {
    CaptionsOffIcon,
    CaptionsOnIcon,
    FullscreenEnterIcon,
    FullscreenExitIcon,
    PauseIcon,
    PlayIcon,
    RestartIcon,
    SeekIcon,
    VolumeHighIcon,
    VolumeOffIcon
} from "@videojs/react/icons";
import type { ComponentProps, ReactElement, ReactNode } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for VideoPlayer.MobileSkin.
 *
 * @interface VideoPlayerMobileSkinProps
 * @property {ReactNode} children - The media component the skin wraps.
 * @property {"pinned" | "inline"} variant - `pinned` is the full-bleed band at the top of
 * the screen, `inline` the framed player sitting in the page.
 * @property {(props: ComponentProps<"img">) => ReactElement | null} renderPoster - Draws the poster.
 */
export interface VideoPlayerMobileSkinProps {
    children: ReactNode;
    variant: "pinned" | "inline";
    renderPoster: (props: ComponentProps<"img">) => ReactElement | null;
}

/**
 * The touch target every control in the skin fills, at the platform minimum rather than
 * the pointer-sized one the desktop skin uses.
 */
const TARGET = "grid size-11 shrink-0 place-items-center rounded-full text-white";

/**
 * VideoPlayer.MobileSkin
 *
 * @description
 * The phone transport: centre play flanked by ten-second seeks, a scrub line and the
 * secondary controls split to the edges. `pinned` carries the scrub line on the band's
 * bottom edge the way a docked player does; `inline` keeps it above a control row.
 */
export function VideoPlayerMobileSkin({
    children,
    variant,
    renderPoster
}: VideoPlayerMobileSkinProps) {
    const isPinned = variant === "pinned";

    const scrubber = (
        <TimeSlider.Root
            className={cn(
                "group/slider relative flex w-full touch-none items-center",
                isPinned ? "h-1" : "h-5"
            )}
        >
            <TimeSlider.Track
                className={cn(
                    "relative w-full overflow-hidden bg-white/30",
                    isPinned ? "h-1" : "h-1 rounded-full"
                )}
            >
                <TimeSlider.Buffer className="mobile-skin-buffer absolute inset-y-0 left-0 bg-white/40" />
                <TimeSlider.Fill className="mobile-skin-fill absolute inset-y-0 left-0 bg-primary dark:bg-secondary" />
            </TimeSlider.Track>
            <TimeSlider.Thumb className="mobile-skin-thumb size-3 rounded-full bg-primary transition-transform group-active/slider:scale-150 dark:bg-secondary" />
        </TimeSlider.Root>
    );

    return (
        <Container className="media-container relative size-full bg-black">
            {children}

            <Poster.Root className="mobile-skin-poster absolute inset-0">
                <Poster.Image render={renderPoster} />
            </Poster.Root>

            <Controls.Root>
                <Controls.Backdrop className="mobile-skin-scrim absolute inset-0" />

                <Controls.Content className="mobile-skin-controls absolute inset-0 flex flex-col justify-between">
                    <Controls.Group
                        className="flex items-center justify-end gap-1 p-2"
                        aria-label="Options"
                    >
                        <CaptionsButton
                            className={TARGET}
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

                    <Controls.Group
                        className="flex items-center justify-center gap-8"
                        aria-label="Lecture"
                    >
                        <SeekButton
                            seconds={-10}
                            className={TARGET}
                            render={(props) => (
                                <button {...props}>
                                    <SeekIcon className="size-7 -scale-x-100" />
                                </button>
                            )}
                        />
                        <PlayButton
                            className="grid size-14 shrink-0 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm"
                            render={(props, state) => (
                                <button {...props}>
                                    {state.ended ? (
                                        <RestartIcon className="size-8" />
                                    ) : state.paused ? (
                                        <PlayIcon className="size-8" />
                                    ) : (
                                        <PauseIcon className="size-8" />
                                    )}
                                </button>
                            )}
                        />
                        <SeekButton
                            seconds={10}
                            className={TARGET}
                            render={(props) => (
                                <button {...props}>
                                    <SeekIcon className="size-7" />
                                </button>
                            )}
                        />
                    </Controls.Group>

                    {isPinned ? (
                        <div className="flex flex-col gap-1">
                            <Controls.Group
                                className="flex items-center justify-between gap-2 px-3 pb-1"
                                aria-label="Progression"
                            >
                                <Time.Group className="flex items-center gap-1 font-medium text-sm text-white tabular-nums">
                                    <Time.Value type="current" />
                                    <Time.Separator />
                                    <Time.Value
                                        type="duration"
                                        className="text-white/70"
                                    />
                                </Time.Group>
                                <div className="flex items-center gap-1">
                                    <MuteButton
                                        className={TARGET}
                                        render={(props, state) => (
                                            <button {...props}>
                                                {state.muted ? (
                                                    <VolumeOffIcon className="size-6" />
                                                ) : (
                                                    <VolumeHighIcon className="size-6" />
                                                )}
                                            </button>
                                        )}
                                    />
                                    <FullscreenButton
                                        className={cn(TARGET, "video-fullscreen-trigger")}
                                        render={(props, state) => (
                                            <button {...props}>
                                                {state.fullscreen ? (
                                                    <FullscreenExitIcon className="size-6" />
                                                ) : (
                                                    <FullscreenEnterIcon className="size-6" />
                                                )}
                                            </button>
                                        )}
                                    />
                                </div>
                            </Controls.Group>
                            {scrubber}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1 px-3 pb-2">
                            {scrubber}
                            <Controls.Group
                                className="flex items-center justify-between gap-2"
                                aria-label="Progression"
                            >
                                <Time.Group className="flex items-center gap-1 pl-1 font-medium text-sm text-white tabular-nums">
                                    <Time.Value type="current" />
                                    <Time.Separator />
                                    <Time.Value
                                        type="duration"
                                        className="text-white/70"
                                    />
                                </Time.Group>
                                <div className="flex items-center gap-1">
                                    <MuteButton
                                        className={TARGET}
                                        render={(props, state) => (
                                            <button {...props}>
                                                {state.muted ? (
                                                    <VolumeOffIcon className="size-6" />
                                                ) : (
                                                    <VolumeHighIcon className="size-6" />
                                                )}
                                            </button>
                                        )}
                                    />
                                    <FullscreenButton
                                        className={cn(TARGET, "video-fullscreen-trigger")}
                                        render={(props, state) => (
                                            <button {...props}>
                                                {state.fullscreen ? (
                                                    <FullscreenExitIcon className="size-6" />
                                                ) : (
                                                    <FullscreenEnterIcon className="size-6" />
                                                )}
                                            </button>
                                        )}
                                    />
                                </div>
                            </Controls.Group>
                        </div>
                    )}
                </Controls.Content>
            </Controls.Root>

            <Gesture
                type="tap"
                action="toggleControls"
            />
            <Gesture
                type="doubletap"
                region="left"
                action="seekStep"
                value={10}
            />
            <Gesture
                type="doubletap"
                region="right"
                action="seekStep"
                value={10}
            />
        </Container>
    );
}
