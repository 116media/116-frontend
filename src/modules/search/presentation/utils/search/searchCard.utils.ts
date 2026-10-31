import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import type { ISearchHitEntity } from "@/modules/search/domain/entities/ISearchHitEntity";
import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";
import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";

/**
 * Adapts a search hit to the shape each feed card already takes, so search reuses the
 * cards the rest of the site renders rather than growing a parallel set.
 *
 * A hit carries the engagement figures its own type keeps, read from the source row at
 * search time. A figure a type does not keep comes back null and renders as zero, which is
 * what the card would show for it anyway.
 */

/**
 * Adapts a hit to the article feed card's entity.
 *
 * @param hit - The search hit, already known to be an article.
 * @returns {IArticleSummaryEntity} The article summary the card renders.
 */
export function toArticleSummary(hit: ISearchHitEntity): IArticleSummaryEntity {
    return {
        id: hit.id,
        slug: hit.slug,
        title: hit.title,
        headline: hit.excerpt,
        categoryId: hit.categoryId ?? "",
        categoryName: hit.categoryName ?? "",
        coverImageUrl: hit.imageUrl,
        publishedAt: hit.publishedAt,
        isPromoted: false,
        likeCount: hit.likeCount ?? 0,
        commentCount: hit.commentCount ?? 0,
        shareCount: hit.shareCount ?? 0
    };
}

/**
 * Adapts a hit to the video card's entity.
 *
 * @param hit - The search hit, already known to be a video.
 * @returns {IVideoSummaryEntity} The video summary the card renders.
 */
export function toVideoSummary(hit: ISearchHitEntity): IVideoSummaryEntity {
    return {
        id: hit.id,
        slug: hit.slug,
        title: hit.title,
        categoryId: hit.categoryId ?? "",
        categoryName: hit.categoryName ?? "",
        thumbnailUrl: hit.imageUrl,
        youtubeVideoUrl: null,
        publishedAt: hit.publishedAt,
        isPromoted: false,
        shareCount: hit.shareCount ?? 0,
        ratingAverage: hit.ratingAverage ?? 0,
        ratingCount: hit.ratingCount ?? 0
    };
}

/**
 * Adapts a hit to the short tile's entity.
 *
 * @param hit - The search hit, already known to be a short.
 * @returns {IShortVideoEntity} The short the tile renders.
 */
export function toShortVideo(hit: ISearchHitEntity): IShortVideoEntity {
    return {
        id: hit.id,
        slug: hit.slug,
        title: hit.title,
        videoUrl: null,
        thumbnailUrl: hit.imageUrl,
        hasFullVideo: false,
        videoSlug: null,
        viewCount: hit.viewCount ?? 0,
        likeCount: hit.likeCount ?? 0,
        shareCount: hit.shareCount ?? 0,
        bookmarkCount: hit.bookmarkCount ?? 0,
        isLiked: false,
        isBookmarked: false
    };
}
