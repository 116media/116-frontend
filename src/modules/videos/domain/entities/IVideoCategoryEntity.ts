/**
 * IVideoCategoryEntity
 *
 * @description
 * Domain entity representing a category scoped to videos.
 * Maps from CategoryDto — drops contentTypeId and contentTypeName because
 * at this layer the content type is already resolved and implicit.
 *
 * @interface IVideoCategoryEntity
 *
 * @property {string} id - Unique identifier (UUID)
 * @property {string} name - Display name of the category
 * @property {string} slug - URL-safe slug
 * @property {string} description - Human-readable description
 * @property {boolean} isFree - Whether access to this category requires no subscription
 */
export interface IVideoCategoryEntity {
    id: string;
    name: string;
    slug: string;
    description: string;
    isFree: boolean;
}
