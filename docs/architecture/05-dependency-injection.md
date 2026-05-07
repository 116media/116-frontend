# Dependency Injection

## Dashboard vs Frontend

The dashboard uses Awilix (a full DI container) because it is a client-side SPA where repositories are singletons shared across the entire app lifetime.

The frontend does NOT need Awilix. Here is why:

- Server Components create a new request context per request. There is no long-lived singleton.
- Client Components use React Query which manages its own cache. No need for a singleton repository.
- The overhead of a DI container is not justified when you have 7 modules with 1 repository each.

## The Frontend Approach: Direct Instantiation

For Server Components, instantiate the repository directly:

```typescript
// Server Component
export async function ArticleListContainer() {
    const repository = new ArticlesRepositoryImpl();
    const result = await repository.getPublishedArticles({ pageIndex: 0, pageSize: 10 });
    // ...
}
```

For Client Components with React Query, create a shared instance per module:

```typescript
// src/modules/articles/infrastructure/repositories/index.ts
export const articlesRepository = new ArticlesRepositoryImpl();

// In a hook
import { articlesRepository } from "@/modules/articles/infrastructure/repositories";

export function useArticleComments(articleId: string) {
    return useQuery({
        queryKey: ["comments", articleId],
        queryFn: () => articlesRepository.getComments(articleId),
    });
}
```

## When to Reconsider

If the frontend grows to 20+ modules with complex cross-module dependencies, or if you need to swap repository implementations for testing, consider adding a lightweight DI approach. But start simple. You can always add complexity later.

## Testing Without DI

Without a container, test by mocking at the module boundary:

```typescript
// In tests, mock the repository module
jest.mock("@/modules/articles/infrastructure/repositories", () => ({
    articlesRepository: {
        getPublishedArticles: jest.fn().mockResolvedValue(ok(mockArticles)),
    },
}));
```

Or use MSW (Mock Service Worker) to intercept HTTP requests at the network level, which is even better because it tests the full stack including the mapper.
