/**
 * Represents a tag associated with videos.
 *
 * @interface IVideoTagEntity
 *
 * @property {string} id - Unique identifier of the tag
 * @property {string} name - Display name of the tag
 * @property {string} slug - URL-safe slug for the tag
 */
export interface IVideoTagEntity {
    id: string;
    name: string;
    slug: string;
}
