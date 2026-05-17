# Articles Module

## Overview

The articles module owns everything related to articles: domain entities, infrastructure mappers, repository, and presentation components. The mega menu is one slice of this module's presentation layer.

Data for the mega menu is fetched server-side in the root layout and passed down as props — there are no client-side hooks for data fetching. See [Server Prefetch](09-server-prefetch.md) for the full fetch strategy.

## Directory Structure

```text
src/modules/articles/
  domain/
    entities/
      IArticleSummaryEntity.ts      ← light entity for list/card rendering
      IArticleCategoryEntity.ts     ← article-scoped category (no contentTypeId)
      IArticlePopularTagEntity.ts   ← popular tag scoped to article content type
  infrastructure/
    mappers/
      article.mapper.ts             ← ArticleSummaryDto → IArticleSummaryEntity
      article-category.mapper.ts    ← CategoryDto → IArticleCategoryEntity
      article-popular-tag.mapper.ts ← TagDto → IArticlePopularTagEntity
    repositories/
      articles.repository.impl.ts  ← calls the API, returns domain entities
  presentation/
    components/
      ArticlesMegaMenu/
        index.tsx                   ← root component, consumed by DesktopNav
        ArticlesMegaCategoryList.tsx
        ArticlesPromotedCard.tsx
        ArticlesMegaTagList.tsx
        types.ts
```

Note: there is no `hooks/` folder in the articles module. Data arrives as props from the layout.

## Domain Entities

### IArticleSummaryEntity

Only the fields needed for card rendering. Backend fields like `AuthorId`, `Status`, and audit timestamps are dropped.

```typescript
// src/modules/articles/domain/entities/IArticleSummaryEntity.ts
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
}
```

### IArticleCategoryEntity

Represents a category scoped to the articles content type. The `contentTypeId` field is not carried through — it is only used at the repository layer to filter the API call.

```typescript
// src/modules/articles/domain/entities/IArticleCategoryEntity.ts
export interface IArticleCategoryEntity {
    id: string;
    name: string;
    slug: string;
    description: string;
    isFree: boolean;
}
```

### IArticlePopularTagEntity

Popular tags scoped to the articles content type. Lives in the articles module because the articles mega menu fetches tags filtered by `contentType=Article` — it does not share a tag list with the videos panel.

```typescript
// src/modules/articles/domain/entities/IArticlePopularTagEntity.ts
export interface IArticlePopularTagEntity {
    id: string;
    name: string;
    slug: string;
}
```

## Infrastructure Mappers

### article.mapper.ts

```typescript
// src/modules/articles/infrastructure/mappers/article.mapper.ts
import type { ArticleSummaryDto } from "@/shared/infrastructure/api/generated/116.api";
import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";

/**
 * mapArticleSummary
 *
 * @description
 * Maps an ArticleSummaryDto from the generated API client to the
 * IArticleSummaryEntity domain interface. Drops infrastructure-only
 * fields (AuthorId, Status, audit timestamps) that presentation
 * components do not need.
 */
export function mapArticleSummary(dto: ArticleSummaryDto): IArticleSummaryEntity {
    return {
        id: dto.id,
        categoryId: dto.categoryId,
        categoryName: dto.categoryName,
        title: dto.title,
        slug: dto.slug,
        headline: dto.headline,
        coverImageUrl: dto.coverImageUrl ?? null,
        isPromoted: dto.isPromoted,
        publishedAt: dto.publishedAt ?? null
    };
}
```

### article-category.mapper.ts

```typescript
// src/modules/articles/infrastructure/mappers/article-category.mapper.ts
import type { CategoryDto } from "@/shared/infrastructure/api/generated/116.api";
import type { IArticleCategoryEntity } from "@/modules/articles/domain/entities/IArticleCategoryEntity";

/**
 * mapArticleCategory
 *
 * @description
 * Maps a CategoryDto to IArticleCategoryEntity.
 * Drops contentTypeId, contentTypeName, isActive, and pricing — not
 * needed in the mega menu or category filter views.
 */
export function mapArticleCategory(dto: CategoryDto): IArticleCategoryEntity {
    return {
        id: dto.id,
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        isFree: dto.isFree
    };
}
```

