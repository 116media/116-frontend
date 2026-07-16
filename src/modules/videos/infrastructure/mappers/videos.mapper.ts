import type { IPlaylistDetailEntity } from "@/modules/videos/domain/entities/IPlaylistDetailEntity";
import type { IPlaylistEntity } from "@/modules/videos/domain/entities/IPlaylistEntity";
import type { IPlaylistVideoEntity } from "@/modules/videos/domain/entities/IPlaylistVideoEntity";
import type { IShowEntity } from "@/modules/videos/domain/entities/IShowEntity";
import type { IVideoActivityEntity } from "@/modules/videos/domain/entities/IVideoActivityEntity";
import type { IVideoActivityPage } from "@/modules/videos/domain/entities/IVideoActivityPage";
import type { IVideoCategoryEntity } from "@/modules/videos/domain/entities/IVideoCategoryEntity";
import type { IVideoDetailEntity } from "@/modules/videos/domain/entities/IVideoDetailEntity";
import type { IVideoExclusiveShowEntity } from "@/modules/videos/domain/entities/IVideoExclusiveShowEntity";
import type { IVideoLyricsEntity } from "@/modules/videos/domain/entities/IVideoLyricsEntity";
import type { IVideoPage } from "@/modules/videos/domain/entities/IVideoPage";
import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";
import type { IVideoTagEntity } from "@/modules/videos/domain/entities/IVideoTagEntity";
import type { IYoutubeVideoStats } from "@/modules/videos/domain/entities/IYoutubeVideoStats";
import type {
    CategoryDto,
    LyricsDto,
    PlaylistDetailDto,
    PlaylistDto,
    PublicGetExclusiveCategoryResponse,
    TagDto,
    UserVideoActivityDto,
    UserVideoActivityDtoPaginatedResult,
    VideoDetailDto,
    VideoInPlaylistDto,
    VideoSummaryDto,
    VideoSummaryDtoPaginatedResult
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
     * Maps a paginated VideoSummaryDto result to an IVideoPage, deriving
     * hasNextPage from the total count and the current page index.
     *
     * @param dto - Paginated envelope from getPublishedVideos
     * @returns {IVideoPage} Mapped video page entity
     */
    videoPageFromDto(dto: VideoSummaryDtoPaginatedResult): IVideoPage {
        return {
            items: VideosMapper.videoSummaryListFromDto(dto.items),
            pageIndex: dto.pageIndex,
            pageSize: dto.pageSize,
            count: dto.count,
            hasNextPage: (dto.pageIndex + 1) * dto.pageSize < dto.count
        };
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
                ? {
                      background: dto.colors.background,
                      foreground: dto.colors.foreground
                  }
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
     * Reuses the show mapping for the category fields and maps the paginated
     * videos into episodes.
     *
     * @param dto - Exclusive show payload from API
     * @returns {IVideoExclusiveShowEntity} Mapped exclusive show entity
     */
    exclusiveShowFromDto(dto: PublicGetExclusiveCategoryResponse): IVideoExclusiveShowEntity {
        return {
            ...VideosMapper.showFromDto(dto.category),
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
            isRated: dto.isRated ?? false,
            ratedStars: dto.ratedStars ?? null,
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
     * Maps PlaylistDto to IPlaylistEntity domain entity, capping the cover
     * thumbnails at the first four ordered slots used by the cover collage.
     *
     * @param dto - Playlist data from API
     * @returns {IPlaylistEntity} Mapped playlist entity
     */
    playlistFromDto(dto: PlaylistDto): IPlaylistEntity {
        return {
            id: dto.id,
            name: dto.name,
            videoCount: dto.videoCount,
            thumbnailUrls: dto.thumbnailUrls.slice(0, 4)
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
     * Maps VideoInPlaylistDto to IPlaylistVideoEntity domain entity, keeping the
     * playlist position and normalizing nullables to null / counts to 0.
     *
     * @param dto - Video-in-playlist data from API
     * @returns {IPlaylistVideoEntity} Mapped playlist video entity
     */
    playlistVideoFromDto(dto: VideoInPlaylistDto): IPlaylistVideoEntity {
        return {
            videoId: dto.videoId,
            slug: dto.slug,
            title: dto.title,
            thumbnailUrl: dto.thumbnailUrl ?? null,
            categoryName: dto.categoryName,
            publishedAt: dto.publishedAt ?? null,
            ratingAverage: dto.ratingAverage ?? 0,
            ratingCount: dto.ratingCount ?? 0,
            sortOrder: dto.sortOrder
        };
    },

    /**
     * Maps a list of VideoInPlaylistDto to IPlaylistVideoEntity domain entities.
     *
     * @param dtos - Video-in-playlist data list from API
     * @returns {IPlaylistVideoEntity[]} Mapped playlist video entities
     */
    playlistVideoListFromDto(dtos: VideoInPlaylistDto[]): IPlaylistVideoEntity[] {
        return dtos.map(VideosMapper.playlistVideoFromDto);
    },

    /**
     * Maps PlaylistDetailDto to IPlaylistDetailEntity, mapping the videos into
     * ordered playlist rows.
     *
     * @param dto - Playlist detail data from API
     * @returns {IPlaylistDetailEntity} Mapped playlist detail entity
     */
    playlistDetailFromDto(dto: PlaylistDetailDto): IPlaylistDetailEntity {
        return {
            id: dto.id,
            name: dto.name,
            videos: VideosMapper.playlistVideoListFromDto(dto.videos)
        };
    },

    /**
     * Maps UserVideoActivityDto to IVideoActivityEntity. Reuses the video summary
     * mapper; discards out-of-range star ratings (only 1–5 survive) and normalizes
     * a null share channel to undefined.
     *
     * @param dto - User video-activity data from API
     * @returns {IVideoActivityEntity} Mapped video activity entity
     */
    videoActivityFromDto(dto: UserVideoActivityDto): IVideoActivityEntity {
        const ratedStars =
            typeof dto.ratedStars === "number" && dto.ratedStars >= 1 && dto.ratedStars <= 5
                ? dto.ratedStars
                : undefined;

        return {
            video: VideosMapper.videoSummaryFromDto(dto.video),
            lastInteractedAt: dto.lastInteractedAt,
            interactionCount: dto.interactionCount,
            ratedStars,
            lastShareChannel: dto.lastShareChannel ?? undefined
        };
    },

    /**
     * Maps a list of UserVideoActivityDto to IVideoActivityEntity domain entities.
     *
     * @param dtos - User video-activity data list from API
     * @returns {IVideoActivityEntity[]} Mapped video activity entities
     */
    videoActivityListFromDto(dtos: UserVideoActivityDto[]): IVideoActivityEntity[] {
        return dtos.map(VideosMapper.videoActivityFromDto);
    },

    /**
     * Maps a paginated UserVideoActivityDto result to an IVideoActivityPage,
     * deriving hasNextPage from the total count and the current page index.
     *
     * @param dto - Paginated envelope from the rated / shared feeds
     * @returns {IVideoActivityPage} Mapped video activity page entity
     */
    videoActivityPageFromDto(dto: UserVideoActivityDtoPaginatedResult): IVideoActivityPage {
        return {
            items: VideosMapper.videoActivityListFromDto(dto.items),
            pageIndex: dto.pageIndex,
            pageSize: dto.pageSize,
            count: dto.count,
            hasNextPage: (dto.pageIndex + 1) * dto.pageSize < dto.count
        };
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
