import type { IPlaylistEntity } from "@/modules/videos/domain/entities/IPlaylistEntity";
import type { IShowEntity } from "@/modules/videos/domain/entities/IShowEntity";
import type { IVideoCategoryEntity } from "@/modules/videos/domain/entities/IVideoCategoryEntity";
import type { IVideoDetailEntity } from "@/modules/videos/domain/entities/IVideoDetailEntity";
import type { IVideoExclusiveShowEntity } from "@/modules/videos/domain/entities/IVideoExclusiveShowEntity";
import type { IVideoLyricsEntity } from "@/modules/videos/domain/entities/IVideoLyricsEntity";
import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";
import type { IVideoTagEntity } from "@/modules/videos/domain/entities/IVideoTagEntity";
import type { IYoutubeVideoStats } from "@/modules/videos/domain/entities/IYoutubeVideoStats";
import type {
    CategoryDto,
    LyricsDto,
    PlaylistDto,
    PublicGetExclusiveCategoryResponse,
    TagDto,
    VideoDetailDto,
    VideoSummaryDto
} from "@/shared/infrastructure/api/generated/116.api";

/**
 * Mapper for converting API DTOs to domain entities in the videos module.
 *
 * @description
 * Stateless pure transformation functions mapping API-layer DTOs to clean
 * domain entities; part of the infrastructure layer.
 */
