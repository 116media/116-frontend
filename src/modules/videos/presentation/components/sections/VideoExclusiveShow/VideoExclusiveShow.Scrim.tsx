"use client";

import { useExclusiveShow } from "@/modules/videos/presentation/context/ExclusiveShowProvider";
import { scrimGradient } from "@/modules/videos/presentation/utils/scrim/scrim.utils";

/**
 * Props for the VideoExclusiveShowScrim component.
 *
 * @interface VideoExclusiveShowScrimProps
 * @property {"right" | "top" | "panel"} direction - "right" darkens the hero text
 * side, "top" grounds the hero episodes rail, "panel" is the split poster's bottom fade,
 * which keeps the upper artwork visible.
 */
export interface VideoExclusiveShowScrimProps {
    direction: "right" | "top" | "panel";
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
