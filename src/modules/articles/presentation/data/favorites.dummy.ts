import type { IArticleActivityPage } from "@/modules/articles/domain/entities/IArticleActivityEntity";
import type { IArticleBookmarkPage } from "@/modules/articles/domain/entities/IArticleBookmarkEntity";
import type { ICommentedArticlePage } from "@/modules/articles/domain/entities/ICommentedArticleEntity";
import type { IMyArticleCommentsPage } from "@/modules/articles/domain/entities/IMyArticleCommentsPage";
import { FAVORITES_PAGE_SIZE } from "@/modules/articles/presentation/constants/articleKeys";
import { EnumShareChannel } from "@/shared/infrastructure/api/generated/116.api";

import { generateDummyComments } from "./article-detail.dummy";
import { generateDummyArticles } from "./articles.dummy";

/**
 * Fixed epoch the dummy favorites timestamps count back from (deterministic, SSR-safe).
 */
const DUMMY_BASE_MS = Date.parse("2026-06-01T09:00:00Z");

/**
 * One hour in milliseconds.
 */
const HOUR_MS = 3_600_000;

/**
 * Number of items every dummy favorites page carries.
 */
const FAVORITES_COUNT = 9;

/**
 * Number of comments the dummy per-article comments page carries.
 */
const MY_COMMENTS_COUNT = 6;

/**
 * Rotation pool of share channels for the dummy shared list.
 */
const SHARE_CHANNELS = [
    EnumShareChannel.WhatsApp,
    EnumShareChannel.Facebook,
    EnumShareChannel.X,
    EnumShareChannel.Clipboard,
    EnumShareChannel.WebShare
];

/**
 * isoHoursFromBase
 *
 * @description
 * Deterministic ISO timestamp for a dummy favorites entry: `DUMMY_BASE_MS` minus `index`
 * hours, so newer items sort first and the value never depends on the current time.
 *
 * @param index - The entry's position in the list.
 * @returns An ISO 8601 timestamp string.
 */
function isoHoursFromBase(index: number): string {
    return new Date(DUMMY_BASE_MS - index * HOUR_MS).toISOString();
}

/**
 * dummyArticleBookmarkPage
 *
 * @description
 * A single dummy page of the authenticated user's bookmarked articles, each wrapping a
 * shared feed article summary with a `bookmarkedAt` timestamp. Always the only page
 * (`hasNextPage: false`) so infinite scroll renders once and stops.
 *
 * @param pageIndex - Zero-based page index the query requested.
 * @returns The dummy bookmarks page.
 */
export function dummyArticleBookmarkPage(pageIndex: number): IArticleBookmarkPage {
    const articles = generateDummyArticles(FAVORITES_COUNT);
    const items = articles.map((article, index) => ({
        article,
        bookmarkedAt: isoHoursFromBase(index)
    }));
    return {
        items,
        pageIndex,
        pageSize: FAVORITES_PAGE_SIZE,
        count: items.length,
        hasNextPage: false
    };
}

/**
 * dummyCommentedArticlePage
 *
 * @description
 * A single dummy page of the articles the authenticated user has commented on, each
 * grouping a shared feed article summary with the caller's latest comment and a comment
 * count. Always the only page (`hasNextPage: false`).
 *
 * @param pageIndex - Zero-based page index the query requested.
 * @returns The dummy commented-articles page.
 */
export function dummyCommentedArticlePage(pageIndex: number): ICommentedArticlePage {
    const articles = generateDummyArticles(FAVORITES_COUNT);
    const comments = generateDummyComments(FAVORITES_COUNT);
    const items = articles.map((article, index) => ({
        article,
        latestComment: comments[index],
        commentCount: 1 + (index % 4),
        lastCommentedAt: isoHoursFromBase(index)
    }));
    return {
        items,
        pageIndex,
        pageSize: FAVORITES_PAGE_SIZE,
        count: items.length,
        hasNextPage: false
    };
}

/**
 * dummyLikedArticlePage
 *
 * @description
 * A single dummy page of the authenticated user's liked articles as an
 * `IArticleActivityPage`. Likes are single interactions (`interactionCount: 1`) and carry
 * no share channel. Always the only page (`hasNextPage: false`).
 *
 * @param pageIndex - Zero-based page index the query requested.
 * @returns The dummy liked-articles page.
 */
export function dummyLikedArticlePage(pageIndex: number): IArticleActivityPage {
    const articles = generateDummyArticles(FAVORITES_COUNT);
    const items = articles.map((article, index) => ({
        article,
        lastInteractedAt: isoHoursFromBase(index),
        interactionCount: 1
    }));
    return {
        items,
        pageIndex,
        pageSize: FAVORITES_PAGE_SIZE,
        count: items.length,
        hasNextPage: false
    };
}

/**
 * dummySharedArticlePage
 *
 * @description
 * A single dummy page of the authenticated user's shared articles as an
 * `IArticleActivityPage`. Each entry carries a `lastShareChannel` and an
 * `interactionCount` above one so the multi-share and channel badges are exercised.
 * Always the only page (`hasNextPage: false`).
 *
 * @param pageIndex - Zero-based page index the query requested.
 * @returns The dummy shared-articles page.
 */
export function dummySharedArticlePage(pageIndex: number): IArticleActivityPage {
    const articles = generateDummyArticles(FAVORITES_COUNT);
    const items = articles.map((article, index) => ({
        article,
        lastInteractedAt: isoHoursFromBase(index),
        interactionCount: 2 + (index % 4),
        lastShareChannel: SHARE_CHANNELS[index % SHARE_CHANNELS.length]
    }));
    return {
        items,
        pageIndex,
        pageSize: FAVORITES_PAGE_SIZE,
        count: items.length,
        hasNextPage: false
    };
}

/**
 * dummyMyArticleCommentsPage
 *
 * @description
 * A single dummy page of the authenticated user's own comments on one article, drawn from
 * the shared comment pool, newest first. Always the only page (`hasNextPage: false`).
 *
 * @param pageIndex - Zero-based page index the query requested.
 * @returns The dummy per-article own-comments page.
 */
export function dummyMyArticleCommentsPage(pageIndex: number): IMyArticleCommentsPage {
    const items = generateDummyComments(MY_COMMENTS_COUNT);
    return {
        items,
        pageIndex,
        pageSize: FAVORITES_PAGE_SIZE,
        count: items.length,
        hasNextPage: false
    };
}
