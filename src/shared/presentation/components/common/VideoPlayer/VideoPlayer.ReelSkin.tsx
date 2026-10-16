"use client";

import {
    Container,
    Controls,
    ErrorDialog,
    Gesture,
    Hotkey,
    PlayButton,
    Poster,
    type PosterImageProps,
    StatusAnnouncer,
    Time,
    TimeSlider
} from "@videojs/react";
import type { ReactNode } from "react";

import { PauseIcon, PlayIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for VideoPlayer.ReelSkin.
 *
 * @interface VideoPlayerReelSkinProps
 * @property {ReactNode} children - The media element the skin wraps.
 * @property {PosterImageProps["render"]} [renderPoster] - Draws the poster in place of the skin's `<img>`.
 */
export interface VideoPlayerReelSkinProps {
    children: ReactNode;
    renderPoster?: PosterImageProps["render"];
}

/**
 * VideoPlayer.ReelSkin
 *
 * @description
 * The shorts transport: a centred play overlay, a play toggle, a seek bar and the
 * elapsed time. Mute and volume live in the shorts' own overlay control, so the
 * packaged skin's volume, settings and fullscreen chrome is absent; Space and the
 * vertical arrows stay with the shorts' own keyboard navigation.
 */
export function VideoPlayerReelSkin({ children, renderPoster }: VideoPlayerReelSkinProps) {
    return (
        <Container
            data-theme="neutral"
            className="media-skin video-reel-skin relative size-full overflow-hidden outline-none"
        >
            {children}

            <Poster.Root className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 data-visible:opacity-100">
                <Poster.Image render={renderPoster} />
            </Poster.Root>

            <Gesture
                type="tap"
                action="togglePaused"
            />

            <PlayButton
                className="-translate-1/2 absolute top-1/2 left-1/2 z-20 grid size-16 place-items-center rounded-full bg-(--media-accent) text-(--media-accent-foreground) opacity-0 outline-none transition-opacity duration-200 not-data-paused:pointer-events-none focus-visible:ring-2 focus-visible:ring-(--media-ring) data-paused:opacity-100"
                render={(props) => (
                    <button
                        type="button"
                        {...props}
                    >
                        <PlayIcon className="size-7 translate-x-px fill-current" />
                    </button>
                )}
            />

            <Controls.Root>
                <Controls.Content className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-3 bg-linear-to-t from-black/70 to-transparent px-3 pt-8 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-(--media-controls-foreground) opacity-0 transition-opacity duration-200 data-visible:opacity-100">
                    <PlayButton
                        className="media-button place-items-center"
                        render={(props, state) => (
                            <button
                                type="button"
                                {...props}
                            >
                                {state.paused ? (
                                    <PlayIcon className="media-button-icon fill-current" />
                                ) : (
                                    <PauseIcon className="media-button-icon fill-current" />
                                )}
                            </button>
                        )}
                    />

                    <TimeSlider.Root className="group/slider relative flex h-5 grow cursor-pointer items-center">
                        <TimeSlider.Track className="relative h-(--media-spacing) w-full overflow-hidden rounded-full bg-[color-mix(in_oklab,currentcolor_20%,transparent)]">
                            <TimeSlider.Buffer className="absolute inset-y-0 left-0 w-(--media-slider-buffer,0%) bg-[color-mix(in_oklab,currentcolor_20%,transparent)]" />
                            <TimeSlider.Fill className="absolute inset-y-0 left-0 w-(--media-slider-fill,0%) bg-(--media-primary)" />
                        </TimeSlider.Track>
                        <TimeSlider.Thumb className="-translate-1/2 absolute top-1/2 left-(--media-slider-fill,0%) size-[calc(var(--media-spacing)*3)] rounded-(--media-control-radius) bg-white opacity-0 shadow-(--media-shadow-thumb) transition-opacity group-hover/slider:opacity-100 group-data-dragging/slider:opacity-100" />
                    </TimeSlider.Root>

                    <Time.Value
                        type="current"
                        className="shrink-0 text-xs tabular-nums"
                    />
                </Controls.Content>
            </Controls.Root>

            <Hotkey
                keys="ArrowLeft"
                action="seekStep"
                value={-5}
            />
            <Hotkey
                keys="ArrowRight"
                action="seekStep"
                value={5}
            />

            <StatusAnnouncer />

            <ErrorDialog.Root>
                <ErrorDialog.Popup className="-translate-1/2 absolute top-1/2 left-1/2 z-30 max-w-[80%] rounded-lg bg-black/80 p-4 text-center text-sm text-white">
                    <ErrorDialog.Title className="font-semibold" />
                    <ErrorDialog.Description className="mt-1 text-white/80" />
                </ErrorDialog.Popup>
            </ErrorDialog.Root>
        </Container>
    );
}
