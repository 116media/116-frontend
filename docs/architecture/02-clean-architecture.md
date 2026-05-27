# Clean Architecture Layers

## Overview

The frontend uses the same Clean Architecture approach as the dashboard and mobile apps. The dependency rule is strict: inner layers never depend on outer layers.

```text
Domain (innermost)
  <- Application
    <- Infrastructure
      <- Presentation (outermost)
```

## Layer Responsibilities

### Domain Layer

The domain layer defines entities and types. No dependencies on any framework or library.

```text
modules/articles/domain/
  entities/
    IArticleEntity.ts           # Full article with body, images, tags
    IArticleSummaryEntity.ts    # Lightweight for list views
    IArticleCommentEntity.ts    # Comment with author info
```

Example entity:

```typescript
import type { IAuthorEntity } from "@/shared/domain/entities/IAuthorEntity";
import type { ITagEntity } from "@/shared/domain/entities/ITagEntity";

export interface IArticleEntity {
    id: string;
    slug: string;
    title: string;
    headline: string;
    body: string;
    coverImageUrl: string;
    categoryName: string;
    author?: IAuthorEntity | null;
    tags: ITagEntity[];
    readTimeInMinutes: number;
    isFeatured: boolean;
    publishedAt?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
}
```

### Application Layer

Defines repository ports (interfaces) and use cases. Depends only on the domain layer.

```text
modules/articles/application/
  repositories/
    articles.repository.port.ts   # Interface for data access
  usecases/
    getarticlebyslug.usecase.ts
    getpublishedarticles.usecase.ts
    getfeaturedarticles.usecase.ts
```

Repository port:

```typescript
import type { IArticleEntity } from "@/modules/articles/domain/entities/IArticleEntity";
import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import type { Result } from "@/shared/domain/results/result";
import type { IPaginatedResult } from "@/shared/domain/types/pagination";

export interface IArticlesRepositoryPort {
    getPublishedArticles(params: {
        pageIndex: number;
        pageSize: number;
        search?: string;
        categoryId?: string;
    }): Promise<Result<IPaginatedResult<IArticleSummaryEntity>>>;

    getArticleBySlug(slug: string): Promise<Result<IArticleEntity>>;

    getFeaturedArticles(): Promise<Result<IArticleSummaryEntity[]>>;
}
```

### Infrastructure Layer

Implements the repository ports by calling the generated API client. Also handles DTO-to-entity mapping.

```text
modules/articles/infrastructure/
  repositories/
    articles.repository.impl.ts
  mappers/
    articles.mapper.ts
  dependencies/
    articles.dependencies.ts      # DI registration
```

Repository implementation:

```typescript
import type { IArticlesRepositoryPort } from "@/modules/articles/application/repositories/articles.repository.port";
import { ArticlesMapper } from "@/modules/articles/infrastructure/mappers/articles.mapper";
import type { Result } from "@/shared/domain/results/result";
import { ok, err } from "@/shared/domain/results/result";
import { apiClient } from "@/shared/infrastructure/api/client";
import { ProblemMapper } from "@/shared/infrastructure/mappers/problem.mapper";

export class ArticlesRepositoryImpl implements IArticlesRepositoryPort {
    async getArticleBySlug(slug: string): Promise<Result<IArticleEntity>> {
        try {
            const response = await apiClient.api.getArticleBySlug(slug);
            return ok(ArticlesMapper.articleFromDto(response.data.article));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }
}
```

### Presentation Layer

React components, hooks, and containers. For the frontend, this layer has a key distinction from the dashboard: most containers are **Server Components** that fetch data directly.

```text
modules/articles/presentation/
  containers/
    ArticleListContainer.tsx      # Server Component (fetches data)
    ArticleDetailContainer.tsx    # Server Component
  components/
    ArticleCard/                  # Client Component (interactive)
    ArticleBody/                  # Client Component (rich content)
    ArticleComments/              # Client Component (user interaction)
  hooks/
    useArticleLike.ts             # Client-side mutation hook
    useArticleComments.ts         # Client-side data + mutations
```

## Shared Layer

Cross-cutting code shared across all modules:

```text
shared/
  domain/
    entities/
      IAuthorEntity.ts
      ITagEntity.ts
    types/
      pagination.ts               # IPaginatedResult
      action.response.ts          # IActionResponse
    results/
      result.ts                   # Result<T> type (Ok | Err)
    failures/
      failure.ts                  # Failure, ServerFailure types
  application/
    usecases/
      IUseCase.ts                 # IUseCase, IResultUseCase interfaces
  infrastructure/
    api/
      client.ts                   # Axios instance config
      generated/
        116.api.ts                # swagger-typescript-api output
    mappers/
      problem.mapper.ts           # Error normalization
    constants/
      api.errors.ts               # Error code to message mapping
  presentation/
    components/                   # shadcn/ui wrappers and shared UI
    hooks/                        # useMediaQuery, useDebounce, etc.
    layouts/                      # Header, Footer, Sidebar
    providers/                    # ThemeProvider, QueryProvider, AuthProvider, AuthDialogProvider
    styles/                       # globals.css, CSS variables
    utils/                        # formatDate, slugify, truncate
```

## Key Difference from Dashboard

The dashboard uses Redux Toolkit for everything because it is a client-side SPA where all data flows through a global store. The frontend takes a different approach because Next.js Server Components change what needs to be on the client:

1. **Read operations** (articles list, video detail) happen in Server Components with no client-side state at all
2. **Mutations** (like, comment, bookmark) use React Query on the client for optimistic updates and cache invalidation
3. **Auth state** (current user + auth modal) uses two small React Context providers, no Redux
4. **Auth forms** (login, signup, forgot password) are modals, not pages. The `AuthDialogProvider` context lets any component trigger the login modal with `openAuth("LOGIN")`

No Redux, no Redux Persist, no additional state management libraries. React Query handles data, React Context handles auth. This is explained in detail in [React Query + React Context](../data-fetching/01-react-query-vs-redux.md).
