"use client";

import { Controls, SeekButton } from "@videojs/react";

import { TrackNextIcon, TrackPreviousIcon } from "@/shared/presentation/components/ui/Icon";

import { MOBILE_CONTROL_TARGET } from "./mobileSkinVariants";

const SEEK_SECONDS = 10;

/**
 * VideoPlayer.MobileSeekRow
 *
 * @description
 * The two seeks, pinned level with the embed's own play button and pushed to either side
 * of it, so the three read as one row the embed happens to sit in the middle of.
 */
export function VideoPlayerMobileSeekRow() {
    return (
        <Controls.Group
            className="-translate-y-1/2 absolute inset-x-0 top-1/2 flex items-center justify-between px-18"
            aria-label="Lecture"
        >
            <SeekButton
                seconds={-SEEK_SECONDS}
                className={MOBILE_CONTROL_TARGET}
                render={(props) => (
                    <button {...props}>
                        <TrackPreviousIcon className="size-6 opacity-65" />
                    </button>
                )}
            />
            <SeekButton
                seconds={SEEK_SECONDS}
                className={MOBILE_CONTROL_TARGET}
                render={(props) => (
                    <button {...props}>
                        <TrackNextIcon className="size-6 opacity-65" />
                    </button>
                )}
            />
        </Controls.Group>
    );
}
