import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";
import type { IShortVideoFeedPage } from "@/modules/shorts/domain/entities/IShortVideoFeedPage";
import type { Result } from "@/shared/domain/results/result";

/**
 * IShortsFeedQuery
 *
 * @description
 * Cursor paging for the seeded "for you" shorts feed. Omit the cursor to start a
 * fresh randomized session; pass the previous page's cursor to continue it.
 *
 * @interface IShortsFeedQuery
 * @property {string} [cursor] - Opaque cursor from the previous page, or undefined for a fresh session.
 * @property {number} pageSize - Page size.
 */
export interface IShortsFeedQuery {
    cursor?: string;
    pageSize: number;
}

/**
 * IShareShortInput
 *
 * @description
 * A share event to record against a short.
 *
 * @interface IShareShortInput
 * @property {string} shortId - The short being shared.
 * @property {string} [shareChannel] - Optional channel identifier (facebook/x/whatsapp/clipboard).
 */
export interface IShareShortInput {
    shortId: string;
    shareChannel?: string;
}

/**
 * IShortsRepositoryPort
 *
 * @description
 * Data access for public short videos. Every method returns `Result<T>` and never
 * throws; interaction methods resolve the backend `isSuccess` flag.
 */
export interface IShortsRepositoryPort {
    getShortsFeed(query: IShortsFeedQuery): Promise<Result<IShortVideoFeedPage>>;
    getShortBySlug(slug: string): Promise<Result<IShortVideoEntity>>;
    likeShort(shortId: string): Promise<Result<boolean>>;
    unlikeShort(shortId: string): Promise<Result<boolean>>;
    bookmarkShort(shortId: string): Promise<Result<boolean>>;
    unbookmarkShort(shortId: string): Promise<Result<boolean>>;
    shareShort(input: IShareShortInput): Promise<Result<boolean>>;
    recordShortView(shortId: string): Promise<Result<boolean>>;
}
