import type { IPlaylistDetailEntity } from "@/modules/videos/domain/entities/IPlaylistDetailEntity";
import type { IPlaylistVideoEntity } from "@/modules/videos/domain/entities/IPlaylistVideoEntity";
import type { IVideoActivityPage } from "@/modules/videos/domain/entities/IVideoActivityPage";
import { FAVORITES_VIDEOS_PAGE_SIZE } from "@/modules/videos/presentation/constants/videoKeys";
import { EnumShareChannel } from "@/shared/infrastructure/api/generated/116.api";

import { generateDummyVideoFeed } from "./video-feed.dummy";

/**
 * Fixed epoch the dummy favorites timestamps count back from (deterministic, SSR-safe).
 */
const DUMMY_BASE_MS = Date.parse("2026-06-01T09:00:00Z");

/**
 * One hour in milliseconds.
 */
const HOUR_MS = 3_600_000;

/**
 * Number of videos in one dummy playlist detail view.
 */
const PLAYLIST_SIZE = 5;

/**
 * Rotation pool of share channels for the dummy shared list.
 */
const SHARE_CHANNELS: string[] = [
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
 * dummyRatedVideoPage
 *
 * @description
 * A single dummy page of the authenticated user's rated videos as an `IVideoActivityPage`,
 * each carrying the caller's own star rating (`ratedStars`, cycled 1–5). Always the only
 * page (`hasNextPage: false`) so infinite scroll renders once and stops.
 *
 * @param pageIndex - Zero-based page index the query requested.
 * @returns The dummy rated-videos page.
 */
export function dummyRatedVideoPage(pageIndex: number): IVideoActivityPage {
    const { videos } = generateDummyVideoFeed();
    const items = videos.map((video, index) => ({
        video,
        lastInteractedAt: isoHoursFromBase(index),
        interactionCount: 1,
        ratedStars: 1 + (index % 5)
    }));
    return {
        items,
        pageIndex,
        pageSize: FAVORITES_VIDEOS_PAGE_SIZE,
        count: items.length,
        hasNextPage: false
    };
}

/**
 * dummySharedVideoPage
 *
 * @description
 * A single dummy page of the authenticated user's shared videos as an `IVideoActivityPage`,
 * each carrying a `lastShareChannel` and an `interactionCount` above one so the multi-share
 * and channel badges are exercised. Always the only page (`hasNextPage: false`).
 *
 * @param pageIndex - Zero-based page index the query requested.
 * @returns The dummy shared-videos page.
 */
export function dummySharedVideoPage(pageIndex: number): IVideoActivityPage {
    const { videos } = generateDummyVideoFeed();
    const items = videos.map((video, index) => ({
        video,
        lastInteractedAt: isoHoursFromBase(index),
        interactionCount: 2 + (index % 4),
        lastShareChannel: SHARE_CHANNELS[index % SHARE_CHANNELS.length]
    }));
    return {
        items,
        pageIndex,
        pageSize: FAVORITES_VIDEOS_PAGE_SIZE,
        count: items.length,
        hasNextPage: false
    };
}

/**
 * dummyPlaylistDetail
 *
 * @description
 * A dummy `IPlaylistDetailEntity` for the playlist detail view, wrapping the first few
 * shared feed videos as ordered playlist rows so the reorder and remove controls have
 * content to render. Deterministic; the requested id is preserved on the entity.
 *
 * @param id - The playlist id the detail view requested.
 * @returns The dummy playlist detail entity.
 */
export function dummyPlaylistDetail(id: string): IPlaylistDetailEntity {
    const { videos } = generateDummyVideoFeed();
    const playlistVideos: IPlaylistVideoEntity[] = videos
        .slice(0, PLAYLIST_SIZE)
        .map((video, index) => ({
            videoId: video.id,
            slug: video.slug,
            title: video.title,
            thumbnailUrl: video.thumbnailUrl,
            categoryName: video.categoryName,
            publishedAt: video.publishedAt,
            ratingAverage: video.ratingAverage,
            ratingCount: video.ratingCount,
            sortOrder: index
        }));
    return {
        id,
        name: "Late Night Drive",
        videos: playlistVideos
    };
}
