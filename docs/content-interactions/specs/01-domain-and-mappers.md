# Spec 01 — Domain & Mappers

Design ref: [../04-domain-entities-and-mappers.md](../04-domain-entities-and-mappers.md).
The comment entities are **shipped** — reproduced here as the contract. The four deferred
fields on `IArticleCommentEntity` (for reply/edit/delete/like) are the only new work.

---

## 1. `IArticleCommentEntity` (extend)

`src/modules/articles/domain/entities/IArticleCommentEntity.ts`

The shipped entity plus the deferred interaction fields.

```ts
import type { IArticleAuthor } from "@/modules/articles/domain/entities/IArticleSummaryEntity";

/**
 * IArticleCommentEntity
 *
 * @description
 * One article comment or reply. Soft-deleted comments keep their row with a null
 * `body` and `author` and `isDeleted` true, so the thread renders a tombstone in place.
 *
 * @interface IArticleCommentEntity
 * @property {string} id - Comment unique identifier (UUID).
 * @property {string} userId - Commenter identity UUID; drives the own-comment check.
 * @property {string | null} body - Comment text; null when soft-deleted.
 * @property {boolean} isDeleted - Whether the comment is soft-deleted.
 * @property {string | null} createdAt - ISO creation timestamp, or null.
 * @property {IArticleAuthor} [author] - Byline; null/absent when deleted or unresolved.
 * @property {string | null} parentCommentId - Parent comment UUID; null for a top-level comment.
 * @property {number} replyCount - Count of non-deleted direct replies.
 * @property {number} likeCount - Count of likes on this comment.
 * @property {boolean} isLiked - Whether the current viewer liked this comment.
 */
export interface IArticleCommentEntity {
    id: string;
    userId: string;
    body: string | null;
    isDeleted: boolean;
    createdAt: string | null;
    author?: IArticleAuthor;
    parentCommentId: string | null;
    replyCount: number;
    likeCount: number;
    isLiked: boolean;
}
```

---

## 2. `IArticleCommentPage` (shipped — documented)

`src/modules/articles/domain/entities/IArticleCommentPage.ts`

```ts
import type { IArticleCommentEntity } from "@/modules/articles/domain/entities/IArticleCommentEntity";

/**
 * IArticleCommentPage
 *
 * @description
 * One page of an article's comments (or a comment's replies), plus the cursor to
 * request the next page. `hasNextPage` is derived by the mapper from the total `count`.
 *
 * @interface IArticleCommentPage
 * @property {IArticleCommentEntity[]} items - The comments on this page.
 * @property {number} pageIndex - Zero-based index of this page.
 * @property {number} pageSize - Page size the server used.
 * @property {number} count - Total comments across all pages.
 * @property {boolean} hasNextPage - Whether a further page exists.
 */
export interface IArticleCommentPage {
    items: IArticleCommentEntity[];
    pageIndex: number;
    pageSize: number;
    count: number;
    hasNextPage: boolean;
}
```

---

## 3. Comment mappers (extend)

`src/modules/articles/infrastructure/mappers/articles.mapper.ts`

Map the DTO's interaction fields; default the per-viewer flag and counts.

```ts
    /**
     * Maps ArticleCommentDto to IArticleCommentEntity. Normalizes nullables, drops the
     * always-null author email, and defaults the viewer/like fields when absent.
     *
     * @param dto - Comment data from API.
     * @returns {IArticleCommentEntity} Mapped comment entity.
     */
    commentFromDto(dto: ArticleCommentDto): IArticleCommentEntity {
        return {
            id: dto.id,
            userId: dto.userId,
            body: dto.body ?? null,
            isDeleted: dto.isDeleted,
            createdAt: dto.createdAt ?? null,
            author: dto.author
                ? { userName: dto.author.userName, avatarUrl: dto.author.avatarUrl ?? null, role: dto.author.role ?? undefined }
                : undefined,
            parentCommentId: dto.parentCommentId ?? null,
            replyCount: dto.replyCount ?? 0,
            likeCount: dto.likeCount ?? 0,
            isLiked: dto.isLiked ?? false
        };
    },

    /**
     * Maps a list of ArticleCommentDto to comment entities.
     *
     * @param dtos - Comment data list from API.
     * @returns {IArticleCommentEntity[]} Mapped comment entities.
     */
    commentListFromDto(dtos: ArticleCommentDto[]): IArticleCommentEntity[] {
        return dtos.map(ArticlesMapper.commentFromDto);
    },

    /**
     * Maps a paginated ArticleCommentDto result to an IArticleCommentPage, deriving
     * hasNextPage from the total count and the current page index.
     *
     * @param dto - Paginated envelope from the comments/replies endpoint.
     * @returns {IArticleCommentPage} Mapped comment page entity.
     */
    commentPageFromDto(dto: ArticleCommentDtoPaginatedResult): IArticleCommentPage {
        return {
            items: ArticlesMapper.commentListFromDto(dto.items),
            pageIndex: dto.pageIndex,
            pageSize: dto.pageSize,
            count: dto.count,
            hasNextPage: (dto.pageIndex + 1) * dto.pageSize < dto.count
        };
    },
```

---

## 4. Content flags (shipped — no change)

`IArticleDetailEntity` already carries `likeCount`, `commentCount`, `shareCount`,
`bookmarkCount`, `isLiked`, `isBookmarked`; `IArticleSummaryEntity` carries the counts
without the flags; `IVideoDetailEntity` / `IVideoSummaryEntity` carry `shareCount`,
`ratingAverage`, `ratingCount`. **No video entity gains a per-user flag** — the backend never
sends one.

---

## Tasks

- [ ] `IArticleCommentEntity` extended with `parentCommentId`, `replyCount`, `likeCount`, `isLiked`.
- [ ] `commentFromDto` maps the new fields; flags/counts default (false / 0) when absent.
- [ ] `commentListFromDto` + `commentPageFromDto` own list/page mapping (no `.map(Mapper.x)` at call sites).
- [ ] `IArticleCommentPage.hasNextPage` derived `(pageIndex + 1) * pageSize < count`.
- [ ] No per-user flag added to any video entity.
- [ ] `tsc` + biome clean.
