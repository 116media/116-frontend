import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import type { EnumShareChannel } from "@/shared/infrastructure/api/generated/116.api";

/**
 * IArticleActivityEntity
 *
 * @description
 * One article the authenticated user has interacted with, carrying the article summary,
 * the timestamp of the last interaction, and how many times it occurred. Shared by the
 * liked and shared lists; `lastShareChannel` is only present for shares.
 *
 * @interface IArticleActivityEntity
 *
 * @property {IArticleSummaryEntity} article - The interacted-with article summary
 * @property {string} lastInteractedAt - ISO timestamp of the most recent interaction
 * @property {number} interactionCount - Number of interactions the caller recorded
 * @property {EnumShareChannel} [lastShareChannel] - Channel of the most recent share, for the shared list only
 */
export interface IArticleActivityEntity {
    lastInteractedAt: string;
    interactionCount: number;
    article: IArticleSummaryEntity;
    lastShareChannel?: EnumShareChannel;
}

/**
 * IArticleActivityPage
 *
 * @description
 * One page of the authenticated user's article activity plus the cursor needed to request
 * the next page. Backs both the liked and shared lists. `hasNextPage` is derived by the
 * mapper from the total `count`.
 *
 * @interface IArticleActivityPage
 *
 * @property {IArticleActivityEntity[]} items - The activity entries on this page
 * @property {number} pageIndex - Zero-based index of this page
 * @property {number} pageSize - Page size the server used
 * @property {number} count - Total activity entries across all pages
 * @property {boolean} hasNextPage - Whether a further page exists
 */
export interface IArticleActivityPage {
    count: number;
    pageSize: number;
    pageIndex: number;
    hasNextPage: boolean;
    items: IArticleActivityEntity[];
}
