import { Caption } from "./ShowCard.Caption";
import { Horizontal } from "./ShowCard.Horizontal";
import { Poster } from "./ShowCard.Poster";
import { Vertical } from "./ShowCard.Vertical";

/**
 * ShowCard
 *
 * @description
 * Compound component for show (video category) cards: `.Poster` (poster image
 * with scrim), `.Caption` (title/description/CTA overlay), `.Vertical` (linked
 * grid tile for the shows page), and `.Horizontal` (themed row card).
 * Each variant renders one show in a different layout; members are documented
 * at their own files.
 */
export const ShowCard = { Caption, Horizontal, Poster, Vertical } as const;
