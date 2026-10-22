"use client";

import { TimeSlider } from "@videojs/react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

import { MOBILE_SCRUBBER_HEIGHT } from "./mobileSkinVariants";

/**
 * Props for VideoPlayer.MobileScrubber.
 *
 * @interface VideoPlayerMobileScrubberProps
 * @property {boolean} isPinned - Whether the band is docked to the top of the viewport.
 */
export interface VideoPlayerMobileScrubberProps {
    isPinned: boolean;
}

/**
 * VideoPlayer.MobileScrubber
 *
 * @description
 * The scrub line. Its parts are positioned from the percentages the slider publishes,
 * which is the contract for building one out of the primitives; the classes that read
 * them live in the skin's stylesheet.
 */
export function VideoPlayerMobileScrubber({ isPinned }: VideoPlayerMobileScrubberProps) {
    return (
        <TimeSlider.Root
            className={cn(
                "mobile-skin-slider group/slider relative flex w-full touch-none items-center",
                isPinned ? MOBILE_SCRUBBER_HEIGHT.pinned : MOBILE_SCRUBBER_HEIGHT.inline
            )}
        >
            <TimeSlider.Track
                className={cn(
                    "relative h-1 w-full overflow-hidden bg-white/30",
                    !isPinned && "rounded-full"
                )}
            >
                <TimeSlider.Buffer className="mobile-skin-buffer absolute inset-y-0 left-0 bg-white/40" />
                <TimeSlider.Fill className="mobile-skin-fill absolute inset-y-0 left-0 bg-primary dark:bg-secondary" />
            </TimeSlider.Track>
            <TimeSlider.Thumb className="mobile-skin-thumb size-3 rounded-full bg-primary transition-transform group-active/slider:scale-150 dark:bg-secondary" />
        </TimeSlider.Root>
    );
}
