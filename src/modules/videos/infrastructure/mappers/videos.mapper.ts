import type { IVideoCategoryEntity } from "@/modules/videos/domain/entities/IVideoCategoryEntity";
import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";
import type { IVideoTagEntity } from "@/modules/videos/domain/entities/IVideoTagEntity";
import type {
    CategoryDto,
    TagDto,
    VideoSummaryDto
} from "@/shared/infrastructure/api/generated/116.api";

/**
 * Mapper for converting API DTOs to domain entities in the videos module.
 *
 * @description
 * Provides pure transformation functions to map data transfer objects (DTOs)
 * from the API layer to clean domain entities.
 *
 * @remarks
 * - All methods are stateless pure functions
 * - Marked as const to prevent accidental mutation
 * - Part of the infrastructure layer
 */
export const VideosMapper = {
    /**
     * Maps VideoSummaryDto to IVideoSummaryEntity domain entity.
     * Drops audit fields, authorId, status, hasLyrics, and
     * shootingScheduledAt which are not needed on the public mega menu display.
     *
     * @param {VideoSummaryDto} dto - Video summary data from API
     * @returns {IVideoSummaryEntity} Mapped video summary entity
     */
    videoSummaryFromDto(dto: VideoSummaryDto): IVideoSummaryEntity {
        return {
            id: dto.id,
            categoryId: dto.categoryId,
            categoryName: dto.categoryName,
            title: dto.title,
            slug: dto.slug,
            thumbnailUrl: dto.thumbnailUrl ?? null,
            youtubeVideoUrl: dto.youtubeVideoUrl ?? null,
            isPromoted: dto.isPromoted,
            publishedAt: dto.publishedAt ?? null,
            shareCount: dto.shareCount ?? 0,
            ratingAverage: dto.ratingAverage ?? 0,
            ratingCount: dto.ratingCount ?? 0
        };
    },

    /**
     * Maps CategoryDto to IVideoCategoryEntity domain entity.
     * Drops contentTypeId and contentTypeName because by the time this
     * mapper runs the category list is already scoped to Video.
     *
     * @param {CategoryDto} dto - Category data from API
     * @returns {IVideoCategoryEntity} Mapped video category entity
     */
    categoryFromDto(dto: CategoryDto): IVideoCategoryEntity {
        return {
            id: dto.id,
            name: dto.name,
            slug: dto.slug,
            description: dto.description,
            isFree: dto.isFree
        };
    },

    /**
     * Maps TagDto to IVideoTagEntity domain entity.
     *
     * @param {TagDto} dto - Tag data from API
     * @returns {IVideoTagEntity} Mapped video tag entity
     */
    tagFromDto(dto: TagDto): IVideoTagEntity {
        return {
            id: dto.id,
            name: dto.name,
            slug: dto.slug
        };
    }
} as const;
