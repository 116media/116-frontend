import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";

/**
 * IVideoPage
 *
 * @description
 * One page of the published-videos feed plus the cursor needed to request the
 * next page. `hasNextPage` is derived by the mapper from the total `count`.
 *
 * @interface IVideoPage
 *
 * @property {IVideoSummaryEntity[]} items - The videos on this page
 * @property {number} pageIndex - Zero-based index of this page
 * @property {number} pageSize - Page size the server used
 * @property {number} count - Total videos across all pages
 * @property {boolean} hasNextPage - Whether a further page exists
 */
export interface IVideoPage {
    items: IVideoSummaryEntity[];
    pageIndex: number;
    pageSize: number;
    count: number;
    hasNextPage: boolean;
}
