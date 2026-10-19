import { fade } from "@/shared/presentation/utils/color/color.utils";

/**
 * Which edge a scrim darkens.
 */
export type ScrimDirection = "right" | "top" | "panel";

/**
 * scrimGradient
 *
 * @description
 * Builds the CSS gradient for a scrim direction from the show's background color.
 *
 * @param direction - The scrim direction.
 * @param background - The show's poster-derived background color.
 * @returns {string} The `linear-gradient(...)` value.
 */
export function scrimGradient(direction: ScrimDirection, background: string): string {
    if (direction === "right") {
        return `linear-gradient(to right, ${fade(background, 0.96)} 0%, ${fade(background, 0.72)} 45%, ${fade(background, 0)} 100%)`;
    }

    if (direction === "top") {
        return `linear-gradient(to top, ${fade(background, 0.96)} 0%, ${fade(background, 0.72)} 45%)`;
    }

    return `linear-gradient(to top, ${background} 0%, ${fade(background, 0.95)} 28%, ${fade(background, 0.6)} 65%, ${fade(background, 0)} 100%)`;
}
