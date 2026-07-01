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
    ArticleCommentDto,
    ArticleCommentDtoPaginatedResult,
    ArticleDetailDto,
    ArticleImageDto,
    ArticleSummaryDto,
    ArticleSummaryDtoPaginatedResult,
    CategoryDto,
    PublicGetArticlePromotionFeedResponse,
    TagDto
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
     * @param {ArticleSummaryDto} dto - Article summary data from API
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
     * Maps a paginated ArticleSummaryDto result to an IArticlePage, deriving
     * hasNextPage from the total count and the current page index.
     *
     * @param {ArticleSummaryDtoPaginatedResult} dto - Paginated envelope from getPublishedArticles
     * @returns {IArticlePage} Mapped article page entity
     */
    articlePageFromDto(dto: ArticleSummaryDtoPaginatedResult): IArticlePage {
        return {
            items: dto.items.map(ArticlesMapper.articleSummaryFromDto),
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
     * @param {CategoryDto} dto - Category data from API
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
     * Maps TagDto to IArticleTagEntity domain entity.
     *
     * @param {TagDto} dto - Tag data from API
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
     * Maps the article promotion feed API response to a clean domain entity.
     * Resolves backend spots and slots into named arrays and maps each
     * article entry through articleSummaryFromDto.
     *
     * @param {PublicGetArticlePromotionFeedResponse} dto - Raw API response
     * @returns {IArticlePromotionFeedEntity} Mapped promotion feed entity
     */
    promotionFeedFromDto(dto: PublicGetArticlePromotionFeedResponse): IArticlePromotionFeedEntity {
        return {
            hero: dto.spot1.articles.map(ArticlesMapper.articleSummaryFromDto),
            side: dto.spot2.articles.map(ArticlesMapper.articleSummaryFromDto),
            pairA: (dto.spot3.slots[0]?.articles ?? []).map(ArticlesMapper.articleSummaryFromDto),
            pairB: (dto.spot3.slots[1]?.articles ?? []).map(ArticlesMapper.articleSummaryFromDto),
            gossipStrip: dto.gossipStrip.map(ArticlesMapper.articleSummaryFromDto)
        };
    },

    /**
     * Maps ArticleImageDto to IArticleImage, dropping the storage key and lowercasing
     * the image type.
     *
     * @param {ArticleImageDto} dto - Article image data from API
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
     * Maps ArticleDetailDto to IArticleDetailEntity. Reuses tagFromDto and
     * articleImageFromDto for the nested lists and maps the nullable author to
     * IArticleAuthor. Admin, promotion, and commerce fields are dropped; the caller's
     * per-user interaction flags are kept so the engagement toggles seed correctly.
     *
     * @param {ArticleDetailDto} dto - Full article detail data from API
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
            tags: dto.tags.map(ArticlesMapper.tagFromDto),
            images: dto.images.map(ArticlesMapper.articleImageFromDto),
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
     * @param {ArticleCommentDto} dto - Article comment data from API
     * @returns {IArticleCommentEntity} Mapped article comment entity
     */
    articleCommentFromDto(dto: ArticleCommentDto): IArticleCommentEntity {
        return {
            id: dto.id,
            userId: dto.userId,
            body: dto.body ?? null,
            isDeleted: dto.isDeleted,
            createdAt: dto.createdAt ?? null,
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
     * Maps a paginated ArticleCommentDto result to an IArticleCommentPage, deriving
     * hasNextPage from the total count and the current page index.
     *
     * @param {ArticleCommentDtoPaginatedResult} dto - Paginated comments envelope from API
     * @returns {IArticleCommentPage} Mapped article comment page entity
     */
    articleCommentPageFromDto(dto: ArticleCommentDtoPaginatedResult): IArticleCommentPage {
        return {
            items: dto.items.map(ArticlesMapper.articleCommentFromDto),
            pageIndex: dto.pageIndex,
            pageSize: dto.pageSize,
            count: dto.count,
            hasNextPage: (dto.pageIndex + 1) * dto.pageSize < dto.count
        };
    }
} as const;