### article-popular-tag.mapper.ts

```typescript
// src/modules/articles/infrastructure/mappers/article-popular-tag.mapper.ts
import type { TagDto } from "@/shared/infrastructure/api/generated/116.api";
import type { IArticlePopularTagEntity } from "@/modules/articles/domain/entities/IArticlePopularTagEntity";

/**
 * mapArticlePopularTag
 *
 * @description
 * Maps a TagDto from the popular tags endpoint (filtered by contentType=Article)
 * to IArticlePopularTagEntity. Drops usage counts and audit fields.
 */
export function mapArticlePopularTag(dto: TagDto): IArticlePopularTagEntity {
    return {
        id: dto.id,
        name: dto.name,
        slug: dto.slug
    };
}
```

## Repository

The repository resolves the Article content type GUID at runtime, then fetches categories, promoted articles, and popular article tags. These functions are called server-side from the root layout — they use `createServerApiClient()`, not the browser `apiClient`.

```typescript
// src/modules/articles/infrastructure/repositories/articles.repository.impl.ts
import { createServerApiClient } from "@/shared/infrastructure/api/server-client";
import { mapArticleSummary } from "../mappers/article.mapper";
import { mapArticleCategory } from "../mappers/article-category.mapper";
import { mapArticlePopularTag } from "../mappers/article-popular-tag.mapper";
import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import type { IArticleCategoryEntity } from "@/modules/articles/domain/entities/IArticleCategoryEntity";
import type { IArticlePopularTagEntity } from "@/modules/articles/domain/entities/IArticlePopularTagEntity";

const ARTICLE_CONTENT_TYPE_NAME = "Article";
const PROMOTED_ARTICLES_LIMIT = 4;
const POPULAR_TAGS_LIMIT = 10;

/**
 * getPromotedArticlesForMenu
 *
 * @description
 * Returns up to 4 promoted published articles for the mega menu panel.
 * The backend orders results by PublishedAt DESC — newest first — with no
 * server-side limit, so the frontend slices to PROMOTED_ARTICLES_LIMIT (4).
 * Called server-side from the root layout.
 */
export async function getPromotedArticlesForMenu(): Promise<IArticleSummaryEntity[]> {
    const api = await createServerApiClient();
    const response = await api.api.getPromotedArticles();
    return response.data.articles
        .slice(0, PROMOTED_ARTICLES_LIMIT)
        .map(mapArticleSummary);
}

/**
 * getArticleCategoriesForMenu
 *
 * @description
 * Resolves the Article content type GUID, then fetches all active
 * categories scoped to that type.
 * Called server-side from the root layout.
 */
export async function getArticleCategoriesForMenu(): Promise<IArticleCategoryEntity[]> {
    const api = await createServerApiClient();
    const typesResponse = await api.api.publicGetAllContentTypes();
    const articleType = typesResponse.data.contentTypes.find(
        (ct) => ct.name === ARTICLE_CONTENT_TYPE_NAME
    );

    if (!articleType) return [];

    const categoriesResponse = await api.api.publicGetActiveCategories({
        contentTypeId: articleType.id
    });

    return categoriesResponse.data.categories.map(mapArticleCategory);
}

/**
 * getArticlePopularTagsForMenu
 *
 * @description
 * Returns the top 10 popular tags scoped to the Article content type.
 * Passes contentType=Article so the backend only counts article usage —
 * the articles mega menu shows article-specific tag popularity.
 * Called server-side from the root layout.
 */
export async function getArticlePopularTagsForMenu(): Promise<IArticlePopularTagEntity[]> {
    const api = await createServerApiClient();
    const response = await api.api.publicGetPopularTags({
        limit: POPULAR_TAGS_LIMIT,
        contentType: ARTICLE_CONTENT_TYPE_NAME
    });
    return response.data.tags.map(mapArticlePopularTag);
}
```
