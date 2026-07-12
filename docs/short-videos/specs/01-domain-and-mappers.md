# Spec 01 — Domain & Mappers

Design ref: [../03-domain-and-module.md](../03-domain-and-module.md). New work. The frontend
entity shape + the stateless mapper with list/page helpers.

---

## 1. `IShortVideoEntity`

`src/modules/shorts/domain/entities/IShortVideoEntity.ts`

```ts
/**
 * IShortVideoEntity
 *
 * @description
 * A short video as the public frontend consumes it. `videoUrl` is a direct
 * Cloudinary file URL (not YouTube); the DTO carries no per-user like flag, so
 * liked state is tracked in the player, not on the entity.
 *
 * @interface IShortVideoEntity
 *
 * @property {string} id - Short UUID; the interaction routes key off this.
 * @property {string} title - Display title / caption.
 * @property {string} slug - Public permalink slug.
 * @property {string | null} videoUrl - Cloudinary file URL, or null while unresolved.
 * @property {string | null} thumbnailUrl - Poster URL, or null.
 * @property {boolean} hasFullVideo - Whether a parent full video exists.
 * @property {number} viewCount - Cached view count.
 * @property {number} likeCount - Cached like count baseline.
 * @property {number} shareCount - Cached share count baseline.
 * @property {string | null} authorName - Uploading editor's display name, or null.
 */
export interface IShortVideoEntity {
    id: string;
    title: string;
    slug: string;
    videoUrl: string | null;
    thumbnailUrl: string | null;
    hasFullVideo: boolean;
    viewCount: number;
    likeCount: number;
    shareCount: number;
    authorName: string | null;
}
```

## 2. `IShortVideoPage`

`src/modules/shorts/domain/entities/IShortVideoPage.ts`

```ts
import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";

/**
 * IShortVideoPage
 *
 * @description
 * A paginated page of shorts. `hasNextPage` is derived from the total count and
 * the current page index, so the infinite feed can page without a cursor.
 *
 * @interface IShortVideoPage
 *
 * @property {IShortVideoEntity[]} items - The shorts on this page.
 * @property {number} pageIndex - Zero-based index of this page.
 * @property {number} pageSize - Requested page size.
 * @property {number} count - Total active shorts across all pages.
 * @property {boolean} hasNextPage - Whether a further page exists.
 */
export interface IShortVideoPage {
    items: IShortVideoEntity[];
    pageIndex: number;
    pageSize: number;
    count: number;
    hasNextPage: boolean;
}
```

## 3. `ShortsMapper`

`src/modules/shorts/infrastructure/mappers/shorts.mapper.ts`

```ts
import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";
import type { IShortVideoPage } from "@/modules/shorts/domain/entities/IShortVideoPage";
import type {
    ShortVideoDto,
    ShortVideoDtoPaginatedResult
} from "@/shared/infrastructure/api/generated/116.api";

/**
 * Mapper converting short-video API DTOs to domain entities.
 *
 * @description
 * Stateless pure transforms in the infrastructure layer. Normalizes nullable
 * URLs and counts, and derives page metadata; owns list and page mapping so call
 * sites never map inline.
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
            viewCount: dto.viewCount ?? 0,
            likeCount: dto.likeCount ?? 0,
            shareCount: dto.shareCount ?? 0,
            authorName: dto.author?.userName ?? null
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
     * Maps a paginated ShortVideoDto result to an IShortVideoPage, deriving
     * hasNextPage from the total count and the current page index.
     *
     * @param dto - Paginated envelope from getPublicShorts.
     * @returns {IShortVideoPage} Mapped short page entity.
     */
    shortPageFromDto(dto: ShortVideoDtoPaginatedResult): IShortVideoPage {
        return {
            items: ShortsMapper.shortListFromDto(dto.items),
            pageIndex: dto.pageIndex,
            pageSize: dto.pageSize,
            count: dto.count,
            hasNextPage: (dto.pageIndex + 1) * dto.pageSize < dto.count
        };
    }
} as const;
```

---

## Tasks

- [ ] `IShortVideoEntity` created with normalized nullables; no `isLiked` field.
- [ ] `IShortVideoPage` created; `hasNextPage` derivation matches `VideosMapper.videoPageFromDto`.
- [ ] `ShortsMapper` with `shortFromDto` / `shortListFromDto` / `shortPageFromDto`; `as const`.
- [ ] `authorName` maps from `dto.author?.userName ?? null`.
- [ ] No call site maps a short list inline (`shortListFromDto` owns it).
- [ ] `tsc` + biome clean.
</content>
