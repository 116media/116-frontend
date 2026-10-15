import type { IVideoCategoryEntity } from "@/modules/videos/domain/entities/IVideoCategoryEntity";
import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";

/**
 * IVideoFeedEntity
 *
 * @description
 * One entry of the homepage video feed: a category pinned to the feed and its
 * latest published videos. The API omits pinned categories with no published
 * videos, so an entry always carries at least one video.
 *
 * @interface IVideoFeedEntity
 *
 * @property {IVideoCategoryEntity} category - The pinned category the entry renders
 * @property {IVideoSummaryEntity[]} videos - Its latest published videos
 */
export interface IVideoFeedEntity {
    category: IVideoCategoryEntity;
    videos: IVideoSummaryEntity[];
}
