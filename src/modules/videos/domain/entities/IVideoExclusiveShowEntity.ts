import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";

/**
 * IVideoExclusiveShowEntity
 *
 * @description
 * Domain entity for the homepage "exclusive show" — the single category flagged
 * as exclusive together with its episodes. Maps from the public
 * exclusive-category response, exposing the category's videos as episodes.
 *
 * @interface IVideoExclusiveShowEntity
 *
 * @property {string} id - Category (show) unique identifier (UUID)
 * @property {string} title - Show display title (the category name)
 * @property {string} slug - URL-safe slug of the show
 * @property {string} description - Show description shown beside the poster
 * @property {string | null} posterUrl - Landscape poster image URL, or null if unset
 * @property {IVideoSummaryEntity[]} episodes - The show's episodes for the current page
 */
export interface IVideoExclusiveShowEntity {
    id: string;
    title: string;
    slug: string;
    description: string;
    posterUrl: string | null;
    episodes: IVideoSummaryEntity[];
}
