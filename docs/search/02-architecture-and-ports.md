# Architecture and Ports

The clean-architecture ladder the codebase already uses: generated client → mapper →
repository impl → port → use case → Awilix → TanStack hook → container → component.

## Checklist

- [ ] `ESearchScope` enum
- [ ] `ISearchHitEntity`, `ISearchResultsEntity`
- [ ] `SearchMapper` with list helpers
- [ ] `ISearchRepositoryPort`
- [ ] `SearchContentUseCase`
- [ ] `SearchRepositoryImpl`
- [ ] `registerSearchDependencies` and the `Cradle` entries
- [ ] `searchKeys`
- [ ] `useSearch`

---

## Domain

```ts
// src/modules/search/domain/enums/ESearchScope.ts
/**
 * The content types a search can be narrowed to. Mirrors the API's scope enum.
 */
export enum ESearchScope {
    All = "all",
    Articles = "articles",
    Videos = "videos"
}
```

```ts
// src/modules/search/domain/entities/ISearchHitEntity.ts
import type { EContentType } from "@/shared/domain/enums/EContentType";

/**
 * ISearchHitEntity
 *
 * @description
 * One search result, flattened across content types. Type-specific fields are null
 * when they do not apply to `type`.
 *
 * @interface ISearchHitEntity
 * @property {EContentType} type - Which content type this hit is
 * @property {string} id - Entity identifier
 * @property {string} slug - Slug of the detail page
 * @property {string} title - Entity title
 * @property {string} excerpt - Plain-text summary, pre-truncated by the API
 * @property {string | null} imageUrl - Cover or thumbnail, null when unset
 * @property {string} categoryName - Owning category's display name
 * @property {string | null} publishedAt - ISO publication timestamp
 * @property {number} score - Relevance; higher ranks first. Not displayed
 * @property {number | null} ratingAverage - Cached average rating, videos only
 * @property {number | null} durationSeconds - Runtime, videos only
 */
export interface ISearchHitEntity {
    type: EContentType;
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    imageUrl: string | null;
    categoryName: string;
    publishedAt: string | null;
    score: number;
    ratingAverage: number | null;
    durationSeconds: number | null;
}
```

```ts
// src/modules/search/domain/entities/ISearchResultsEntity.ts
import type { ISearchHitEntity } from "@/modules/search/domain/entities/ISearchHitEntity";
import type { ESearchScope } from "@/modules/search/domain/enums/ESearchScope";

/**
 * ISearchResultsEntity
 *
 * @description
 * One page of search results plus the per-scope counts for the whole query, so the
 * scope tabs can label themselves without a second request.
 *
 * @interface ISearchResultsEntity
 * @property {string} query - The trimmed query the API ran
 * @property {ESearchScope} scope - The scope these items were narrowed to
 * @property {Record<ESearchScope, number>} counts - Hit counts per scope
 * @property {ISearchHitEntity[]} items - The ranked hits
 * @property {number} pageIndex - Zero-based page index
 * @property {number} pageSize - Items per page
 * @property {number} count - Total hits in the active scope
 * @property {boolean} hasMore - Whether another page exists
 */
export interface ISearchResultsEntity {
    query: string;
    scope: ESearchScope;
    counts: Record<ESearchScope, number>;
    items: ISearchHitEntity[];
    pageIndex: number;
    pageSize: number;
    count: number;
    hasMore: boolean;
}
```

`hasMore` is derived in the mapper rather than recomputed at call sites, per the
"derived booleans computed in mappers as entity properties" rule.

---

## Mapper

List mapping lives on the mapper; call sites never `.map(Mapper.x)`.

