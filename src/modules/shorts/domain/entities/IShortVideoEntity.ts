/**
 * IShortVideoAuthor
 *
 * @description
 * Minimal author projection for a short's byline, owned by the shorts context so
 * the module stays decoupled from other features' domain entities.
 *
 * @interface IShortVideoAuthor
 *
 * @property {string} userName - Author display name.
 * @property {string | null} avatarUrl - Author avatar URL, or null.
 * @property {string} [role] - Author role/title shown as the byline subtitle, when resolved.
 */
export interface IShortVideoAuthor {
    userName: string;
    avatarUrl: string | null;
    role?: string;
}

/**
 * IShortVideoEntity
 *
 * @description
 * A short video as the public frontend consumes it. `videoUrl` is a direct
 * Cloudinary file URL (not YouTube). `isLiked` / `isBookmarked` are the caller's
 * per-viewer flags, seeded false for anonymous readers.
 *
 * @interface IShortVideoEntity
 *
 * @property {string} id - Short UUID; the interaction routes key off this.
 * @property {string} title - Display title / caption.
 * @property {string} slug - Public permalink slug.
 * @property {string | null} videoUrl - Cloudinary file URL, or null while unresolved.
 * @property {string | null} thumbnailUrl - Poster URL, or null.
 * @property {boolean} hasFullVideo - Whether a parent full video exists.
 * @property {string | null} videoSlug - The parent full video's slug for the deep link, or null.
 * @property {number} viewCount - Cached view count.
 * @property {number} likeCount - Cached like count baseline.
 * @property {number} shareCount - Cached share count baseline.
 * @property {number} bookmarkCount - Cached bookmark count baseline.
 * @property {IShortVideoAuthor} [author] - Uploading editor's byline projection, when resolved.
 * @property {boolean} isLiked - Whether the caller has liked this short.
 * @property {boolean} isBookmarked - Whether the caller has bookmarked this short.
 */
export interface IShortVideoEntity {
    id: string;
    title: string;
    slug: string;
    videoUrl: string | null;
    thumbnailUrl: string | null;
    hasFullVideo: boolean;
    videoSlug: string | null;
    viewCount: number;
    likeCount: number;
    shareCount: number;
    bookmarkCount: number;
    author?: IShortVideoAuthor;
    isLiked: boolean;
    isBookmarked: boolean;
}
