# Spec 02 — Repository & Use Cases

Design ref: [../02-architecture.md](../02-architecture.md),
[../03-backend-api-reference.md](../03-backend-api-reference.md).

Extends `IArticlesRepositoryPort` + `ArticlesRepositoryImpl` with three methods, adds three
use cases, and registers them in DI and the `Cradle`. Every method returns `Result<T>`;
catches convert to a typed `Failure` via `ProblemMapper.toFailure`.

---

## 1. Comments query type

`src/modules/articles/application/repositories/articles.repository.port.ts` — add near
`IPublishedArticlesQuery`.

```ts
/**
 * Query for a page of an article's comments. Mirrors
 * GET /api/v1/public/articles/{id}/comments.
 *
 * @interface IArticleCommentsQuery
 *
 * @property {string} articleId - The article whose comments to page through (UUID)
 * @property {number} pageIndex - Zero-based page number
 * @property {number} pageSize - Items per page
 */
export interface IArticleCommentsQuery {
    articleId: string;
    pageIndex: number;
    pageSize: number;
}

/**
 * Input for adding a comment to an article. Mirrors
 * POST /api/v1/public/articles/{id}/comments.
 *
 * @interface IAddArticleCommentInput
 *
 * @property {string} articleId - The article to comment on (UUID)
 * @property {string} body - The comment text
 */
export interface IAddArticleCommentInput {
    articleId: string;
    body: string;
}
```

## 2. Port methods

Add to `IArticlesRepositoryPort`. `editArticleComment` / `deleteArticleComment` are noted
as deferred — the endpoints exist ([../03-backend-api-reference.md](../03-backend-api-reference.md))
but the first cut ships create + list only, so they are not added yet.

```ts
/**
 * Fetches one article by its slug.
 *
 * @param slug - The article slug
 * @returns `ok(IArticleDetailEntity)` on success, `err(Failure)` on failure
 */
getArticleBySlug(slug: string): Promise<Result<IArticleDetailEntity>>;

/**
 * Fetches one page of an article's comments.
 *
 * @param query - Article id plus paging
 * @returns `ok(IArticleCommentPage)` on success, `err(Failure)` on failure
 */
getArticleComments(query: IArticleCommentsQuery): Promise<Result<IArticleCommentPage>>;

/**
 * Adds a comment to an article. Requires authentication.
 *
 * @param input - Article id plus the comment body
 * @returns `ok(IArticleCommentEntity)` on success, `err(Failure)` on failure
 */
addArticleComment(input: IAddArticleCommentInput): Promise<Result<IArticleCommentEntity>>;
```

## 3. Impl methods

`src/modules/articles/infrastructure/repositories/articles.repository.impl.ts` — add three
methods, each wrapped in `try/catch → ok(...) / err(ProblemMapper.toFailure(error))`.

```ts
async getArticleBySlug(slug: string): Promise<Result<IArticleDetailEntity>> {
    try {
        const response = await this.api.getArticleBySlug(slug);
        return ok(ArticlesMapper.articleDetailFromDto(response.data.article));
    } catch (error) {
        return err(ProblemMapper.toFailure(error));
    }
}
```

```ts
async getArticleComments(
    query: IArticleCommentsQuery
): Promise<Result<IArticleCommentPage>> {
    try {
        const response = await this.api.publicGetArticleComments(query.articleId, {
            pageIndex: query.pageIndex,
            pageSize: query.pageSize
        });
        return ok(ArticlesMapper.articleCommentPageFromDto(response.data));
    } catch (error) {
        return err(ProblemMapper.toFailure(error));
    }
}
```

```ts
async addArticleComment(
    input: IAddArticleCommentInput
): Promise<Result<IArticleCommentEntity>> {
    try {
        const response = await this.api.publicAddArticleComment(input.articleId, {
            body: input.body
        });
        return ok(ArticlesMapper.articleCommentFromDto(response.data.comment));
    } catch (error) {
        return err(ProblemMapper.toFailure(error));
    }
}
```

Import the new entity types and the port's query types at the top of the impl.

## 4. Use cases

`src/modules/articles/application/usecases/getarticlebyslug.usecase.ts` — new.

```ts
import type { IArticlesRepositoryPort } from "@/modules/articles/application/repositories/articles.repository.port";
import type { IArticleDetailEntity } from "@/modules/articles/domain/entities/IArticleDetailEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetArticleBySlugUseCase
 * @extends {IResultUseCase<string, IArticleDetailEntity>}
 */
interface IGetArticleBySlugUseCase extends IResultUseCase<string, IArticleDetailEntity> {}

/**
 * Use case for fetching one article by slug.
 *
 * @class GetArticleBySlugUseCase
 * @implements {IGetArticleBySlugUseCase}
 *
 * @description
 * Fetches a single article by its slug via the articles repository. Returns the
 * repository's `Result<IArticleDetailEntity>` unchanged.
 */
export class GetArticleBySlugUseCase implements IGetArticleBySlugUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param {IArticlesRepositoryPort} articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the get-article-by-slug use case.
     *
     * @param {string} slug - The article slug
     * @returns {Promise<Result<IArticleDetailEntity>>} `ok(IArticleDetailEntity)` on success, `err(Failure)` on failure
     */
    async execute(slug: string): Promise<Result<IArticleDetailEntity>> {
        return this.articlesRepository.getArticleBySlug(slug);
    }
}
```

