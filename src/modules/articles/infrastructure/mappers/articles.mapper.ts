import type {
    IArticleActivityEntity,
    IArticleActivityPage
} from "@/modules/articles/domain/entities/IArticleActivityEntity";
import type {
    IArticleBookmarkEntity,
    IArticleBookmarkPage
} from "@/modules/articles/domain/entities/IArticleBookmarkEntity";
import type { IArticleCategoryEntity } from "@/modules/articles/domain/entities/IArticleCategoryEntity";
import type { IArticleCommentEntity } from "@/modules/articles/domain/entities/IArticleCommentEntity";
import type { IArticleCommentPage } from "@/modules/articles/domain/entities/IArticleCommentPage";
import type { IArticleDetailEntity } from "@/modules/articles/domain/entities/IArticleDetailEntity";
import type { IArticleImage } from "@/modules/articles/domain/entities/IArticleImage";
import type { IArticlePage } from "@/modules/articles/domain/entities/IArticlePage";
import type { IArticlePromotionFeedEntity } from "@/modules/articles/domain/entities/IArticlePromotionFeedEntity";
import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import type { IArticleTagEntity } from "@/modules/articles/domain/entities/IArticleTagEntity";
import type {
    ICommentedArticleEntity,
    ICommentedArticlePage
} from "@/modules/articles/domain/entities/ICommentedArticleEntity";
import type { IMyArticleCommentsPage } from "@/modules/articles/domain/entities/IMyArticleCommentsPage";
import type {
    ArticleCommentDto,
    ArticleCommentDtoPaginatedResult,
    ArticleDetailDto,
    ArticleImageDto,
    ArticleSummaryDto,
    ArticleSummaryDtoPaginatedResult,
    CategoryDto,
    PublicGetArticlePromotionFeedResponse,
    TagDto,
    UserArticleActivityDto,
    UserArticleActivityDtoPaginatedResult,
    UserBookmarkedArticleDto,
    UserBookmarkedArticleDtoPaginatedResult,
    UserCommentedArticleDto,
    UserCommentedArticleDtoPaginatedResult
} from "@/shared/infrastructure/api/generated/116.api";

