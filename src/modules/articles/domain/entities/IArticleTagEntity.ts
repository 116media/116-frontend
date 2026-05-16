/**
 * Represents a tag associated with articles.
 *
 * @interface IArticleTagEntity
 *
 * @property {string} id - Unique identifier of the tag
 * @property {string} name - Display name of the tag
 * @property {string} slug - URL-safe slug for the tag
 */
export interface IArticleTagEntity {
    id: string;
    name: string;
    slug: string;
}
