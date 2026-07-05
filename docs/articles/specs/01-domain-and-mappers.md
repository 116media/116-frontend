# Spec 01 — Domain & Mappers

Design ref: [../07-domain-entities-and-mappers.md](../07-domain-entities-and-mappers.md).

---

## 1. Extend `IArticleSummaryEntity`

`src/modules/articles/domain/entities/IArticleSummaryEntity.ts` — add the optional
card fields and the author projection. Keep the existing JSDoc; append the new
`@property` lines.

```ts
/**
 * Minimal author projection for a card byline.
 *
 * @interface IArticleAuthor
 * @property {string} userName - Author display name.
 * @property {string | null} avatarUrl - Author avatar URL, or null.
 */
export interface IArticleAuthor {
    userName: string;
    avatarUrl: string | null;
}

/**
 * IArticleSummaryEntity
 *
 * @description
 * Summary view of a published article, used by the feed grid and cards.
 *
 * @property {string} id - Unique identifier (UUID).
 * @property {string} categoryId - Associated category UUID.
 * @property {string} categoryName - Display name of the category.
 * @property {string} title - Article display title.
 * @property {string} slug - URL-safe slug.
 * @property {string} headline - Short summary text.
 * @property {string | null} coverImageUrl - Cover image URL, or null.
 * @property {boolean} isPromoted - Whether the article has an active paid promotion.
 * @property {string | null} publishedAt - ISO publication timestamp, or null.
 * @property {number} likeCount - Cached number of likes.
 * @property {number} commentCount - Cached number of comments.
 * @property {number} shareCount - Cached number of shares.
 * @property {number} [bookmarkCount] - Cached number of bookmarks.
 * @property {number} [readTimeInMinutes] - Estimated reading time in minutes. Absent on the current summary DTO.
 * @property {IArticleAuthor} [author] - Denormalized author for the byline. Absent on the current summary DTO.
 */
export interface IArticleSummaryEntity {
    id: string;
    categoryId: string;
    categoryName: string;
    title: string;
    slug: string;
    headline: string;
    coverImageUrl: string | null;
    isPromoted: boolean;
    publishedAt: string | null;
    likeCount: number;
    commentCount: number;
    shareCount: number;
    bookmarkCount?: number;
    readTimeInMinutes?: number;
    author?: IArticleAuthor;
}
```

## 2. `IArticlePage`

`src/modules/articles/domain/entities/IArticlePage.ts` — new.

```ts
import type { IArticleSummaryEntity } from "./IArticleSummaryEntity";

/**
 * IArticlePage
 *
 * @description
 * One page of the published-articles feed plus the cursor needed to request the next
 * page. `hasNextPage` is derived by the mapper from the total `count`.
 *
 * @interface IArticlePage
 * @property {IArticleSummaryEntity[]} items - The articles on this page.
 * @property {number} pageIndex - Zero-based index of this page.
 * @property {number} pageSize - Page size the server used.
 * @property {number} count - Total articles across all pages.
 * @property {boolean} hasNextPage - Whether a further page exists.
 */
export interface IArticlePage {
    items: IArticleSummaryEntity[];
    pageIndex: number;
    pageSize: number;
    count: number;
    hasNextPage: boolean;
}
```

## 3. Mapper

`src/modules/articles/infrastructure/mappers/articles.mapper.ts` — add
`articlePageFromDto`; extend `articleSummaryFromDto` to carry `bookmarkCount` (and
`readTimeInMinutes` / `author` once the DTO exposes them).

```ts
/**
 * Maps a paginated ArticleSummaryDto result to an IArticlePage, deriving hasNextPage
 * from the total count and the current page index.
 *
 * @param dto - The paginated envelope from getPublishedArticles.
 * @returns The domain page.
 */
static articlePageFromDto(dto: ArticleSummaryDtoPaginatedResult): IArticlePage {
    return {
        items: dto.items.map(ArticlesMapper.articleSummaryFromDto),
        pageIndex: dto.pageIndex,
        pageSize: dto.pageSize,
        count: dto.count,
        hasNextPage: (dto.pageIndex + 1) * dto.pageSize < dto.count
    };
}
```

Extend the existing summary mapper so it also carries `bookmarkCount`. `readTimeInMinutes`
and `author` stay `undefined` until the DTO grows those fields (the dummy generator
fills them meanwhile), so no mapping line is added for them yet.

```ts
static articleSummaryFromDto(dto: ArticleSummaryDto): IArticleSummaryEntity {
    return {
        ...ArticlesMapper.summaryBaseFromDto(dto),
        bookmarkCount: dto.bookmarkCount
    };
}
```

(Or add `bookmarkCount: dto.bookmarkCount` to the existing return object — the point is
one new mapped field, no inline comments.)

Import the generated types (`ArticleSummaryDto`, `ArticleSummaryDtoPaginatedResult`)
from `@/shared/infrastructure/api/generated/116.api`.

---

## Tasks

- [x] `IArticleAuthor` + optional fields added to `IArticleSummaryEntity` (JSDoc).
- [x] `IArticlePage.ts` created (JSDoc).
- [x] `articlePageFromDto` added; `hasNextPage` boundary verified
      (`(pageIndex+1)*pageSize < count`).
- [x] `articleSummaryFromDto` carries `bookmarkCount`.
- [x] `npx tsc --noEmit` + biome clean.