export const VideosMapper = {
    /**
     * Maps VideoSummaryDto to IVideoSummaryEntity domain entity.
     * Drops audit fields, authorId, status, hasLyrics, and
     * shootingScheduledAt which are not needed on the public mega menu display.
     *
     * @param dto - Video summary data from API
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
     * Maps a list of VideoSummaryDto to IVideoSummaryEntity domain entities.
     *
     * @param dtos - Video summary data list from API
     * @returns {IVideoSummaryEntity[]} Mapped video summary entities
     */
    videoSummaryListFromDto(dtos: VideoSummaryDto[]): IVideoSummaryEntity[] {
        return dtos.map(VideosMapper.videoSummaryFromDto);
    },

    /**
     * Maps CategoryDto to IVideoCategoryEntity domain entity.
     * Drops contentTypeId and contentTypeName because by the time this
     * mapper runs the category list is already scoped to Video.
     *
     * @param dto - Category data from API
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
     * Maps a list of CategoryDto to IVideoCategoryEntity domain entities.
     *
     * @param dtos - Category data list from API
     * @returns {IVideoCategoryEntity[]} Mapped video category entities
     */
    categoryListFromDto(dtos: CategoryDto[]): IVideoCategoryEntity[] {
        return dtos.map(VideosMapper.categoryFromDto);
    },

    /**
     * Maps CategoryDto to IShowEntity domain entity for the shows carousel.
     * Keeps the poster artwork and description (unlike categoryFromDto) and
     * drops the content-type fields since the list is already scoped to Video.
     *
     * @param dto - Category data from API
     * @returns {IShowEntity} Mapped show entity
     */
    showFromDto(dto: CategoryDto): IShowEntity {
        return {
            id: dto.id,
            name: dto.name,
            slug: dto.slug,
            description: dto.description,
            posterUrl: dto.posterUrl ?? null,
            colors: dto.colors
                ? { background: dto.colors.background, foreground: dto.colors.foreground }
                : null
        };
    },

    /**
     * Maps a list of CategoryDto to IShowEntity domain entities for the shows carousel.
     *
     * @param dtos - Category data list from API
     * @returns {IShowEntity[]} Mapped show entities
     */
    showListFromDto(dtos: CategoryDto[]): IShowEntity[] {
        return dtos.map(VideosMapper.showFromDto);
    },

    /**
     * Maps TagDto to IVideoTagEntity domain entity.
     *
     * @param dto - Tag data from API
     * @returns {IVideoTagEntity} Mapped video tag entity
     */
    tagFromDto(dto: TagDto): IVideoTagEntity {
        return {
            id: dto.id,
            name: dto.name,
            slug: dto.slug
        };
    },

    /**
     * Maps a list of TagDto to IVideoTagEntity domain entities.
     *
     * @param dtos - Tag data list from API
     * @returns {IVideoTagEntity[]} Mapped video tag entities
     */
    tagListFromDto(dtos: TagDto[]): IVideoTagEntity[] {
        return dtos.map(VideosMapper.tagFromDto);
    },

    /**
     * Maps the public exclusive-category response to IVideoExclusiveShowEntity.
     * Flattens the category into the show's presentational fields and maps the
     * paginated videos into episodes, carrying the total count for the header.
     *
     * @param dto - Exclusive show payload from API
     * @returns {IVideoExclusiveShowEntity} Mapped exclusive show entity
     */
    exclusiveShowFromDto(dto: PublicGetExclusiveCategoryResponse): IVideoExclusiveShowEntity {
        return {
            id: dto.category.id,
            title: dto.category.name,
            slug: dto.category.slug,
            description: dto.category.description,
            posterUrl: dto.category.posterUrl ?? null,
            episodes: VideosMapper.videoSummaryListFromDto(dto.videos.items)
        };
    },

    /**
     * Maps VideoDetailDto to IVideoDetailEntity domain entity. Drops audit,
     * status, promotion, commerce, and author fields; nullables are normalized
     * to null, SEO overrides to undefined, and counts to 0.
     *
     * @param dto - Video detail data from API
     * @returns {IVideoDetailEntity} Mapped video detail entity
     */
    videoDetailFromDto(dto: VideoDetailDto): IVideoDetailEntity {
        return {
            id: dto.id,
            categoryId: dto.categoryId,
            categoryName: dto.categoryName,
            title: dto.title,
            slug: dto.slug,
            description: dto.description,
            thumbnailUrl: dto.thumbnailUrl ?? null,
            youtubeVideoUrl: dto.youtubeVideoUrl ?? null,
            hasLyrics: dto.hasLyrics,
            tags: VideosMapper.tagListFromDto(dto.tags),
            shareCount: dto.shareCount ?? 0,
            ratingAverage: dto.ratingAverage ?? 0,
            ratingCount: dto.ratingCount ?? 0,
            publishedAt: dto.publishedAt ?? null,
            metaTitle: dto.metaTitle ?? undefined,
            metaDescription: dto.metaDescription ?? undefined
        };
    },

    /**
     * Maps LyricsDto to IVideoLyricsEntity domain entity.
     * Drops the author and SEO fields — lyrics render embedded in the video
     * detail page, where the standalone lyrics page owns its own SEO.
     *
     * @param dto - Lyrics data from API
     * @returns {IVideoLyricsEntity} Mapped video lyrics entity
     */
    videoLyricsFromDto(dto: LyricsDto): IVideoLyricsEntity {
        return {
            id: dto.id,
            songTitle: dto.songTitle,
            artistName: dto.artistName,
            lyricsText: dto.lyricsText,
            language: dto.language
        };
    },

    /**
     * Maps PlaylistDto to IPlaylistEntity domain entity (1:1).
     *
     * @param dto - Playlist data from API
     * @returns {IPlaylistEntity} Mapped playlist entity
     */
    playlistFromDto(dto: PlaylistDto): IPlaylistEntity {
        return {
            id: dto.id,
            name: dto.name,
            videoCount: dto.videoCount
        };
    },

    /**
     * Maps a list of PlaylistDto to IPlaylistEntity domain entities.
     *
     * @param dtos - Playlist data list from API
     * @returns {IPlaylistEntity[]} Mapped playlist entities
     */
    playlistListFromDto(dtos: PlaylistDto[]): IPlaylistEntity[] {
        return dtos.map(VideosMapper.playlistFromDto);
    },

    /**
     * Maps the internal YouTube stats route payload to IYoutubeVideoStats.
     * The payload has no generated DTO, so the parse is defensive: any field
     * that is not a finite number becomes null (hidden/unavailable, not 0).
     *
     * @param json - Raw JSON payload from `/api/youtube/[videoId]`
     * @returns {IYoutubeVideoStats} Mapped YouTube stats entity
     */
    youtubeStatsFromJson(json: unknown): IYoutubeVideoStats {
        const record =
            typeof json === "object" && json !== null ? (json as Record<string, unknown>) : {};

        const toCount = (value: unknown): number | null => {
            return typeof value === "number" && Number.isFinite(value) ? value : null;
        };

        const viewCount = toCount(record.viewCount);
        const likeCount = toCount(record.likeCount);
        const commentCount = toCount(record.commentCount);

        return {
            viewCount,
            likeCount,
            commentCount,
            hasStats: viewCount !== null || likeCount !== null || commentCount !== null
        };
    }
} as const;
