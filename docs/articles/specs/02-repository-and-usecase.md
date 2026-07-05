# Spec 02 — Repository & Use Case

Design ref: [../08-repositories-and-usecases.md](../08-repositories-and-usecases.md).

---

## 1. Query type

`src/modules/articles/application/repositories/articles.repository.port.ts` (top of
file, or a small colocated types file).

```ts
/**
 * Query for a page of published articles. Mirrors GET /api/v1/public/articles.
 *
 * @interface IPublishedArticlesQuery
 * @property {number} pageIndex - Zero-based page number.
 * @property {number} pageSize - Items per page.
 * @property {string} [search] - Optional full-text search (deferred UI).
 * @property {string} [categoryId] - Optional category filter (deferred UI).
 * @property {string} [tagSlug] - Optional tag filter (deferred UI).
 */
export interface IPublishedArticlesQuery {
    pageIndex: number;
    pageSize: number;
    search?: string;
    categoryId?: string;
    tagSlug?: string;
}
```

## 2. Port method

Add to `IArticlesRepositoryPort`:

```ts
getPublishedArticles(query: IPublishedArticlesQuery): Promise<Result<IArticlePage>>;
```

## 3. Impl method

`src/modules/articles/infrastructure/repositories/articles.repository.impl.ts`.

```ts
async getPublishedArticles(
    query: IPublishedArticlesQuery
): Promise<Result<IArticlePage>> {
    try {
        const response = await this.api.getPublishedArticles({
            pageIndex: query.pageIndex,
            pageSize: query.pageSize,
            search: query.search,
            categoryId: query.categoryId,
            tagSlug: query.tagSlug
        });
        return ok(ArticlesMapper.articlePageFromDto(response.data.articles));
    } catch (error) {
        return err(ProblemMapper.toFailure(error));
    }
}
```

## 4. Use case

`src/modules/articles/application/usecases/getpublishedarticles.usecase.ts` — new.

```ts
import type { IArticlePage } from "@/modules/articles/domain/entities/IArticlePage";
import type {
    IArticlesRepositoryPort,
    IPublishedArticlesQuery
} from "@/modules/articles/application/repositories/articles.repository.port";
import type { Result } from "@/shared/domain/results/result";

/**
 * GetPublishedArticlesUseCase
 *
 * @description
 * Fetches one page of published articles for the public feed. Delegates to the articles
 * repository and returns its `Result<IArticlePage>` unchanged.
 */
export class GetPublishedArticlesUseCase {
    private readonly repo: IArticlesRepositoryPort;

    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.repo = articlesRepository;
    }

    /**
     * @param query - Paging + optional filters.
     * @returns A `Result` of the mapped article page.
     */
    execute(query: IPublishedArticlesQuery): Promise<Result<IArticlePage>> {
        return this.repo.getPublishedArticles(query);
    }
}
```

## 5. DI + Cradle

`src/modules/articles/infrastructure/dependencies/articles.dependencies.ts`:

Add one entry to the existing `container.register({ … })` call:

```ts
getPublishedArticlesUseCase: asClass(GetPublishedArticlesUseCase).transient()
```

`src/shared/infrastructure/service.locator.ts` — add to the `Cradle` type:

```ts
getPublishedArticlesUseCase: GetPublishedArticlesUseCase;
```

---

## Tasks

- [x] `IPublishedArticlesQuery` added.
- [x] Port method declared.
- [x] Impl method delegates to `api.getPublishedArticles` and maps to `IArticlePage`.
- [x] `GetPublishedArticlesUseCase` created (JSDoc, `Result<T>`).
- [x] DI registration + `Cradle` type entry.
- [x] Throwaway call returns a mapped page; `tsc` + biome clean.
