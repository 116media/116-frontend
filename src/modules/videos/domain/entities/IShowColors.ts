/**
 * IShowColors
 *
 * @description
 * Poster-derived color pair used to theme a show card, resolved from
 * `CategoryColorsDto`. Both values are backend-produced `#RRGGBB` hex strings
 * (dominant poster color plus its WCAG-contrasting text color).
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
