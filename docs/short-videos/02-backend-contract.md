# 02 — Backend Contract

The complete public surface the frontend consumes. All routes are under
`/api/v1/public/shorts`. Reads and share/view are anonymous; like/bookmark require an
authenticated Visitor. There is **no comment capability**.

---

## Read endpoints

| Purpose | Method · Route | Auth | Query / Path | Response |
|---|---|---|---|---|
| Paged list | `GET /api/v1/public/shorts` | Anonymous (optional user) | `pageIndex` (default 0), `pageSize` (default 10), `search?` | `PublicGetPublicShortsResponse` |
| For-you feed (cursor) | `GET /api/v1/public/shorts/feed` | Anonymous (optional user) | `cursor?`, `pageSize` (default 10, max 20) | `PublicGetShortsFeedResponse` |
| By slug | `GET /api/v1/public/shorts/{slug}` | Anonymous (optional user) | `slug` | `PublicGetPublicShortBySlugResponse` |

The **for-you feed** is the recommended surface for the vertical player: a cursor-paginated,
**seeded pseudo-random** ordering that is stable within a cursor session (no page drift, no
repeats). Omit `cursor` to start a fresh randomized session — the response returns a
`nextCursor`; pass it back for the next page; a `null` `nextCursor` means the feed is
exhausted (restart with no cursor to reshuffle). The **paged list** (`pageIndex`) remains for
the homepage strip and title search. All three reads accept an optional bearer token and, when
present, resolve the caller's `isLiked` / `isBookmarked` flags.

## Interaction endpoints

| Action | Method · Route | Auth | Body | Response |
|---|---|---|---|---|
| Like | `POST /shorts/{id}/likes` | Visitor | — | `{ isSuccess }` |
| Unlike | `DELETE /shorts/{id}/likes` | Visitor | — | `{ isSuccess }` |
| Bookmark | `POST /shorts/{id}/bookmarks` | Visitor | — | `{ isSuccess }` |
| Unbookmark | `DELETE /shorts/{id}/bookmarks` | Visitor | — | `{ isSuccess }` |
| Share | `POST /shorts/{id}/shares` | Anonymous | `{ shareChannel?: string }` | `{ isSuccess }` |
| Record view | `POST /shorts/{id}/views` | Anonymous | — (headers) | `{ isSuccess, isCounted }` |

Notes:

- `{id}` is the short's **UUID**, not the slug. `{slug}` is only for the by-slug read.
- **Like/Bookmark** return `409 Conflict` on a repeat (already liked/bookmarked);
  Unlike/Unbookmark return `400` when there is nothing to remove. The UI never issues a
  redundant call because the icon already reflects state.
- **Share** accepts an optional `shareChannel`; unknown values are ignored server-side
  (recorded as null), not rejected. Values: `facebook`, `x`, `whatsapp`, `clipboard`,
  `webshare` (case-insensitive). This matches the article/video share flow.
- **Record view** reads `X-Device-Id` (sent by the existing `deviceIdInterceptor`), the
  client IP, and `User-Agent` for per-viewer dedup; `isCounted=false` when the same
  identity already counted a view in the dedup window. See
  [08-view-counting.md](08-view-counting.md).

---

## The DTO

`ShortVideoDto` (generated in `src/shared/infrastructure/api/generated/116.api.ts`):

```ts
export interface ShortVideoDto {
    id: string;
    title: string;
    slug: string;
    videoUrl?: string | null;       // direct Cloudinary FILE url (not YouTube)
    thumbnailUrl?: string | null;   // poster; auto-generated from the video if unset
    videoId?: string | null;        // optional parent full video
    hasFullVideo: boolean;
    isActive: boolean;
    viewCount: number;
    likeCount: number;
    shareCount: number;
    bookmarkCount: number;
    authorId: string;
    author?: AuthorDto | null;
    isLiked: boolean;               // per-viewer; false when anonymous
    isBookmarked: boolean;          // per-viewer; false when anonymous
    createdAt?: string | null;
    updatedAt?: string | null;
    createdBy?: string | null;
    updatedBy?: string | null;
}

export interface ShortVideoDtoPaginatedResult {
    pageIndex: number;
    pageSize: number;
    count: number;
    items: ShortVideoDto[];
}

export interface PublicGetPublicShortsResponse { shortVideos: ShortVideoDtoPaginatedResult; }
export interface PublicGetShortsFeedResponse { items: ShortVideoDto[]; nextCursor?: string | null; }
export interface PublicGetPublicShortBySlugResponse { shortVideo: ShortVideoDto; }
export interface PublicShareShortVideoRequest { shareChannel?: string | null; }
export interface PublicRecordShortVideoViewResponse { isSuccess: boolean; isCounted: boolean; }
```

Two facts the frontend must design around:

- **`isLiked` / `isBookmarked` are per-viewer.** All three reads resolve them for the
  authenticated caller (false when anonymous), so the player seeds the like heart from
  `isLiked` and reflects a prior like on load — no session-local guessing.
- **No `commentCount`, no comment endpoints.** Shorts are not commentable.

Video source is a **file**: `videoUrl` points at a Cloudinary MP4/MOV/WebM, played through a
Plyr file source (HTML5 `<video>`), not a YouTube embed. `thumbnailUrl` is the poster.

---

## Generated client methods

All on the shared `Api` client (`container.cradle` resolves the repository that wraps
these):

```ts
getPublicShorts(query?: { pageIndex?; pageSize?; search? })   // feed
getPublicShortBySlug(slug: string)                            // by-slug
publicLikeShortVideo(id: string)                              // POST likes
publicUnlikeShortVideo(id: string)                            // DELETE likes
publicBookmarkShortVideo(id: string)                          // POST bookmarks
publicUnbookmarkShortVideo(id: string)                        // DELETE bookmarks
publicShareShortVideo(id: string, data: { shareChannel? })    // POST shares
publicRecordShortVideoView(id: string)                        // POST views
```

The repository layer ([03-domain-and-module.md](03-domain-and-module.md)) wraps each in
`try/catch`, returning `Result<T>` and never throwing.
</content>
