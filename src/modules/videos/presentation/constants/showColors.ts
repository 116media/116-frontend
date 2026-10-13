import type { IShowColors } from "@/modules/videos/domain/entities/IShowColors";

/**
 * Neutral fallback palette used when a show has no poster-derived colors
 * (no poster yet, or extraction returned nothing): a near-black background
 * with white text. Shared by every show-themed surface so fallbacks render
 * identically everywhere.
 */
export const SHOW_FALLBACK_COLORS: IShowColors = {
    background: "#0A0A0A",
    foreground: "#FFFFFF"
};

/**
 * The ground every exclusive-show panel is washed with. The poster's own colors drive the
 * artwork, not the chrome, so each card keeps one consistent background.
 */
export const SHOW_PANEL_GROUND = "var(--primitive-neutral-950)";

/**
 * How much of a show's own color survives in its panel ground. Enough to tell two shows
 * apart, little enough that a saturated poster never becomes the panel.
 */
const GROUND_TINT = "15%";

/**
 * Mixes a show's poster color into the shared ground, so every exclusive panel is dark
 * whatever the artwork is and its text can stay light.
 *
 * @param color - The show's poster-derived background color.
 * @returns The CSS color for that show's panel ground.
 */
export function showPanelGround(color: string): string {
    return `color-mix(in srgb, ${color} ${GROUND_TINT}, ${SHOW_PANEL_GROUND})`;
}

/**
 * Flat ground behind the episodes column. It takes no tint from the show, so the list
 * reads the same on every card whatever the poster is.
 */
export const SHOW_EPISODES_GROUND = "var(--primitive-neutral-900)";
