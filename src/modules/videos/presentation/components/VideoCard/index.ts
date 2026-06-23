import { Horizontal } from "./VideoCard.Horizontal";
import { Vertical } from "./VideoCard.Vertical";

/**
 * VideoCard
 *
 * @description
 * Compound component for video (episode) cards. Each variant renders a single
 * video in a different layout so the same data can be presented across surfaces.
 *
 * - VideoCard.Horizontal — full-width bordered row with a landscape thumbnail,
 *   play overlay, episode number badge, title, rating, date, and share count.
 * - VideoCard.Vertical — poster-style card with a 16:9 thumbnail on top (hover
 *   play overlay + image zoom) and the title, date, share count, and rating
 *   below. Sized for a responsive grid feed section.
 *
 * Additional variants (e.g. grid, featured) can be added here as the exclusive
 * section and other video surfaces grow.
 */
export const VideoCard = { Horizontal, Vertical } as const;
