# Domain Entities & Mappers

The detail page adds four entities to `articles/domain/entities` and four mapper functions
to the existing `ArticlesMapper`. It reuses `IArticleAuthor` and `IArticleTagEntity`
verbatim, and mirrors the pagination shape already established by `IArticlePage`
([../../articles/07-domain-entities-and-mappers.md](../../articles/07-domain-entities-and-mappers.md)).
Nothing here is a new module — it extends the `articles` slice the feed built.

---

## `IArticleImage` (new)

`ArticleDetailDto.images` is a flat list of cover and body images. The DTO carries a
storage key and an `imageType` of `"Cover" | "Body"`; the entity keeps only what the UI
renders and **lowercases** the discriminant so components read a plain `"cover" | "body"`
union.

```ts
/**
 * IArticleImage
 *
 * @description
 * One image attached to an article, mapped from ArticleImageDto. The storage key is
 * dropped; the DTO's `imageType` ("Cover" | "Body") is lowercased to a `type` union.
 *
 * @property {string} id - Unique identifier (UUID).
 * @property {string} url - Resolved image URL.
 * @property {"cover" | "body"} type - Placement of the image within the article.
 */
export interface IArticleImage {
    id: string;
    url: string;
    type: "cover" | "body";
}
```

The cover image is still read from `coverImageUrl` on the detail entity; `images`
carries the full set (cover + inline body images) for galleries and body rendering.

## `IArticleDetailEntity` (new)

The full single-article projection mapped from `ArticleDetailDto`. It reuses
`IArticleAuthor` (from `IArticleSummaryEntity.ts`) for the byline and `IArticleTagEntity`
for the tag block, and adds the rich-text `body`, the `images` list, counts, and the two
optional SEO fields used by `generateMetadata` ([17-seo-and-metadata.md](17-seo-and-metadata.md)).

