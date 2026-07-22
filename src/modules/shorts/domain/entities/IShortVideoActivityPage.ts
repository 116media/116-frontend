import type { IShortVideoActivityEntity } from "@/modules/shorts/domain/entities/IShortVideoActivityEntity";

/**
 * IShortVideoActivityPage
 *
 * @description
 * One page of a short-video favorites list (liked, saved, or shared) plus the
 * paging metadata. `hasNextPage` is derived by the mapper from the total `count`.
 *
 * @interface IShortVideoActivityPage
 *
 * @property {IShortVideoActivityEntity[]} items - The activities on this page.
 * @property {number} pageIndex - Zero-based index of this page.
 * @property {number} pageSize - Page size the server used.
 * @property {number} count - Total activities across all pages.
 * @property {boolean} hasNextPage - Whether a further page exists.
 */
export interface IShortVideoActivityPage {
    items: IShortVideoActivityEntity[];
    pageIndex: number;
    pageSize: number;
    count: number;
    hasNextPage: boolean;
}
