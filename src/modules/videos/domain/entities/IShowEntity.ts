import type { IShowColors } from "@/modules/videos/domain/entities/IShowColors";

/**
 * IShowEntity
 *
 * @description
 * Domain entity for a "show" — a video category surfaced in the homepage shows
 * carousel and the shows page. Maps from `CategoryDto` (video content type),
 * keeping only what the show card needs.
 *
 * @interface IShowEntity
 *
 * @property {string} id - Unique identifier (UUID)
 * @property {string} name - Show (category) display name
 * @property {string} slug - URL-safe slug
 * @property {string} description - Short description shown on the card (clamped to 2 lines)
 * @property {string | null} posterUrl - Resolved poster URL covering the card, or null when unset
 * @property {IShowColors | null} colors - Poster-derived background/foreground pair, or null when no poster/color
 */
export interface IShowEntity {
    id: string;
    name: string;
    slug: string;
    description: string;
    posterUrl: string | null;
    colors: IShowColors | null;
}
