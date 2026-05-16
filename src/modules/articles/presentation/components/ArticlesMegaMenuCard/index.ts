import { Compact } from "./ArticlesMegaMenuCard.Compact";
import { FeaturedGradient } from "./ArticlesMegaMenuCard.FeaturedGradient";
import { FeaturedOverlay } from "./ArticlesMegaMenuCard.FeaturedOverlay";

/**
 * ArticlesMegaMenuCard
 *
 * @description
 * Compound component for article cards in the mega menu "À la une" column.
 * Shared composer pieces: ArticlesMegaMenuCardImage, ArticlesMegaMenuCardBody,
 * ArticlesMegaMenuCardStats.
 *
 * - ArticlesMegaMenuCard.FeaturedOverlay  — first spotlight card: full-height
 *   cover image with deep gradient, all content overlaid at the bottom
 *   (category, title, headline, like/comment/share stats). "Modern Image
 *   Overlay" reference style.
 * - ArticlesMegaMenuCard.FeaturedGradient — second spotlight card: purple-to-
 *   blue gradient background, content inside (header, title, headline, image
 *   in the middle, like/comment/bookmark footer). "Gradient Background Card"
 *   reference style.
 * - ArticlesMegaMenuCard.Compact         — horizontal surface card for the
 *   bottom two articles (category, date, title, headline, stats, image).
 */
export const ArticlesMegaMenuCard = { FeaturedOverlay, FeaturedGradient, Compact };
