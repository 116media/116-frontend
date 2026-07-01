# Spec 01 — Domain & Mappers

Design ref: [../13-domain-entities-and-mappers.md](../13-domain-entities-and-mappers.md).

Four new entities in `articles/domain/entities` and four new functions on the existing
`ArticlesMapper`. `IArticleAuthor` and `IArticleTagEntity` are reused verbatim; the comment
`author` projection is designed-for but the mapper leaves it undefined
([../03-backend-api-reference.md](../03-backend-api-reference.md)).

---

## 1. `IArticleImage`

`src/modules/articles/domain/entities/IArticleImage.ts` — new.

```ts
/**
 * IArticleImage
 *
 * @description
 * One image attached to an article, mapped from ArticleImageDto. The storage key is
 * dropped and the DTO's `imageType` ("Cover" | "Body") is lowercased to a `type` union.
 *
 * @interface IArticleImage
 *
 * @property {string} id - Unique identifier (UUID)
 * @property {string} url - Resolved image URL
 * @property {"cover" | "body"} type - Placement of the image within the article
 */
export interface IArticleImage {
    id: string;
    url: string;
    type: "cover" | "body";
}
```

## 2. `IArticleDetailEntity`

`src/modules/articles/domain/entities/IArticleDetailEntity.ts` — new. Imports
`IArticleAuthor` from `IArticleSummaryEntity`, plus `IArticleImage` and
`IArticleTagEntity`.

```ts
import type { IArticleImage } from "@/modules/articles/domain/entities/IArticleImage";
import type { IArticleAuthor } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import type { IArticleTagEntity } from "@/modules/articles/domain/entities/IArticleTagEntity";

/**
 * IArticleDetailEntity
 *
 * @description
 * Full view of a single published article behind /articles/[slug], mapped from
 * ArticleDetailDto. Reuses IArticleAuthor for the byline and IArticleTagEntity for the
 * tag block. Drops admin, promotion, and commerce metadata; keeps `metaTitle` and
 * `metaDescription` for SEO.
 *
 * @interface IArticleDetailEntity
 *
 * @property {string} id - Unique identifier (UUID). Keys the interaction and comment endpoints
 * @property {string} categoryId - Associated category UUID
 * @property {string} categoryName - Display name of the category
 * @property {string} title - Article display title
 * @property {string} slug - URL-safe slug
 * @property {string} headline - Teaser shown under the title
 * @property {string} body - Rich-text HTML body, sanitized before render
 * @property {string | null} coverImageUrl - Hero image URL, or null
 * @property {IArticleAuthor | null} author - Byline author, or null when absent
 * @property {IArticleTagEntity[]} tags - Tags attached to the article
 * @property {IArticleImage[]} images - Cover and body images
 * @property {number} readTimeInMinutes - Server-computed reading time in minutes
 * @property {number} likeCount - Cached number of likes
 * @property {number} commentCount - Cached number of comments
 * @property {number} shareCount - Cached number of shares
 * @property {number} bookmarkCount - Cached number of bookmarks
 * @property {string | null} publishedAt - ISO publication timestamp, or null
 * @property {string} [metaTitle] - SEO title override, when the DTO provides one
 * @property {string} [metaDescription] - SEO description override, when the DTO provides one
 */
export interface IArticleDetailEntity {
    id: string;
    categoryId: string;
    categoryName: string;
    title: string;
    slug: string;
    headline: string;
    body: string;
    coverImageUrl: string | null;
    author: IArticleAuthor | null;
    tags: IArticleTagEntity[];
    images: IArticleImage[];
    readTimeInMinutes: number;
    likeCount: number;
    commentCount: number;
    shareCount: number;
    bookmarkCount: number;
    publishedAt: string | null;
    metaTitle?: string;
    metaDescription?: string;
}
```

## 3. `IArticleCommentEntity`

`src/modules/articles/domain/entities/IArticleCommentEntity.ts` — new. Imports
`IArticleAuthor` for the optional projection.