/**
 * Mapper for converting API DTOs to domain entities in the articles module.
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
export const ArticlesMapper = {
    /**
     * Maps ArticleSummaryDto to IArticleSummaryEntity domain entity.
     * Drops audit fields, authorId, and status which are not needed
     * on the public mega menu display.
     *
     * @param dto - Article summary data from API
     * @returns {IArticleSummaryEntity} Mapped article summary entity
     */
    articleSummaryFromDto(dto: ArticleSummaryDto): IArticleSummaryEntity {
        return {
            id: dto.id,
            categoryId: dto.categoryId,
            categoryName: dto.categoryName,
            title: dto.title,
            slug: dto.slug,
            headline: dto.headline,
            coverImageUrl: dto.coverImageUrl ?? null,
            isPromoted: dto.isPromoted,
            publishedAt: dto.publishedAt ?? null,
            likeCount: dto.likeCount ?? 0,
            commentCount: dto.commentCount ?? 0,
            shareCount: dto.shareCount ?? 0,
            bookmarkCount: dto.bookmarkCount ?? 0
        };
    },

    /**
     * Maps a list of ArticleSummaryDto to IArticleSummaryEntity domain entities.
     *
     * @param dtos - Article summary data list from API
     * @returns {IArticleSummaryEntity[]} Mapped article summary entities
     */
    articleSummaryListFromDto(dtos: ArticleSummaryDto[]): IArticleSummaryEntity[] {
        return dtos.map(ArticlesMapper.articleSummaryFromDto);
    },

    /**
     * Maps a paginated ArticleSummaryDto result to an IArticlePage, deriving
     * hasNextPage from the total count and the current page index.
     *
     * @param dto - Paginated envelope from getPublishedArticles
     * @returns {IArticlePage} Mapped article page entity
     */
    articlePageFromDto(dto: ArticleSummaryDtoPaginatedResult): IArticlePage {
        return {
            items: ArticlesMapper.articleSummaryListFromDto(dto.items),
            pageIndex: dto.pageIndex,
            pageSize: dto.pageSize,
            count: dto.count,
            hasNextPage: (dto.pageIndex + 1) * dto.pageSize < dto.count
        };
    },

    /**
     * Maps CategoryDto to IArticleCategoryEntity domain entity.
     * Drops contentTypeId and contentTypeName because by the time this
     * mapper runs the category list is already scoped to Article.
     *
     * @param dto - Category data from API
     * @returns {IArticleCategoryEntity} Mapped article category entity
     */
    categoryFromDto(dto: CategoryDto): IArticleCategoryEntity {
        return {
            id: dto.id,
            name: dto.name,
            slug: dto.slug,
            description: dto.description,
            isFree: dto.isFree
        };
    },

    /**
     * Maps a list of CategoryDto to IArticleCategoryEntity domain entities.
     *
     * @param dtos - Category data list from API
     * @returns {IArticleCategoryEntity[]} Mapped article category entities
     */
    categoryListFromDto(dtos: CategoryDto[]): IArticleCategoryEntity[] {
        return dtos.map(ArticlesMapper.categoryFromDto);
    },

    /**
     * Maps TagDto to IArticleTagEntity domain entity.
     *
     * @param dto - Tag data from API
     * @returns {IArticleTagEntity} Mapped article tag entity
     */
    tagFromDto(dto: TagDto): IArticleTagEntity {
        return {
            id: dto.id,
            name: dto.name,
            slug: dto.slug
        };
    },

    /**
     * Maps a list of TagDto to IArticleTagEntity domain entities.
     *
     * @param dtos - Tag data list from API
     * @returns {IArticleTagEntity[]} Mapped article tag entities
     */
    tagListFromDto(dtos: TagDto[]): IArticleTagEntity[] {
        return dtos.map(ArticlesMapper.tagFromDto);
    },

    /**
     * Maps the article promotion feed API response to a clean domain entity.
     * Resolves backend spots and slots into named arrays and maps each
     * article entry through articleSummaryFromDto.
     *
     * @param dto - Raw API response
     * @returns {IArticlePromotionFeedEntity} Mapped promotion feed entity
     */
    promotionFeedFromDto(dto: PublicGetArticlePromotionFeedResponse): IArticlePromotionFeedEntity {
        return {
            hero: ArticlesMapper.articleSummaryListFromDto(dto.spot1.articles),
            side: ArticlesMapper.articleSummaryListFromDto(dto.spot2.articles),
            pairA: ArticlesMapper.articleSummaryListFromDto(dto.spot3.slots[0]?.articles ?? []),
            pairB: ArticlesMapper.articleSummaryListFromDto(dto.spot3.slots[1]?.articles ?? []),
            gossipStrip: ArticlesMapper.articleSummaryListFromDto(dto.gossipStrip)
        };
    },

    /**
     * Maps ArticleImageDto to IArticleImage, dropping the storage key and lowercasing
     * the image type.
     *
     * @param dto - Article image data from API
     * @returns {IArticleImage} Mapped article image entity
     */
    articleImageFromDto(dto: ArticleImageDto): IArticleImage {
        return {
            id: dto.id,
            url: dto.url,
            type: dto.imageType === "Cover" ? "cover" : "body"
        };
    },

    /**
     * Maps a list of ArticleImageDto to IArticleImage domain entities.
     *
     * @param dtos - Article image data list from API
     * @returns {IArticleImage[]} Mapped article image entities
     */
    articleImageListFromDto(dtos: ArticleImageDto[]): IArticleImage[] {
        return dtos.map(ArticlesMapper.articleImageFromDto);
    },

    /**
     * Maps ArticleDetailDto to IArticleDetailEntity, reusing tagFromDto and
     * articleImageFromDto for the nested lists. Admin, promotion, and commerce fields are
     * dropped; the caller's per-user interaction flags are kept to seed the engagement toggles.
     *
     * @param dto - Full article detail data from API
     * @returns {IArticleDetailEntity} Mapped article detail entity
     */
    articleDetailFromDto(dto: ArticleDetailDto): IArticleDetailEntity {
        return {
            id: dto.id,
            categoryId: dto.categoryId,
            categoryName: dto.categoryName,
            title: dto.title,
            slug: dto.slug,
            headline: dto.headline,
            body: dto.body,
            coverImageUrl: dto.coverImageUrl ?? null,
            author: dto.author
                ? {
                      userName: dto.author.userName,
                      avatarUrl: dto.author.avatarUrl ?? null,
                      role: dto.author.role ?? undefined
                  }
                : null,
            tags: ArticlesMapper.tagListFromDto(dto.tags),
            images: ArticlesMapper.articleImageListFromDto(dto.images),
            readTimeInMinutes: dto.readTimeInMinutes ?? 0,
            likeCount: dto.likeCount ?? 0,
            commentCount: dto.commentCount ?? 0,
            shareCount: dto.shareCount ?? 0,
            bookmarkCount: dto.bookmarkCount ?? 0,
            isLiked: dto.isLiked,
            isBookmarked: dto.isBookmarked,
            publishedAt: dto.publishedAt ?? null,
            metaTitle: dto.metaTitle ?? undefined,
            metaDescription: dto.metaDescription ?? undefined
        };
    },

    /**
     * Maps ArticleCommentDto to IArticleCommentEntity. The author projection is mapped
     * when the backend resolves it (user name plus avatar URL) and stays undefined for
     * unresolved commenters and deleted comments.
     *
     * @param dto - Article comment data from API
     * @returns {IArticleCommentEntity} Mapped article comment entity
     */
    articleCommentFromDto(dto: ArticleCommentDto): IArticleCommentEntity {
        return {
            id: dto.id,
            userId: dto.userId,
            body: dto.body ?? null,
            isDeleted: dto.isDeleted,
            createdAt: dto.createdAt ?? null,
            parentCommentId: dto.parentCommentId ?? null,
            replyCount: dto.replyCount,
            likeCount: dto.likeCount,
            isLiked: dto.isLiked,
            author: dto.author
                ? {
                      userName: dto.author.userName,
                      avatarUrl: dto.author.avatarUrl ?? null,
                      role: dto.author.role ?? undefined
                  }
                : undefined
        };
    },

    /**
     * Maps a list of ArticleCommentDto to IArticleCommentEntity domain entities.
     *
     * @param dtos - Article comment data list from API
     * @returns {IArticleCommentEntity[]} Mapped article comment entities
     */
    articleCommentListFromDto(dtos: ArticleCommentDto[]): IArticleCommentEntity[] {
        return dtos.map(ArticlesMapper.articleCommentFromDto);
    },

    /**
     * Maps a paginated ArticleCommentDto result to an IArticleCommentPage, deriving
     * hasNextPage from the total count and the current page index.
     *
     * @param dto - Paginated comments envelope from API
     * @returns {IArticleCommentPage} Mapped article comment page entity
     */
    articleCommentPageFromDto(dto: ArticleCommentDtoPaginatedResult): IArticleCommentPage {
        return {
            items: ArticlesMapper.articleCommentListFromDto(dto.items),
            pageIndex: dto.pageIndex,
            pageSize: dto.pageSize,
            count: dto.count,
            hasNextPage: (dto.pageIndex + 1) * dto.pageSize < dto.count
        };
    },

    /**
     * Maps UserBookmarkedArticleDto to IArticleBookmarkEntity, reusing articleSummaryFromDto
     * for the nested article. Throws when the bookmark timestamp is missing so the failure
     * surfaces through the repository's Result rather than yielding an undated entry.
     *
     * @param dto - User bookmarked-article data from API
     * @returns {IArticleBookmarkEntity} Mapped bookmark entity
     */
    articleBookmarkFromDto(dto: UserBookmarkedArticleDto): IArticleBookmarkEntity {
        if (!dto.bookmarkedAt) throw new Error("UserBookmarkedArticleDto is missing bookmarkedAt");
        return {
            article: ArticlesMapper.articleSummaryFromDto(dto.article),
            bookmarkedAt: dto.bookmarkedAt
        };
    },

    /**
     * Maps a list of UserBookmarkedArticleDto to IArticleBookmarkEntity domain entities.
     *
     * @param dtos - User bookmarked-article data list from API
     * @returns {IArticleBookmarkEntity[]} Mapped bookmark entities
     */
    articleBookmarkListFromDto(dtos: UserBookmarkedArticleDto[]): IArticleBookmarkEntity[] {
        return dtos.map(ArticlesMapper.articleBookmarkFromDto);
    },

    /**
     * Maps a paginated UserBookmarkedArticleDto result to an IArticleBookmarkPage, deriving
     * hasNextPage from the total count and the current page index.
     *
     * @param dto - Paginated bookmarks envelope from API
     * @returns {IArticleBookmarkPage} Mapped bookmark page entity
     */
    articleBookmarkPageFromDto(dto: UserBookmarkedArticleDtoPaginatedResult): IArticleBookmarkPage {
        return {
            items: ArticlesMapper.articleBookmarkListFromDto(dto.items),
            pageIndex: dto.pageIndex,
            pageSize: dto.pageSize,
            count: dto.count,
            hasNextPage: (dto.pageIndex + 1) * dto.pageSize < dto.count
        };
    },

    /**
     * Maps UserCommentedArticleDto to ICommentedArticleEntity, reusing articleSummaryFromDto
     * for the article and articleCommentFromDto for the latest comment. Throws when the
     * last-commented timestamp is missing so the failure surfaces through the Result.
     *
     * @param dto - User commented-article data from API
     * @returns {ICommentedArticleEntity} Mapped commented-article entity
     */
    commentedArticleFromDto(dto: UserCommentedArticleDto): ICommentedArticleEntity {
        if (!dto.lastCommentedAt) {
            throw new Error("UserCommentedArticleDto is missing lastCommentedAt");
        }
        return {
            article: ArticlesMapper.articleSummaryFromDto(dto.article),
            latestComment: ArticlesMapper.articleCommentFromDto(dto.latestComment),
            commentCount: dto.commentCount,
            lastCommentedAt: dto.lastCommentedAt
        };
    },

    /**
     * Maps a list of UserCommentedArticleDto to ICommentedArticleEntity domain entities.
     *
     * @param dtos - User commented-article data list from API
     * @returns {ICommentedArticleEntity[]} Mapped commented-article entities
     */
    commentedArticleListFromDto(dtos: UserCommentedArticleDto[]): ICommentedArticleEntity[] {
        return dtos.map(ArticlesMapper.commentedArticleFromDto);
    },

    /**
     * Maps a paginated UserCommentedArticleDto result to an ICommentedArticlePage, deriving
     * hasNextPage from the total count and the current page index.
     *
     * @param dto - Paginated commented-articles envelope from API
     * @returns {ICommentedArticlePage} Mapped commented-article page entity
     */
    commentedArticlePageFromDto(
        dto: UserCommentedArticleDtoPaginatedResult
    ): ICommentedArticlePage {
        return {
            items: ArticlesMapper.commentedArticleListFromDto(dto.items),
            pageIndex: dto.pageIndex,
            pageSize: dto.pageSize,
            count: dto.count,
            hasNextPage: (dto.pageIndex + 1) * dto.pageSize < dto.count
        };
    },

    /**
     * Maps UserArticleActivityDto to IArticleActivityEntity, reusing articleSummaryFromDto
     * for the article and normalizing a null share channel to undefined. Throws when the
     * last-interacted timestamp is missing so the failure surfaces through the Result;
     * publish dates are never substituted. Backs both the liked and shared lists.
     *
     * @param dto - User article-activity data from API
     * @returns {IArticleActivityEntity} Mapped article-activity entity
     */
    articleActivityFromDto(dto: UserArticleActivityDto): IArticleActivityEntity {
        if (!dto.lastInteractedAt) {
            throw new Error("UserArticleActivityDto is missing lastInteractedAt");
        }
        return {
            article: ArticlesMapper.articleSummaryFromDto(dto.article),
            lastInteractedAt: dto.lastInteractedAt,
            interactionCount: dto.interactionCount,
            lastShareChannel: dto.lastShareChannel ?? undefined
        };
    },

    /**
     * Maps a list of UserArticleActivityDto to IArticleActivityEntity domain entities.
     *
     * @param dtos - User article-activity data list from API
     * @returns {IArticleActivityEntity[]} Mapped article-activity entities
     */
    articleActivityListFromDto(dtos: UserArticleActivityDto[]): IArticleActivityEntity[] {
        return dtos.map(ArticlesMapper.articleActivityFromDto);
    },

    /**
     * Maps a paginated UserArticleActivityDto result to an IArticleActivityPage, deriving
     * hasNextPage from the total count and the current page index. Shared by the liked and
     * shared lists.
     *
     * @param dto - Paginated article-activity envelope from API
     * @returns {IArticleActivityPage} Mapped article-activity page entity
     */
    articleActivityPageFromDto(dto: UserArticleActivityDtoPaginatedResult): IArticleActivityPage {
        return {
            items: ArticlesMapper.articleActivityListFromDto(dto.items),
            pageIndex: dto.pageIndex,
            pageSize: dto.pageSize,
            count: dto.count,
            hasNextPage: (dto.pageIndex + 1) * dto.pageSize < dto.count
        };
    },

    /**
     * Maps a paginated ArticleCommentDto result to an IMyArticleCommentsPage, reusing
     * articleCommentListFromDto and deriving hasNextPage from the total count and the
     * current page index.
     *
     * @param dto - Paginated own-comments envelope from API
     * @returns {IMyArticleCommentsPage} Mapped own-comments page entity
     */
    myArticleCommentsPageFromDto(dto: ArticleCommentDtoPaginatedResult): IMyArticleCommentsPage {
        return {
            items: ArticlesMapper.articleCommentListFromDto(dto.items),
            pageIndex: dto.pageIndex,
            pageSize: dto.pageSize,
            count: dto.count,
            hasNextPage: (dto.pageIndex + 1) * dto.pageSize < dto.count
        };
    }
} as const;
