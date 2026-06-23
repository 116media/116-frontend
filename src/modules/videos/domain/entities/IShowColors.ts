/**
 * IShowColors
 *
 * @description
 * Poster-derived color pair used to theme a show card. Both values are plain
 * `#RRGGBB` hex strings produced by the backend at upload time: `background` is
 * the poster's dominant color and `foreground` is its WCAG-contrasting text
 * color (black or white). Ready to drop straight into inline styles. Embedded in
 * `IShowEntity` and resolved from `CategoryColorsDto`.
 *
 * @interface IShowColors
 *
 * @property {string} background - Dominant poster color, used as the card background/scrim
 * @property {string} foreground - Contrasting text color (black or white) for the background
 */
export interface IShowColors {
    background: string;
    foreground: string;
}
