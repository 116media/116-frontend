"use client";

import { useExclusiveShow } from "@/modules/videos/presentation/context/ExclusiveShowProvider";
import { withAlpha } from "@/shared/presentation/utils/color/color.utils";

/**
 * Props for the VideoExclusiveShowScrim component.
 *
 * @interface VideoExclusiveShowScrimProps
 * @property {"right" | "top" | "panel"} direction - "right" darkens the hero text
 * side, "top" grounds the hero episodes rail, "panel" is the split poster's
 * solid-to-transparent bottom fade.
 */
export interface VideoExclusiveShowScrimProps {
    direction: "right" | "top" | "panel";
}

/**
 * scrimGradient
 *
 * @description
 * Builds the CSS gradient for a scrim direction from the show's background color.
 *
 * @param direction - The scrim direction.
 * @param background - The show's poster-derived background color.
 * @returns The `linear-gradient(...)` value.
 */
function scrimGradient(direction: VideoExclusiveShowScrimProps["direction"], background: string) {
    if (direction === "right") {
        return `linear-gradient(to right, ${withAlpha(background, 0.96)} 0%, ${withAlpha(background, 0.72)} 45%, ${withAlpha(background, 0)} 100%)`;
    }

    if (direction === "top") {
        return `linear-gradient(to top, ${withAlpha(background, 0.96)} 0%, ${withAlpha(background, 0.72)} 45%)`;
    }

    return `linear-gradient(to top, ${background} 0%, ${background} 45%, ${withAlpha(background, 0)} 100%)`;
}

/**
 * VideoExclusiveShowScrim
 *
 * @description
 * Full-cover gradient overlay themed from the show's poster-derived background
 * color, keeping the section text readable over the poster.
 */
export function VideoExclusiveShowScrim({ direction }: VideoExclusiveShowScrimProps) {
    const { background } = useExclusiveShow();

    return (
        <div
            className="absolute inset-0"
            style={{ backgroundImage: scrimGradient(direction, background) }}
        />
    );
}
