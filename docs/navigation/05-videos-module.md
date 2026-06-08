# Videos Module

## Overview

The videos module mirrors the articles module structure exactly. It owns all video-related domain entities, mappers, repository, and presentation components, including the videos mega menu. Video categories are fetched independently using the `"Video"` content type name — no shared code with the articles module.

Data for the mega menu is fetched server-side in the root layout and passed down as props — there are no client-side hooks for data fetching. See [Server Prefetch](09-server-prefetch.md) for the full fetch strategy.

## Directory Structure

```text
src/modules/videos/
  domain/
    entities/
      IVideoSummaryEntity.ts        ← light entity for list/card rendering
      IVideoCategoryEntity.ts       ← video-scoped category
      IVideoPopularTagEntity.ts     ← popular tag scoped to video content type
  infrastructure/
    mappers/
      video.mapper.ts               ← VideoSummaryDto → IVideoSummaryEntity
      video-category.mapper.ts      ← CategoryDto → IVideoCategoryEntity
      video-popular-tag.mapper.ts   ← TagDto → IVideoPopularTagEntity
    repositories/
      videos.repository.impl.ts    ← calls the API, returns domain entities
  presentation/
    components/
      VideosMegaMenu/
        index.tsx                   ← root component, consumed by DesktopNav
        VideosMegaCategoryList.tsx
        VideosPromotedCard.tsx
        VideosMegaTagList.tsx
        types.ts
```

Note: there is no `hooks/` folder in the videos module. Data arrives as props from the layout.

## Domain Entities

### IVideoSummaryEntity

```typescript
// src/modules/videos/domain/entities/IVideoSummaryEntity.ts
export interface IVideoSummaryEntity {
    id: string;
    categoryId: string;
    categoryName: string;
    title: string;
    slug: string;
    thumbnailUrl: string | null;
    youtubeVideoUrl: string | null;
    isPromoted: boolean;
    publishedAt: string | null;
}
```

`youtubeVideoUrl` is included to allow a play icon or YouTube link in the card. `HasLyrics` and `ShootingScheduledAt` from the DTO are dropped — not relevant for navigation cards.

### IVideoCategoryEntity

Identical shape to `IArticleCategoryEntity`. Kept separate so each module can evolve independently.

```typescript
// src/modules/videos/domain/entities/IVideoCategoryEntity.ts
export interface IVideoCategoryEntity {
    id: string;
    name: string;
    slug: string;
    description: string;
    isFree: boolean;
}
```

### IVideoPopularTagEntity

Popular tags scoped to the videos content type. Lives in the videos module because the videos mega menu fetches tags filtered by `contentType=Video` — it does not share a tag list with the articles panel.

```typescript
// src/modules/videos/domain/entities/IVideoPopularTagEntity.ts
export interface IVideoPopularTagEntity {
    id: string;
    name: string;
    slug: string;
}
```

## Infrastructure Mappers

### video.mapper.ts

```typescript
// src/modules/videos/infrastructure/mappers/video.mapper.ts
import type { VideoSummaryDto } from "@/shared/infrastructure/api/generated/116.api";
import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";

/**
 * mapVideoSummary
 *
 * @description
 * Maps a VideoSummaryDto from the generated API client to the
 * IVideoSummaryEntity domain interface. Drops AuthorId, Status,
 * HasLyrics, ShootingScheduledAt, and audit fields.
 */
export function mapVideoSummary(dto: VideoSummaryDto): IVideoSummaryEntity {
    return {
        id: dto.id,
        categoryId: dto.categoryId,
        categoryName: dto.categoryName,
        title: dto.title,
        slug: dto.slug,
        thumbnailUrl: dto.thumbnailUrl ?? null,
        youtubeVideoUrl: dto.youtubeVideoUrl ?? null,
        isPromoted: dto.isPromoted,
        publishedAt: dto.publishedAt ?? null
    };
}
```

### video-category.mapper.ts

