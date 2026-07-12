import { Horizontal } from "./ShowCard.Horizontal";
import { Poster } from "./ShowCard.Poster";

/**
 * ShowCard
 *
 * @description
 * Compound component for show (video category) cards: `.Poster` (full-bleed
 * MD3 carousel slot) and `.Horizontal` (themed row card for list surfaces).
 * Each variant renders one show in a different layout; members are documented
 * at their own files.
 */
export const ShowCard = { Horizontal, Poster } as const;
