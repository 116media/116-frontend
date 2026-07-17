import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";

/**
 * IShortVideoFeedPage
 *
 * @description
 * One cursor-paginated page of the seeded "for you" shorts feed. `nextCursor`
 * carries the seed and keyset for the following page; a null cursor means the
 * feed is exhausted.
 *
 * @interface IShortVideoFeedPage
 *
 * @property {IShortVideoEntity[]} items - The shorts on this page.
 * @property {string | null} nextCursor - Opaque cursor for the next page, or null at the end.
 */
export interface IShortVideoFeedPage {
    items: IShortVideoEntity[];
    nextCursor: string | null;
}
