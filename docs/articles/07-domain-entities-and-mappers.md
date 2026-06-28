# Domain Entities & Mappers

The listing adds one entity (`IArticlePage`) and one optional field on the existing
`IArticleSummaryEntity`, plus one mapper function. Everything else is reused.

---

## `IArticleSummaryEntity` (extended)

The existing entity already maps `ArticleSummaryDto`. The card needs a few fields the
summary DTO does not carry yet (see [03-backend-api-reference.md](03-backend-api-reference.md));
they are added as **optional** so the mapper is forward-compatible and the dummy
generator can fill them today.

Three fields are added — `readTimeInMinutes`, `author`, and `bookmarkCount` — all
**optional** so the mapper stays forward-compatible and the dummy generator can fill
them today. They are documented in the block JSDoc's `@property` list, in line with the
existing entity (no per-field comments):

```ts
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

/**
 * IArticleAuthor
 *
 * @description
 * Minimal author projection for a card byline.
 *
 * @property {string} userName - Author display name.
 * @property {string | null} avatarUrl - Author avatar URL, or null.
 */
export interface IArticleAuthor {
    userName: string;
    avatarUrl: string | null;
}
```

> Keeping these optional means **no component hardcodes a fallback**: the card reads
> `article.readTimeInMinutes ?? 0` and `article.author?.userName`, the dummy generator
> always provides them, and the day the backend adds them to the summary DTO the mapper
> fills them and the dummy path is dropped. See [15-open-questions.md](15-open-questions.md).

## `IArticlePage` (new)

A page of summaries plus the paging cursor the infinite query needs. `hasNextPage` is
**derived** in the mapper from the DTO's `count`, so the hook never recomputes it.

```ts
/**
 * IArticlePage
 *
 * @description
 * One page of the published-articles feed: the items plus the cursor needed to request
 * the next page. `hasNextPage` is derived from the total `count` and the current index.
 *
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

---

## Mapper

`ArticlesMapper` already has `articleSummaryFromDto`. Add `articlePageFromDto`, which
maps the paginated envelope and derives `hasNextPage`.

```ts
/**
 * Maps a paginated ArticleSummaryDto result to an IArticlePage, deriving hasNextPage
 * from the total count and the current page index.
 */
static articlePageFromDto(dto: ArticleSummaryDtoPaginatedResult): IArticlePage {
    const items = dto.items.map(ArticlesMapper.articleSummaryFromDto);
    const hasNextPage = (dto.pageIndex + 1) * dto.pageSize < dto.count;
    return {
        items,
        pageIndex: dto.pageIndex,
        pageSize: dto.pageSize,
        count: dto.count,
        hasNextPage
    };
}
```

`articleSummaryFromDto` gains two lines to carry `bookmarkCount` and (when present)
`readTimeInMinutes` / `author`; today those come from the DTO only if the backend adds
them, otherwise they stay `undefined` and the dummy path fills them.

---

## Why derive `hasNextPage` in the mapper (not the hook)

- The domain entity is the single place that understands the pagination contract
  (zero-based `pageIndex`, total `count`). The hook stays generic — its
  `getNextPageParam` just reads `page.hasNextPage`.
- If the backend later returns an explicit `hasNextPage`, only the mapper changes.

See [08-repositories-and-usecases.md](08-repositories-and-usecases.md) for the port /
impl / use case that produce `IArticlePage`, and
[09-state-management-and-hooks.md](09-state-management-and-hooks.md) for how the hook
consumes it.
