"use client";

import { Controls, FullscreenButton, MuteButton, Time } from "@videojs/react";
import {
    FullscreenEnterIcon,
    FullscreenExitIcon,
    VolumeHighIcon,
    VolumeOffIcon
} from "@videojs/react/icons";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

import { MOBILE_CONTROL_TARGET } from "./mobileSkinVariants";

/**
 * Props for VideoPlayer.MobileStatusRow.
 *
 * @interface VideoPlayerMobileStatusRowProps
 * @property {boolean} isPinned - Whether the band is docked to the top of the viewport.
 */
export interface VideoPlayerMobileStatusRowProps {
    isPinned: boolean;
}

/**
 * VideoPlayer.MobileStatusRow
 *
 * @description
 * Elapsed and total time on one side, sound and fullscreen on the other. Shared by both
 * bands, which differ only in the padding the band around it already implies.
 */
export function VideoPlayerMobileStatusRow({ isPinned }: VideoPlayerMobileStatusRowProps) {
    return (
        <Controls.Group
            className={cn("flex items-center justify-between gap-2", isPinned && "px-3 pb-1")}
            aria-label="Progression"
        >
            <Time.Group
                className={cn(
                    "flex items-center gap-1 font-medium text-sm text-white tabular-nums",
                    !isPinned && "pl-1"
                )}
            >
                <Time.Value type="current" />
                <Time.Separator />
                <Time.Value
                    type="duration"
                    className="text-white/70"
                />
            </Time.Group>

            <div className="flex items-center gap-1">
                <MuteButton
                    className={MOBILE_CONTROL_TARGET}
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
                    className={cn(MOBILE_CONTROL_TARGET, "video-fullscreen-trigger")}
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
    );
}
