# Dependency Injection

## Why Awilix

The frontend uses **Awilix** for dependency injection, same as the dashboard. The two main reasons:

1. **Circular dependencies.** Without a container, module A imports module B's repository, and module B imports module A's repository. Node resolves this as `undefined` at import time, causing cryptic runtime errors. Awilix breaks the cycle because nothing is imported directly. Everything is resolved lazily from the container.

2. **No manual instantiation everywhere.** Without DI, you end up writing `const articlesRepository = new ArticlesRepositoryImpl()` in every file that needs it. If `ArticlesRepositoryImpl` changes its constructor signature (new dependency added), every call site breaks. With Awilix, the container handles construction. You register once, resolve everywhere.

## The Server vs Client Problem

The frontend has a challenge the dashboard does not: Server Components and Client Components run in different environments.

**Client Components** (browser): A single Awilix container works perfectly. The browser API client uses HttpOnly cookies automatically. No per-request state. Singleton repositories are shared across the app lifetime, same as the dashboard.

**Server Components** (Node.js): Each incoming request needs its own API client with cookies from that specific request. A singleton repository cannot hold a per-request API client because the singleton is shared across all users hitting the same server process.

Awilix solves this with **scoped containers** (`createScope()`). A scope inherits all parent registrations but can override specific ones with per-request values. When the scope is garbage collected, so are its overrides.

## Setup

One root container with the browser API client as default. Server Components create a scope per request that overrides the API client with one that carries the request cookies.

```typescript
// src/shared/infrastructure/service.locator.ts
import { createContainer, asClass, asValue, InjectionMode } from "awilix";
import { browserApiClient } from "@/shared/infrastructure/api/client";
import { registerArticlesDependencies } from "@/modules/articles/infrastructure/dependencies/articles.dependencies";
import { registerVideosDependencies } from "@/modules/videos/infrastructure/dependencies/videos.dependencies";
// ... other module registrations

interface Cradle {
    // API client (browser default, overridden in server scopes)
    apiClient: Api;

    // Repositories
    articlesRepository: IArticlesRepositoryPort;
    videosRepository: IVideosRepositoryPort;
    shortsRepository: IShortsRepositoryPort;
    lyricsRepository: ILyricsRepositoryPort;
    catalogRepository: ICatalogRepositoryPort;
    authRepository: IAuthRepositoryPort;
    playlistsRepository: IPlaylistsRepositoryPort;
}

const container = createContainer<Cradle>({
    injectionMode: InjectionMode.PROXY,
    strict: true,
});

// Register the browser API client as the default
container.register({
    apiClient: asValue(browserApiClient),
});

registerArticlesDependencies(container);
registerVideosDependencies(container);
registerShortsDependencies(container);
registerLyricsDependencies(container);
registerCatalogDependencies(container);
registerAuthDependencies(container);
registerPlaylistsDependencies(container);

export default container;
```

## Module Registration

Each module registers its own dependencies. Repositories are **scoped** so they pick up the correct API client from whichever scope resolves them:

```typescript
// src/modules/articles/infrastructure/dependencies/articles.dependencies.ts
import type { AwilixContainer } from "awilix";
import { asClass } from "awilix";
import { ArticlesRepositoryImpl } from "@/modules/articles/infrastructure/repositories/articles.repository.impl";

export function registerArticlesDependencies(container: AwilixContainer): void {
    container.register({
        articlesRepository: asClass(ArticlesRepositoryImpl).scoped(),
    });
}
```

The repository receives the API client from the container cradle via constructor injection:

```typescript
// src/modules/articles/infrastructure/repositories/articles.repository.impl.ts
export class ArticlesRepositoryImpl implements IArticlesRepositoryPort {
    private readonly apiClient: Api;

    constructor({ apiClient }: { apiClient: Api }) {
        this.apiClient = apiClient;
    }

    async getArticleBySlug(slug: string): Promise<Result<IArticleEntity>> {
        try {
            const response = await this.apiClient.api.getArticleBySlug(slug);
            return ok(ArticlesMapper.articleFromDto(response.data.article));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }
}
```

When resolved from the root container, it gets the browser API client. When resolved from a scoped container, it gets the server API client with cookies from that request.

## Usage in Client Components (React Query Hooks)

Client Components resolve from the root container. The browser API client sends HttpOnly cookies automatically.

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import container from "@/shared/infrastructure/service.locator";