```ts
/**
 * IArticleDetailEntity
 *
 * @description
 * Full view of a single published article behind /articles/[slug], mapped from
 * ArticleDetailDto. Reuses IArticleAuthor for the byline and IArticleTagEntity for the
 * tag block. Drops admin, promotion, and commerce metadata; keeps `metaTitle` /
 * `metaDescription` for SEO.
 *
 * @property {string} id - Unique identifier (UUID). Keys the interaction and comment endpoints.
 * @property {string} categoryId - Associated category UUID.
 * @property {string} categoryName - Display name of the category.
 * @property {string} title - Article display title.
 * @property {string} slug - URL-safe slug.
 * @property {string} headline - Teaser shown under the title.
 * @property {string} body - Rich-text HTML body, sanitized before render.
 * @property {string | null} coverImageUrl - Hero image URL, or null.
 * @property {IArticleAuthor | null} author - Byline author, or null when absent.
 * @property {IArticleTagEntity[]} tags - Tags attached to the article.
 * @property {IArticleImage[]} images - Cover and body images.
 * @property {number} readTimeInMinutes - Server-computed reading time in minutes.
 * @property {number} likeCount - Cached number of likes.
 * @property {number} commentCount - Cached number of comments.
 * @property {number} shareCount - Cached number of shares.
 * @property {number} bookmarkCount - Cached number of bookmarks.
 * @property {string | null} publishedAt - ISO publication timestamp, or null.
 * @property {string} [metaTitle] - SEO title override, when the DTO provides one.
 * @property {string} [metaDescription] - SEO description override, when the DTO provides one.
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

> **Author shape.** `AuthorDto` also carries `email` and `role`. Neither is needed for the
> byline, so the reused `IArticleAuthor` (`userName`, `avatarUrl`) stays as-is. If a later
> surface needs the role badge, `IArticleAuthor` can gain optional `email?` / `role?`
> fields without touching the detail entity — see [19-open-questions.md](19-open-questions.md).

## `IArticleCommentEntity` (new)

Mapped from `ArticleCommentDto`. Deleted comments arrive with `body: null` and
`isDeleted: true`, so the UI renders a "comment removed" placeholder rather than empty
text.

```ts
/**
 * IArticleCommentEntity
 *
 * @description
 * One comment on an article, mapped from ArticleCommentDto. The `author` projection is
 * designed-for but not yet sent by the backend (the DTO carries only `userId`); the
 * mapper leaves it undefined until the backend adds it.
 *
 * @property {string} id - Unique identifier (UUID).
 * @property {string} userId - Author's user UUID (the only identity the DTO carries today).
 * @property {string | null} body - Comment text, or null when the comment is deleted.
 * @property {boolean} isDeleted - Whether the comment has been removed.
 * @property {string | null} createdAt - ISO creation timestamp, or null.
 * @property {IArticleAuthor} [author] - Denormalized author for the row byline. Absent until the backend projects it.
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

> **The comment author gap.** `ArticleCommentDto` has no username or avatar — only
> `userId`. The list is designed around an **optional** `author?: IArticleAuthor`
> projection the backend should add. The mapper always leaves `author` undefined; the row
> falls back to a neutral avatar plus a short user reference, and a freshly-posted comment
> shows the current user optimistically from the auth context (never from the mapper). The
> day the backend projects an author onto `ArticleCommentDto`, one mapper line fills it and
> the fallback path is dropped. Tracked in [12-comments.md](12-comments.md) and
> [19-open-questions.md](19-open-questions.md).

## `IArticleCommentPage` (new)

A page of comments plus the cursor the infinite query needs, mirroring `IArticlePage`.
`hasNextPage` is **derived** in the mapper from the DTO's `count`, so the hook never
recomputes it.

```ts
/**
 * IArticleCommentPage
 *
 * @description
 * One page of an article's comments plus the cursor needed to request the next page.
 * `hasNextPage` is derived by the mapper from the total `count` and the current index.
 *
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

## Mappers

`ArticlesMapper` already exposes `articleSummaryFromDto`, `articlePageFromDto`,
`tagFromDto`, `categoryFromDto`, and `promotionFeedFromDto`. The detail page adds four
functions and reuses `tagFromDto` and the author mapping.

### `articleImageFromDto`

Maps one `ArticleImageDto`, dropping `storageKey` and lowercasing `imageType`.

```ts
static articleImageFromDto(dto: ArticleImageDto): IArticleImage {
    return {
        id: dto.id,
        url: dto.url,
        type: dto.imageType === "Cover" ? "cover" : "body"
    };
}
```

### `articleDetailFromDto`

Maps the full detail projection. It reuses `tagFromDto` and `articleImageFromDto` for the
nested lists, maps the nullable `author` to `IArticleAuthor` (or `null`), and defaults the
counts to `0`.

```ts
static articleDetailFromDto(dto: ArticleDetailDto): IArticleDetailEntity {
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

### `articleCommentFromDto`

Maps one comment. The `author` projection is intentionally **not** set — the DTO does not
carry it — so it stays `undefined`.

```ts
static articleCommentFromDto(dto: ArticleCommentDto): IArticleCommentEntity {
    return {
        id: dto.id,
        userId: dto.userId,
        body: dto.body ?? null,
        isDeleted: dto.isDeleted,
        createdAt: dto.createdAt ?? null
    };
}
```

### `articleCommentPageFromDto`

Maps the paginated envelope and derives `hasNextPage`, exactly like `articlePageFromDto`.

```ts
static articleCommentPageFromDto(dto: ArticleCommentDtoPaginatedResult): IArticleCommentPage {
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

## Why these choices

- **Lowercased image type.** Components read a plain `"cover" | "body"` union rather than
  the DTO's PascalCase, so the discriminant is checked one way across the codebase.
- **Derive `hasNextPage` in the mapper, not the hook.** The domain entity is the single
  place that understands the zero-based `pageIndex` / total `count` contract; the infinite
  query's `getNextPageParam` just reads `page.hasNextPage`. If the backend later returns an
  explicit `hasNextPage`, only the mapper changes. This mirrors `articlePageFromDto`.
- **Author stays two fields.** `AuthorDto.email` / `role` are carried through the DTO but
  not mapped — the byline needs only `userName` + `avatarUrl`, and reusing `IArticleAuthor`
  keeps the summary and detail bylines identical.
- **Comment `author` is designed-for, never fabricated by the mapper.** The mapper reflects
  exactly what the backend sends. The optimistic current-user byline for a just-posted
  comment is a presentation-layer concern (the mutation hook), not a mapping concern.

See [14-state-management-and-hooks.md](14-state-management-and-hooks.md) for the hooks that
consume these entities, and [specs/01-domain-and-mappers.md](specs/01-domain-and-mappers.md)
/ [specs/02-repository-and-usecases.md](specs/02-repository-and-usecases.md) for the
implementation-ready snippets.