```ts
// src/modules/search/infrastructure/mappers/search.mapper.ts
import type { ISearchHitEntity } from "@/modules/search/domain/entities/ISearchHitEntity";
import type { ISearchResultsEntity } from "@/modules/search/domain/entities/ISearchResultsEntity";
import { ESearchScope } from "@/modules/search/domain/enums/ESearchScope";
import type { EContentType } from "@/shared/domain/enums/EContentType";
import type { PublicSearchResponse, SearchHitDto } from "@/shared/infrastructure/api/generated/116.api";

/**
 * SearchMapper
 *
 * @description
 * Maps the search DTOs to domain entities, deriving `hasMore` and normalising the
 * counts map so every scope has a numeric entry.
 */
export const SearchMapper = {
    /**
     * Maps SearchHitDto to ISearchHitEntity domain entity.
     *
     * @param dto - One hit from the API
     * @returns {ISearchHitEntity} Mapped hit entity
     */
    hitFromDto(dto: SearchHitDto): ISearchHitEntity {
        return {
            type: dto.type as EContentType,
            id: dto.id,
            slug: dto.slug,
            title: dto.title,
            excerpt: dto.excerpt,
            imageUrl: dto.imageUrl ?? null,
            categoryName: dto.categoryName,
            publishedAt: dto.publishedAt ?? null,
            score: dto.score,
            ratingAverage: dto.ratingAverage ?? null,
            durationSeconds: dto.durationSeconds ?? null
        };
    },

    /**
     * Maps a list of SearchHitDto to ISearchHitEntity domain entities.
     *
     * @param dtos - Hit list from the API
     * @returns {ISearchHitEntity[]} Mapped hit entities
     */
    hitListFromDto(dtos: SearchHitDto[]): ISearchHitEntity[] {
        return dtos.map(SearchMapper.hitFromDto);
    },

    /**
     * Maps PublicSearchResponse to ISearchResultsEntity domain entity.
     *
     * @param dto - The search response envelope
     * @returns {ISearchResultsEntity} Mapped results entity
     */
    resultsFromDto(dto: PublicSearchResponse): ISearchResultsEntity {
        const { items, pageIndex, pageSize, count } = dto.results;

        return {
            query: dto.query,
            scope: dto.scope as ESearchScope,
            counts: {
                [ESearchScope.All]: dto.counts.all,
                [ESearchScope.Articles]: dto.counts.articles,
                [ESearchScope.Videos]: dto.counts.videos
            },
            items: SearchMapper.hitListFromDto(items),
            pageIndex,
            pageSize,
            count,
            hasMore: (pageIndex + 1) * pageSize < count
        };
    }
};
```

---

## Port

```ts
// src/modules/search/application/repositories/search.repository.port.ts
import type { ISearchResultsEntity } from "@/modules/search/domain/entities/ISearchResultsEntity";
import type { ESearchScope } from "@/modules/search/domain/enums/ESearchScope";
import type { Result } from "@/shared/domain/results/result";

/**
 * ISearchContentInput
 *
 * @description
 * Arguments for one search request.
 *
 * @interface ISearchContentInput
 * @property {string} query - The reader's query, already trimmed
 * @property {ESearchScope} scope - The scope to narrow to
 * @property {number} [pageIndex] - Zero-based page index
 * @property {number} [pageSize] - Items per page
 */
export interface ISearchContentInput {
    query: string;
    scope: ESearchScope;
    pageIndex?: number;
    pageSize?: number;
}

/**
 * ISearchRepositoryPort
 *
 * @description
 * Application-layer contract for cross-content search.
 *
 * @interface ISearchRepositoryPort
 */
export interface ISearchRepositoryPort {
    /**
     * Searches the published content for a query within a scope.
     *
     * @param input - Query, scope and pagination.
     * @returns `ok(ISearchResultsEntity)` on success, `err(Failure)` on failure.
     */
    search(input: ISearchContentInput): Promise<Result<ISearchResultsEntity>>;
}
```

---

## Use case

```ts
// src/modules/search/application/usecases/searchcontent.usecase.ts
import type {
    ISearchContentInput,
    ISearchRepositoryPort
} from "@/modules/search/application/repositories/search.repository.port";
import type { ISearchResultsEntity } from "@/modules/search/domain/entities/ISearchResultsEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface ISearchContentUseCase
 * @extends {IResultUseCase<ISearchContentInput, ISearchResultsEntity>}
 */
interface ISearchContentUseCase
    extends IResultUseCase<ISearchContentInput, ISearchResultsEntity> {}

/**
 * Use case for searching across the published content.
 *
 * @class SearchContentUseCase
 * @implements {ISearchContentUseCase}
 */
export class SearchContentUseCase implements ISearchContentUseCase {
    private readonly searchRepository: ISearchRepositoryPort;

    /**
     * @param searchRepository - Repository for search operations (injected)
     */
    constructor({ searchRepository }: { searchRepository: ISearchRepositoryPort }) {
        this.searchRepository = searchRepository;
    }

    /**
     * Executes the search use case.
     *
     * @param input - Query, scope and pagination
     * @returns {Promise<Result<ISearchResultsEntity>>} `ok(results)` on success, `err(Failure)` on failure
     */
    async execute(input: ISearchContentInput): Promise<Result<ISearchResultsEntity>> {
        return this.searchRepository.search(input);
    }
}
```