```typescript
// src/modules/videos/infrastructure/mappers/video-category.mapper.ts
import type { CategoryDto } from "@/shared/infrastructure/api/generated/116.api";
import type { IVideoCategoryEntity } from "@/modules/videos/domain/entities/IVideoCategoryEntity";

/**
 * mapVideoCategory
 *
 * @description
 * Maps a CategoryDto to IVideoCategoryEntity.
 * Drops contentTypeId, contentTypeName, isActive, and pricing.
 */
export function mapVideoCategory(dto: CategoryDto): IVideoCategoryEntity {
    return {
        id: dto.id,
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        isFree: dto.isFree
    };
}
```

### video-popular-tag.mapper.ts

```typescript
// src/modules/videos/infrastructure/mappers/video-popular-tag.mapper.ts
import type { TagDto } from "@/shared/infrastructure/api/generated/116.api";
import type { IVideoPopularTagEntity } from "@/modules/videos/domain/entities/IVideoPopularTagEntity";

/**
 * mapVideoPopularTag
 *
 * @description
 * Maps a TagDto from the popular tags endpoint (filtered by contentType=Video)
 * to IVideoPopularTagEntity. Drops usage counts and audit fields.
 */
export function mapVideoPopularTag(dto: TagDto): IVideoPopularTagEntity {
    return {
        id: dto.id,
        name: dto.name,
        slug: dto.slug
    };
}
```

## Repository

These functions are called server-side from the root layout — they use `createServerApiClient()`, not the browser `apiClient`.

```typescript
// src/modules/videos/infrastructure/repositories/videos.repository.impl.ts
import { createServerApiClient } from "@/shared/infrastructure/api/server-client";
import { mapVideoSummary } from "../mappers/video.mapper";
import { mapVideoCategory } from "../mappers/video-category.mapper";
import { mapVideoPopularTag } from "../mappers/video-popular-tag.mapper";
import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";
import type { IVideoCategoryEntity } from "@/modules/videos/domain/entities/IVideoCategoryEntity";
import type { IVideoPopularTagEntity } from "@/modules/videos/domain/entities/IVideoPopularTagEntity";

const VIDEO_CONTENT_TYPE_NAME = "Video";
const PROMOTED_VIDEOS_LIMIT = 4;
const POPULAR_TAGS_LIMIT = 10;

/**
 * getPromotedVideosForMenu
 *
 * @description
 * Returns up to 4 promoted published videos for the mega menu panel.
 * The backend orders results by PublishedAt DESC — newest first — with no
 * server-side limit, so the frontend slices to PROMOTED_VIDEOS_LIMIT (4).
 * Called server-side from the root layout.
 */
export async function getPromotedVideosForMenu(): Promise<IVideoSummaryEntity[]> {
    const api = await createServerApiClient();
    const response = await api.api.getPromotedVideos();
    return response.data.videos
        .slice(0, PROMOTED_VIDEOS_LIMIT)
        .map(mapVideoSummary);
}

/**
 * getVideoCategoriesForMenu
 *
 * @description
 * Resolves the Video content type GUID, then fetches all active
 * categories scoped to that type.
 * Called server-side from the root layout.
 */
export async function getVideoCategoriesForMenu(): Promise<IVideoCategoryEntity[]> {
    const api = await createServerApiClient();
    const typesResponse = await api.api.publicGetAllContentTypes();
    const videoType = typesResponse.data.contentTypes.find(
        (ct) => ct.name === VIDEO_CONTENT_TYPE_NAME
    );

    if (!videoType) return [];

    const categoriesResponse = await api.api.publicGetActiveCategories({
        contentTypeId: videoType.id
    });

    return categoriesResponse.data.categories.map(mapVideoCategory);
}

/**
 * getVideoPopularTagsForMenu
 *
 * @description
 * Returns the top 10 popular tags scoped to the Video content type.
 * Passes contentType=Video so the backend only counts video usage —
 * the videos mega menu shows video-specific tag popularity.
 * Called server-side from the root layout.
 */
export async function getVideoPopularTagsForMenu(): Promise<IVideoPopularTagEntity[]> {
    const api = await createServerApiClient();
    const response = await api.api.publicGetPopularTags({
        limit: POPULAR_TAGS_LIMIT,
        contentType: VIDEO_CONTENT_TYPE_NAME
    });
    return response.data.tags.map(mapVideoPopularTag);
}
```
