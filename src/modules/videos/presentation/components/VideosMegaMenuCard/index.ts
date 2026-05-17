import { Compact } from "./VideosMegaMenuCard.Compact";
import { FeaturedFullBleed } from "./VideosMegaMenuCard.FeaturedFullBleed";
import { FeaturedSpotlight } from "./VideosMegaMenuCard.FeaturedSpotlight";

/**
 * VideosMegaMenuCard
 *
 * @description
 * Compound component for video cards in the mega menu "À la une" column.
 * Three variants are available:
 *
 * - VideosMegaMenuCard.FeaturedFullBleed  — immersive full-bleed card, black
 *   background with cover image, frosted play button, star rating + share
 *   count + "Watch Now" CTA at the bottom. Used for the first spotlight slot.
 * - VideosMegaMenuCard.FeaturedSpotlight — purple-to-blue gradient card,
 *   widescreen preview banner with frosted play button, star rating + share
 *   count, purple ghost "Watch Now" button. Used for the second spotlight slot.
 * - VideosMegaMenuCard.Compact           — cinematic widescreen card, 21/9
 *   aspect-ratio thumbnail, spinning glowing border on hover, frosted play
 *   button, bottom gradient strip with title + date + stars + share count.
 */
export const VideosMegaMenuCard = { FeaturedFullBleed, FeaturedSpotlight, Compact };
