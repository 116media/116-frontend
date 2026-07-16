import type { IShortVideoActivityEntity } from "@/modules/shorts/domain/entities/IShortVideoActivityEntity";
import type { IShortVideoActivityPage } from "@/modules/shorts/domain/entities/IShortVideoActivityPage";
import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";
import type { IShortVideoFeedPage } from "@/modules/shorts/domain/entities/IShortVideoFeedPage";
import type {
    PublicGetShortsFeedResponse,
    ShortVideoDto,
    UserShortVideoActivityDto,
    UserShortVideoActivityDtoPaginatedResult
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
     * @param dto - The randomized feed envelope from getShortsFeed.
     * @returns {IShortVideoFeedPage} Mapped feed page entity.
     */
    shortFeedPageFromDto(dto: PublicGetShortsFeedResponse): IShortVideoFeedPage {
        return {
            items: ShortsMapper.shortListFromDto(dto.items),
            nextCursor: dto.nextCursor ?? null
        };
    },

    /**
     * Maps a UserShortVideoActivityDto to an IShortVideoActivityEntity. Throws when
     * the required interaction timestamp is missing so the repository surfaces it as
     * a failure rather than emitting an unsortable entity.
     *
     * @param dto - User short-video activity data from the API.
     * @returns {IShortVideoActivityEntity} Mapped activity entity.
     */
    shortVideoActivityFromDto(dto: UserShortVideoActivityDto): IShortVideoActivityEntity {
        if (!dto.lastInteractedAt) {
            throw new Error("UserShortVideoActivityDto is missing lastInteractedAt");
        }
        return {
            shortVideo: ShortsMapper.shortFromDto(dto.shortVideo),
            lastInteractedAt: dto.lastInteractedAt,
            interactionCount: dto.interactionCount ?? 0
        };
    },

    /**
     * Maps a list of UserShortVideoActivityDto to IShortVideoActivityEntity domain
     * entities.
     *
     * @param dtos - User short-video activity data list from the API.
     * @returns {IShortVideoActivityEntity[]} Mapped activity entities.
     */
    shortVideoActivityListFromDto(dtos: UserShortVideoActivityDto[]): IShortVideoActivityEntity[] {
        return dtos.map(ShortsMapper.shortVideoActivityFromDto);
    },

    /**
     * Maps a paginated UserShortVideoActivityDto result to an IShortVideoActivityPage,
     * deriving hasNextPage from the total count and the current page index.
     *
     * @param dto - Paginated envelope from a favorites endpoint.
     * @returns {IShortVideoActivityPage} Mapped activity page entity.
     */
    shortVideoActivityPageFromDto(
        dto: UserShortVideoActivityDtoPaginatedResult
    ): IShortVideoActivityPage {
        return {
            items: ShortsMapper.shortVideoActivityListFromDto(dto.items),
            pageIndex: dto.pageIndex,
            pageSize: dto.pageSize,
            count: dto.count,
            hasNextPage: (dto.pageIndex + 1) * dto.pageSize < dto.count
        };
    }
} as const;
