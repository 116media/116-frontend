import { Hero } from "./ArticlePromotionCard.Hero";
import { Pair } from "./ArticlePromotionCard.Pair";
import { Side } from "./ArticlePromotionCard.Side";
import { Strip } from "./ArticlePromotionCard.Strip";

/**
 * ArticlePromotionCard
 *
 * @description
 * Compound component for article cards in the homepage promotion grid.
 *
 * - ArticlePromotionCard.Hero  — Spot 1: cinematic full-width card with dual
 *   gradient overlay, pulse-dot category badge, engagement stats, hover eye icon.
 * - ArticlePromotionCard.Side  — Spot 2: spotlight card with separate image area,
 *   category Badge, calendar date, headline, and like/comment/bookmark stats.
 * - ArticlePromotionCard.Pair  — Spot 3: magazine-style card with serif headline,
 *   "116 MAGAZINE" header bar, BadgeCheck category, optional "COVER STORY" label.
 * - ArticlePromotionCard.Strip — Gossip strip: compact horizontal card with
 *   numbered thumbnail badge, title, and published date.
 */
export const ArticlePromotionCard = { Hero, Side, Pair, Strip };
