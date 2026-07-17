import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";
import type { IShortVideoFeedPage } from "@/modules/shorts/domain/entities/IShortVideoFeedPage";
import type {
    PublicGetShortsFeedResponse,
    ShortVideoDto
} from "@/shared/infrastructure/api/generated/116.api";

/**
 * Mapper converting short-video API DTOs to domain entities.
 *
 * @description
 * Stateless pure transforms in the infrastructure layer. Normalizes nullable
 * URLs and counts, flattens the author to a display name, and owns list and
 * feed-page mapping so call sites never map inline.
 */
export const ShortsMapper = {
    /**
     * Maps a ShortVideoDto to an IShortVideoEntity, normalizing nullables and
     * flattening the author to a display name.
     *
     * @param dto - Short video data from the API.
     * @returns {IShortVideoEntity} Mapped short entity.
     */
    shortFromDto(dto: ShortVideoDto): IShortVideoEntity {
        return {
            id: dto.id,
            title: dto.title,
            slug: dto.slug,
            videoUrl: dto.videoUrl ?? null,
            thumbnailUrl: dto.thumbnailUrl ?? null,
            hasFullVideo: dto.hasFullVideo,
            videoSlug: dto.videoSlug ?? null,
            viewCount: dto.viewCount ?? 0,
            likeCount: dto.likeCount ?? 0,
            shareCount: dto.shareCount ?? 0,
            bookmarkCount: dto.bookmarkCount ?? 0,
            author: dto.author
                ? {
                      userName: dto.author.userName,
                      avatarUrl: dto.author.avatarUrl ?? null,
                      role: dto.author.role ?? undefined
                  }
                : undefined,
            isLiked: dto.isLiked ?? false,
            isBookmarked: dto.isBookmarked ?? false
        };
    },

    /**
     * Maps a list of ShortVideoDto to IShortVideoEntity domain entities.
     *
     * @param dtos - Short video data list from the API.
     * @returns {IShortVideoEntity[]} Mapped short entities.
     */
    shortListFromDto(dtos: ShortVideoDto[]): IShortVideoEntity[] {
        return dtos.map(ShortsMapper.shortFromDto);
    },

    /**
     * Maps a cursor-paginated feed response to an IShortVideoFeedPage,
     * normalizing the optional cursor to null when exhausted.
     *
     * @param dto - The for-you feed envelope from getShortsFeed.
     * @returns {IShortVideoFeedPage} Mapped feed page entity.
     */
    shortFeedPageFromDto(dto: PublicGetShortsFeedResponse): IShortVideoFeedPage {
        return {
            items: ShortsMapper.shortListFromDto(dto.items),
            nextCursor: dto.nextCursor ?? null
        };
    }
} as const;
