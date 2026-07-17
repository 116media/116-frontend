import type { IVideoActivityEntity } from "@/modules/videos/domain/entities/IVideoActivityEntity";

/**
 * IVideoActivityPage
 *
 * @description
 * One page of the signed-in user's video-activity feed (rated or shared) plus the
 * cursor needed to request the next page. `hasNextPage` is derived by the mapper
 * from the total `count`.
 *
 * @interface IVideoActivityPage
 *
 * @property {IVideoActivityEntity[]} items - The activity entries on this page
 * @property {number} pageIndex - Zero-based index of this page
 * @property {number} pageSize - Page size the server used
 * @property {number} count - Total entries across all pages
 * @property {boolean} hasNextPage - Whether a further page exists
 */
export interface IVideoActivityPage {
    items: IVideoActivityEntity[];
    pageIndex: number;
    pageSize: number;
    count: number;
    hasNextPage: boolean;
}