---

## Repository implementation

```ts
// src/modules/search/infrastructure/repositories/search.repository.impl.ts
import type {
    ISearchContentInput,
    ISearchRepositoryPort
} from "@/modules/search/application/repositories/search.repository.port";
import type { ISearchResultsEntity } from "@/modules/search/domain/entities/ISearchResultsEntity";
import { SearchMapper } from "@/modules/search/infrastructure/mappers/search.mapper";
import { err, ok, type Result } from "@/shared/domain/results/result";
import type { Api } from "@/shared/infrastructure/api/generated/116.api";
import { ProblemMapper } from "@/shared/infrastructure/mappers/problem.mapper";

const DEFAULT_PAGE_SIZE = 20;

/**
 * SearchRepositoryImpl
 *
 * @description
 * Implements the search port over the generated API client.
 */
export class SearchRepositoryImpl implements ISearchRepositoryPort {
    private readonly api: Api<unknown>["api"];

    /**
     * @param apiClient - The generated API client (injected).
     */
    constructor({ apiClient }: { apiClient: Api<unknown> }) {
        this.api = apiClient.api;
    }

    async search(input: ISearchContentInput): Promise<Result<ISearchResultsEntity>> {
        try {
            const response = await this.api.publicSearch({
                q: input.query,
                scope: input.scope,
                pageIndex: input.pageIndex ?? 0,
                pageSize: input.pageSize ?? DEFAULT_PAGE_SIZE
            });

            return ok(SearchMapper.resultsFromDto(response.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }
}
```

---

## DI

```ts
// src/modules/search/infrastructure/dependencies/search.dependencies.ts
import type { AwilixContainer } from "awilix";
import { asClass } from "awilix";

import { SearchContentUseCase } from "@/modules/search/application/usecases/searchcontent.usecase";
import { SearchRepositoryImpl } from "@/modules/search/infrastructure/repositories/search.repository.impl";

/**
 * Registers search module dependencies in the Awilix container.
 *
 * @param container - The Awilix dependency injection container.
 */
export function registerSearchDependencies(container: AwilixContainer): void {
    container.register({
        searchRepository: asClass(SearchRepositoryImpl).singleton(),
        searchContentUseCase: asClass(SearchContentUseCase).transient()
    });
}
```

Plus the two `Cradle` entries and the `registerSearchDependencies(container)` call in
`service.locator.ts`.

---

## Query keys and hook

```ts
// src/modules/search/presentation/constants/searchKeys.ts
import type { ESearchScope } from "@/modules/search/domain/enums/ESearchScope";

/**
 * TanStack query keys for the search module. The query and scope are both part of the
 * key, so switching scope reuses the cached page rather than refetching.
 */
export const searchKeys = {
    all: ["search"] as const,
    results: (query: string, scope: ESearchScope) => ["search", query, scope] as const
};

/**
 * Minimum query length before a request is issued. Matches the API's validator.
 */
export const MIN_SEARCH_LENGTH = 2;
```

```ts
// src/modules/search/presentation/hooks/useSearch.ts
"use client";

import { useQuery } from "@tanstack/react-query";

import type { ISearchResultsEntity } from "@/modules/search/domain/entities/ISearchResultsEntity";
import type { ESearchScope } from "@/modules/search/domain/enums/ESearchScope";
import { MIN_SEARCH_LENGTH, searchKeys } from "@/modules/search/presentation/constants/searchKeys";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useSearch
 *
 * @description
 * Runs a search for the query within the scope. Stays idle below the minimum length,
 * so a one-character query costs no request. The previous page is kept while a new
 * query resolves, so the list does not blank out between keystrokes.
 *
 * @param query - The settled, trimmed query.
 * @param scope - The active scope.
 * @returns The TanStack query result; its `error` is a `Failure`.
 */
export function useSearch(query: string, scope: ESearchScope) {
    return useQuery<ISearchResultsEntity, Failure>({
        queryKey: searchKeys.results(query, scope),
        enabled: query.length >= MIN_SEARCH_LENGTH,
        placeholderData: (previous) => previous,
        staleTime: 30_000,
        queryFn: async () => {
            const result = await container.cradle.searchContentUseCase.execute({ query, scope });
            if (!result.ok) throw result.error;
            return result.value;
        }
    });
}
```

`placeholderData: (previous) => previous` is what makes the results feel instant: the
old list stays on screen, dimmed, while the new one resolves, instead of flashing a
skeleton on every settled keystroke.
