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