```ts
import type { IArticleAuthor } from "@/modules/articles/domain/entities/IArticleSummaryEntity";

/**
 * IArticleCommentEntity
 *
 * @description
 * One comment on an article, mapped from ArticleCommentDto. The `author` projection is
 * designed-for but not yet sent by the backend (the DTO carries only `userId`); the
 * mapper leaves it undefined until the backend adds it. Deleted comments arrive with
 * `body: null` and `isDeleted: true`.
 *
 * @interface IArticleCommentEntity
 *
 * @property {string} id - Unique identifier (UUID)
 * @property {string} userId - Author's user UUID (the only identity the DTO carries today)
 * @property {string | null} body - Comment text, or null when the comment is deleted
 * @property {boolean} isDeleted - Whether the comment has been removed
 * @property {string | null} createdAt - ISO creation timestamp, or null
 * @property {IArticleAuthor} [author] - Denormalized author for the row byline. Absent until the backend projects it
 */
export interface IArticleCommentEntity {
    id: string;
    userId: string;
    body: string | null;
    isDeleted: boolean;
    createdAt: string | null;
    author?: IArticleAuthor;
}
```

## 4. `IArticleCommentPage`

`src/modules/articles/domain/entities/IArticleCommentPage.ts` — new. Mirrors
`IArticlePage`.

```ts
import type { IArticleCommentEntity } from "@/modules/articles/domain/entities/IArticleCommentEntity";

/**
 * IArticleCommentPage
 *
 * @description
 * One page of an article's comments plus the cursor needed to request the next page.
 * `hasNextPage` is derived by the mapper from the total `count`.
 *
 * @interface IArticleCommentPage
 *
 * @property {IArticleCommentEntity[]} items - The comments on this page
 * @property {number} pageIndex - Zero-based index of this page
 * @property {number} pageSize - Page size the server used
 * @property {number} count - Total comments across all pages
 * @property {boolean} hasNextPage - Whether a further page exists
 */
export interface IArticleCommentPage {
    items: IArticleCommentEntity[];
    pageIndex: number;
    pageSize: number;
    count: number;
    hasNextPage: boolean;
}
```

## 5. Mapper functions

`src/modules/articles/infrastructure/mappers/articles.mapper.ts` — add four functions to
the `ArticlesMapper` object. Import the generated types (`ArticleDetailDto`,
`ArticleImageDto`, `ArticleCommentDto`, `ArticleCommentDtoPaginatedResult`) and the four
new entity types.

```ts
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
}
```

```ts
/**
 * Maps ArticleDetailDto to IArticleDetailEntity. Reuses tagFromDto and
 * articleImageFromDto for the nested lists and maps the nullable author to
 * IArticleAuthor. Admin, promotion, and commerce fields are dropped.
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
            ? { userName: dto.author.userName, avatarUrl: dto.author.avatarUrl ?? null }
            : null,
        tags: dto.tags.map(ArticlesMapper.tagFromDto),
        images: dto.images.map(ArticlesMapper.articleImageFromDto),
        readTimeInMinutes: dto.readTimeInMinutes ?? 0,
        likeCount: dto.likeCount ?? 0,
        commentCount: dto.commentCount ?? 0,
        shareCount: dto.shareCount ?? 0,
        bookmarkCount: dto.bookmarkCount ?? 0,
        publishedAt: dto.publishedAt ?? null,
        metaTitle: dto.metaTitle ?? undefined,
        metaDescription: dto.metaDescription ?? undefined
    };
}
```

```ts
/**
 * Maps ArticleCommentDto to IArticleCommentEntity. The author projection is not set —
 * the DTO carries only userId — so it stays undefined until the backend projects it.
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
        createdAt: dto.createdAt ?? null
    };
}
```

```ts
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
```

---

## Tasks

- [ ] `IArticleImage.ts` created (JSDoc); `type` union is `"cover" | "body"`.
- [ ] `IArticleDetailEntity.ts` created (JSDoc); reuses `IArticleAuthor` and
      `IArticleTagEntity`; `metaTitle` / `metaDescription` optional.
- [ ] `IArticleCommentEntity.ts` created (JSDoc); `author?` documented as the designed-for
      projection the backend does not yet send.
- [ ] `IArticleCommentPage.ts` created (JSDoc); mirrors `IArticlePage`.
- [ ] `articleImageFromDto` added; `"Cover"` → `"cover"`, all else → `"body"`.
- [ ] `articleDetailFromDto` added; nullable author mapped; counts default to `0`; nested
      lists via `tagFromDto` / `articleImageFromDto`.
- [ ] `articleCommentFromDto` added; `author` left `undefined`; deleted comment
      (`body: null`, `isDeleted: true`) maps through.
- [ ] `articleCommentPageFromDto` added; `hasNextPage` boundary verified
      (`(pageIndex+1)*pageSize < count`).
- [ ] `npx tsc --noEmit` + biome clean.