export function usePublishedArticles(categoryId?: string) {
    return useQuery({
        queryKey: ["articles", categoryId],
        queryFn: async () => {
            const result = await container.cradle.articlesRepository.getPublishedArticles({
                pageIndex: 0,
                pageSize: 12,
                categoryId,
            });
            if (!result.ok) throw result.error;
            return result.value;
        },
    });
}
```

## Usage in Server Components (Scoped Container)

Server Components create a scope that overrides the API client with a server-side instance carrying the request cookies:

```typescript
// src/shared/infrastructure/api/server-scope.ts
import { asValue } from "awilix";
import { cookies } from "next/headers";
import container from "@/shared/infrastructure/service.locator";
import { Api } from "@/shared/infrastructure/api/generated/116.api";

export async function createServerScope() {
    const cookieStore = await cookies();
    const scope = container.createScope();

    const serverClient = new Api({
        baseURL: process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL,
        headers: {
            Cookie: cookieStore.toString(),
            "Accept-Language": "fr",
        },
    });

    scope.register({
        apiClient: asValue(serverClient),
    });

    return scope;
}
```

Then in a Server Component:

```typescript
// Server Component
import { createServerScope } from "@/shared/infrastructure/api/server-scope";

export default async function ArticleDetailContainer({ slug }: { slug: string }) {
    const scope = await createServerScope();
    const result = await scope.cradle.articlesRepository.getArticleBySlug(slug);

    if (!result.ok) notFound();

    return <ArticleDetail article={result.value} />;
}
```

The scoped container returns a new `ArticlesRepositoryImpl` that receives the server API client with cookies from this specific request. The scope is garbage collected when the Server Component finishes rendering. No state leaks between requests.

## How It All Fits Together

```text
Root Container
  apiClient = browserApiClient (default for Client Components)
  articlesRepository = scoped (gets apiClient from whatever scope resolves it)
  videosRepository = scoped
  ...

Client Component resolves from root:
  container.cradle.articlesRepository
    -> new ArticlesRepositoryImpl({ apiClient: browserApiClient })
    -> browser sends HttpOnly cookies automatically

Server Component creates scope:
  scope = container.createScope()
  scope.register({ apiClient: asValue(serverClientWithCookies) })
  scope.cradle.articlesRepository
    -> new ArticlesRepositoryImpl({ apiClient: serverClientWithCookies })
    -> uses cookies forwarded from the incoming request
```

## Deduplicating Scopes per Request

Multiple Server Components rendering in the same request should share the same scope. Use React's `cache()` function:

```typescript
import { cache } from "react";
import { createServerScope } from "@/shared/infrastructure/api/server-scope";

// Cached per request: multiple Server Components in the same render
// share the same scope and the same API client with cookies
export const getServerScope = cache(async () => {
    return createServerScope();
});
```

Then in Server Components:

```typescript
export default async function ArticleDetailContainer({ slug }: { slug: string }) {
    const scope = await getServerScope();
    const result = await scope.cradle.articlesRepository.getArticleBySlug(slug);
    // ...
}

// generateMetadata and the page component both call getServerScope()
// but only one scope is created per request
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const scope = await getServerScope();
    const result = await scope.cradle.articlesRepository.getArticleBySlug(params.slug);
    // ...
}
```

## Difference from Dashboard

The dashboard is a client-side SPA. One container, one API client, singletons everywhere. The frontend adds scoped containers for server-side rendering.

| What | Dashboard | Frontend |
| --- | --- | --- |
| Container | Root only | Root + per-request scopes |
| Repositories | `singleton()` | `scoped()` |
| API client | One (browser) | Two (browser + server per request) |
| Use cases | `asClass(...).transient()` | Not needed (React Query replaces thunks) |

## Testing with Awilix

Create a test scope with mock overrides:

```typescript
import container from "@/shared/infrastructure/service.locator";
import { asValue } from "awilix";

function createTestScope(overrides: Record<string, unknown> = {}) {
    const scope = container.createScope();
    for (const [key, value] of Object.entries(overrides)) {
        scope.register({ [key]: asValue(value) });
    }
    return scope;
}

test("getArticleBySlug returns article", async () => {
    const scope = createTestScope({
        apiClient: mockApiClient,
    });

    const result = await scope.cradle.articlesRepository.getArticleBySlug("test-slug");
    expect(result.ok).toBe(true);
});
```

Or use MSW (Mock Service Worker) to intercept HTTP requests at the network level, which tests the full stack including the repository and mapper without touching the container.
