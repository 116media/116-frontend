/**
 * Represents a tag associated with videos.
 *
 * @interface IVideoTagEntity
 *
 * @property {string} id - Unique identifier of the tag
 * @property {string} name - Display name of the tag
 * @property {string} slug - URL-safe slug for the tag
 * @property {number} [contentCount] - How many published videos carry the tag. Present on the
 * tag listings, absent where a tag travels inside another payload.
 */
export interface IVideoTagEntity {
    id: string;
    name: string;
    slug: string;
    contentCount?: number;
}
