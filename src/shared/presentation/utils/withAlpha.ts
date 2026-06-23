/**
 * Appends an 8-bit alpha channel to a `#RRGGBB` hex color, yielding `#RRGGBBAA`,
 * so a solid color can be reused at partial opacity (e.g. scrim gradients or
 * muted text) without converting to `rgba()`.
 *
 * @param hex - A `#RRGGBB` color
 * @param alpha - Opacity in the `[0, 1]` range
 * @returns The `#RRGGBBAA` color string
 */
export function withAlpha(hex: string, alpha: number): string {
    const channel = Math.round(alpha * 255)
        .toString(16)
        .padStart(2, "0");
    return `${hex}${channel}`;
}
