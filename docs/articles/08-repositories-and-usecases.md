# Repositories & Use Cases

One new read across the slice: **list published articles, paginated**. It follows the
existing `articles` methods exactly (port → impl → use case → DI), returning
`Result<IArticlePage>`.

---

## Query object

A small typed input shared by the port, use case, and hook:

```ts
/**
 * Query for a page of published articles. Mirrors the backend's
 * GET /api/v1/public/articles parameters; filters are optional and deferred in the UI.
 */
export interface IPublishedArticlesQuery {
    pageIndex: number;
    pageSize: number;
    search?: string;
    categoryId?: string;
    tagSlug?: string;
}
```

`pageIndex` is zero-based (the backend's convention). The authoritative version with a
full `@property` block JSDoc is in [specs/02-repository-and-usecase.md](specs/02-repository-and-usecase.md).

---

## Repository port (extended)

```ts
export interface IArticlesRepositoryPort {
    getPromotedArticles(): Promise<Result<IArticleSummaryEntity[]>>;
    getArticleCategories(): Promise<Result<IArticleCategoryEntity[]>>;
    getArticlePopularTags(): Promise<Result<IArticleTagEntity[]>>;
    getPromotionFeed(): Promise<Result<IArticlePromotionFeedEntity>>;

    getPublishedArticles(query: IPublishedArticlesQuery): Promise<Result<IArticlePage>>;
}
```

The last line (`getPublishedArticles`) is the new method; the rest already exist.

## Repository impl

Delegates to the generated client and maps the envelope; catches → typed `Failure`.

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

(`response.data.articles` is the `ArticleSummaryDtoPaginatedResult` — see
[03-backend-api-reference.md](03-backend-api-reference.md).)

## Use case

Thin orchestrator, same shape as `GetPromotedArticlesUseCase`.

```ts
/**
 * GetPublishedArticlesUseCase
 *
 * @description
 * Fetches one page of published articles for the public feed. Delegates to the
 * articles repository and returns its `Result<IArticlePage>` unchanged.
 */
export class GetPublishedArticlesUseCase {
    private readonly repo: IArticlesRepositoryPort;

    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.repo = articlesRepository;
    }

    execute(query: IPublishedArticlesQuery): Promise<Result<IArticlePage>> {
        return this.repo.getPublishedArticles(query);
    }
}
```

## DI registration

Add one line to `registerArticlesDependencies`:

```ts
container.register({
    articlesRepository: asClass(ArticlesRepositoryImpl).singleton(),
    getPromotedArticlesUseCase: asClass(GetPromotedArticlesUseCase).transient(),
    getArticleCategoriesUseCase: asClass(GetArticleCategoriesUseCase).transient(),
    getArticlePopularTagsUseCase: asClass(GetArticlePopularTagsUseCase).transient(),
    getArticlePromotionFeedUseCase: asClass(GetArticlePromotionFeedUseCase).transient(),
    getPublishedArticlesUseCase: asClass(GetPublishedArticlesUseCase).transient()
});
```

The `Cradle` type (`src/shared/infrastructure/service.locator.ts`) gains
`getPublishedArticlesUseCase: GetPublishedArticlesUseCase` so
`container.cradle.getPublishedArticlesUseCase` is typed.

---

## Call path

```text
useArticlesFeed (useInfiniteQuery)
  → container.cradle.getPublishedArticlesUseCase.execute({ pageIndex, pageSize })
    → ArticlesRepositoryImpl.getPublishedArticles()
      → api.getPublishedArticles()                     [generated client]
      → ArticlesMapper.articlePageFromDto()            [Result<IArticlePage>]
  → hook unwraps: result.ok ? value : throw error       [Failure surfaces to the grid]
```

Interaction use cases (like / bookmark / share) follow the same pattern and are
covered in [10-interactions.md](10-interactions.md).