`src/modules/articles/application/usecases/getarticlecomments.usecase.ts` — new.

```ts
import type {
    IArticleCommentsQuery,
    IArticlesRepositoryPort
} from "@/modules/articles/application/repositories/articles.repository.port";
import type { IArticleCommentPage } from "@/modules/articles/domain/entities/IArticleCommentPage";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetArticleCommentsUseCase
 * @extends {IResultUseCase<IArticleCommentsQuery, IArticleCommentPage>}
 */
interface IGetArticleCommentsUseCase
    extends IResultUseCase<IArticleCommentsQuery, IArticleCommentPage> {}

/**
 * Use case for fetching one page of an article's comments.
 *
 * @class GetArticleCommentsUseCase
 * @implements {IGetArticleCommentsUseCase}
 *
 * @description
 * Fetches one page of comments for an article via the articles repository. Returns the
 * repository's `Result<IArticleCommentPage>` unchanged.
 */
export class GetArticleCommentsUseCase implements IGetArticleCommentsUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param {IArticlesRepositoryPort} articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the get-article-comments use case.
     *
     * @param {IArticleCommentsQuery} query - Article id plus paging
     * @returns {Promise<Result<IArticleCommentPage>>} `ok(IArticleCommentPage)` on success, `err(Failure)` on failure
     */
    async execute(query: IArticleCommentsQuery): Promise<Result<IArticleCommentPage>> {
        return this.articlesRepository.getArticleComments(query);
    }
}
```

`src/modules/articles/application/usecases/addarticlecomment.usecase.ts` — new.

```ts
import type {
    IAddArticleCommentInput,
    IArticlesRepositoryPort
} from "@/modules/articles/application/repositories/articles.repository.port";
import type { IArticleCommentEntity } from "@/modules/articles/domain/entities/IArticleCommentEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IAddArticleCommentUseCase
 * @extends {IResultUseCase<IAddArticleCommentInput, IArticleCommentEntity>}
 */
interface IAddArticleCommentUseCase
    extends IResultUseCase<IAddArticleCommentInput, IArticleCommentEntity> {}

/**
 * Use case for adding a comment to an article.
 *
 * @class AddArticleCommentUseCase
 * @implements {IAddArticleCommentUseCase}
 *
 * @description
 * Posts a comment on an article via the articles repository. Returns the repository's
 * `Result<IArticleCommentEntity>` unchanged.
 */
export class AddArticleCommentUseCase implements IAddArticleCommentUseCase {
    private readonly articlesRepository: IArticlesRepositoryPort;

    /**
     * @param {IArticlesRepositoryPort} articlesRepository - Repository for articles operations (injected)
     */
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.articlesRepository = articlesRepository;
    }

    /**
     * Executes the add-article-comment use case.
     *
     * @param {IAddArticleCommentInput} input - Article id plus the comment body
     * @returns {Promise<Result<IArticleCommentEntity>>} `ok(IArticleCommentEntity)` on success, `err(Failure)` on failure
     */
    async execute(input: IAddArticleCommentInput): Promise<Result<IArticleCommentEntity>> {
        return this.articlesRepository.addArticleComment(input);
    }
}
```

## 5. DI registration

`src/modules/articles/infrastructure/dependencies/articles.dependencies.ts` — import the
three classes and add three entries to the existing `container.register({ … })` call
(alongside the other query registrations).

```ts
getArticleBySlugUseCase: asClass(GetArticleBySlugUseCase).transient(),
getArticleCommentsUseCase: asClass(GetArticleCommentsUseCase).transient(),
addArticleCommentUseCase: asClass(AddArticleCommentUseCase).transient()
```

## 6. Cradle type

`src/shared/infrastructure/service.locator.ts` — add the three `type` imports and three
entries to the `Cradle` interface (in the articles use-cases block).

```ts
getArticleBySlugUseCase: GetArticleBySlugUseCase;
getArticleCommentsUseCase: GetArticleCommentsUseCase;
addArticleCommentUseCase: AddArticleCommentUseCase;
```

---

## Tasks

- [ ] `IArticleCommentsQuery` + `IAddArticleCommentInput` added to the port file.
- [ ] Port declares `getArticleBySlug`, `getArticleComments`, `addArticleComment`
      (all `Result<T>`).
- [ ] Impl `getArticleBySlug` maps `response.data.article` via `articleDetailFromDto`.
- [ ] Impl `getArticleComments` calls `publicGetArticleComments(id, { pageIndex, pageSize })`
      and maps via `articleCommentPageFromDto`.
- [ ] Impl `addArticleComment` maps `response.data.comment` via `articleCommentFromDto`.
- [ ] All three impl methods wrap in `try/catch → ok / err(ProblemMapper.toFailure)`.
- [ ] `GetArticleBySlugUseCase`, `GetArticleCommentsUseCase`, `AddArticleCommentUseCase`
      created (JSDoc, `Result<T>`).
- [ ] DI registrations added for the three use cases.
- [ ] `Cradle` gains `getArticleBySlugUseCase`, `getArticleCommentsUseCase`,
      `addArticleCommentUseCase`.
- [ ] `editArticleComment` / `deleteArticleComment` left deferred (documented, not added).
- [ ] `npx tsc --noEmit` + biome clean.
