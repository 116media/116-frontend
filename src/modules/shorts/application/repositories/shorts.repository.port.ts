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
    /**
     * Fetches one cursor page of the seeded "for you" feed.
     *
     * @param query - Cursor + page size.
     * @returns `ok(IShortVideoFeedPage)` on success, `err(Failure)` on failure.
     */
    getShortsFeed(query: IShortsFeedQuery): Promise<Result<IShortVideoFeedPage>>;

    /**
     * Fetches one active short by its slug.
     *
     * @param slug - The short's slug.
     * @returns `ok(IShortVideoEntity)` on success, `err(Failure)` on failure.
     */
    getShortBySlug(slug: string): Promise<Result<IShortVideoEntity>>;

    /**
     * Records the signed-in user's like on a short.
     *
     * @param shortId - The short to like.
     * @returns `ok(boolean)` success flag on success, `err(Failure)` on failure.
     */
    likeShort(shortId: string): Promise<Result<boolean>>;

    /**
     * Removes the signed-in user's like from a short.
     *
     * @param shortId - The short to unlike.
     * @returns `ok(boolean)` success flag on success, `err(Failure)` on failure.
     */
    unlikeShort(shortId: string): Promise<Result<boolean>>;

    /**
     * Records the signed-in user's bookmark on a short.
     *
     * @param shortId - The short to bookmark.
     * @returns `ok(boolean)` success flag on success, `err(Failure)` on failure.
     */
    bookmarkShort(shortId: string): Promise<Result<boolean>>;

    /**
     * Removes the signed-in user's bookmark from a short.
     *
     * @param shortId - The short to unbookmark.
     * @returns `ok(boolean)` success flag on success, `err(Failure)` on failure.
     */
    unbookmarkShort(shortId: string): Promise<Result<boolean>>;

    /**
     * Records a share event against a short (anonymous access allowed).
     *
     * @param input - The short id and optional channel.
     * @returns `ok(boolean)` success flag on success, `err(Failure)` on failure.
     */
    shareShort(input: IShareShortInput): Promise<Result<boolean>>;

    /**
     * Records a view event against a short (engagement-gated by the caller).
     *
     * @param shortId - The short viewed.
     * @returns `ok(boolean)` success flag on success, `err(Failure)` on failure.
     */
    recordShortView(shortId: string): Promise<Result<boolean>>;
}
