# Spec 03 — Repository, use cases, DI

Wires the domain/mapper from spec 02 into the app: the repository port + impl calling the
generated client, the read use cases, the interaction use cases (like/unlike/share/record-view),
the similar-lyrics use case, and DI registration. Depends on specs 01, 10, 11, and 12 having shipped
and `116.api.ts` regenerated.

---

## Repository port

**`src/modules/lyrics/application/repositories/lyrics.repository.port.ts`**

```ts
import type { ILyricsDetailEntity } from "@/modules/lyrics/domain/entities/ILyricsDetailEntity";
import type { ILyricsPage } from "@/modules/lyrics/domain/entities/ILyricsPage";
import type { Result } from "@/shared/domain/results/result";

/**
 * Query for a page of published lyrics. Mirrors GET /api/v1/public/lyrics.
 *
 * @interface IPublishedLyricsQuery
 *
 * @property {number} pageIndex - Zero-based page number
 * @property {number} pageSize - Items per page
 * @property {string} [search] - Optional full-text search term
 * @property {string} [language] - Optional exact-match language code filter (e.g. "fr", "ln", "en")
 */
export interface IPublishedLyricsQuery {
    pageIndex: number;
    pageSize: number;
    search?: string;
    language?: string;
}

/**
 * Port for the lyrics module's read operations.
 *
 * @interface ILyricsRepositoryPort
 */
export interface ILyricsRepositoryPort {
    getPublishedLyrics(query: IPublishedLyricsQuery): Promise<Result<ILyricsPage>>;
    getLyricsBySlug(slug: string): Promise<Result<ILyricsDetailEntity>>;
    getSimilarLyrics(lyricsId: string): Promise<Result<ILyricsSummaryEntity[]>>;
    likeLyrics(lyricsId: string): Promise<Result<boolean>>;
    unlikeLyrics(lyricsId: string): Promise<Result<boolean>>;
    shareLyrics(lyricsId: string, shareChannel: string): Promise<Result<boolean>>;
    recordLyricsView(lyricsId: string): Promise<Result<boolean>>;
}
```

(`ILyricsSummaryEntity` needs importing alongside `ILyricsDetailEntity`/`ILyricsPage` at the top of
this file — omitted from the snippet above for brevity.)

## Repository implementation

**`src/modules/lyrics/infrastructure/repositories/lyrics.repository.impl.ts`**

```ts
import type {
    ILyricsRepositoryPort,
    IPublishedLyricsQuery
} from "@/modules/lyrics/application/repositories/lyrics.repository.port";
import type { ILyricsDetailEntity } from "@/modules/lyrics/domain/entities/ILyricsDetailEntity";
import type { ILyricsPage } from "@/modules/lyrics/domain/entities/ILyricsPage";
import { LyricsMapper } from "@/modules/lyrics/infrastructure/mappers/lyrics.mapper";
import { err, ok, type Result } from "@/shared/domain/results/result";
import type { Api } from "@/shared/infrastructure/api/generated/116.api";
import { ProblemMapper } from "@/shared/infrastructure/mappers/problem.mapper";

/**
 * Lyrics repository implementation using the public REST API.
 *
 * @description
 * Implements ILyricsRepositoryPort by delegating to an injected Api instance, browser
 * (Awilix `api`) or server (createServerApiClient()). Both methods return `Result<T>`;
 * errors are converted to typed Failure values via ProblemMapper.
 */
export class LyricsRepositoryImpl implements ILyricsRepositoryPort {
    private readonly api: Api<unknown>["api"];

    constructor({ client }: { client: Api<unknown> }) {
        this.api = client.api;
    }

    async getPublishedLyrics(query: IPublishedLyricsQuery): Promise<Result<ILyricsPage>> {
        try {
            const response = await this.api.getPublishedLyrics({
                pageIndex: query.pageIndex,
                pageSize: query.pageSize,
                search: query.search,
                language: query.language
            });
            return ok(LyricsMapper.lyricsPageFromDto(response.data.lyrics));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getLyricsBySlug(slug: string): Promise<Result<ILyricsDetailEntity>> {
        try {
            const response = await this.api.getLyricsBySlug(slug);
            return ok(LyricsMapper.lyricsDetailFromDto(
                response.data.lyrics,
                response.data.videoSlug ?? null,
                response.data.artistSlug ?? null
            ));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getSimilarLyrics(lyricsId: string): Promise<Result<ILyricsSummaryEntity[]>> {
        try {
            const response = await this.api.getSimilarLyrics(lyricsId);
            return ok(LyricsMapper.lyricsSummaryListFromDto(response.data.lyrics));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async likeLyrics(lyricsId: string): Promise<Result<boolean>> {
        try {
            const response = await this.api.likeLyrics(lyricsId);
            return ok(response.data.isSuccess);
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async unlikeLyrics(lyricsId: string): Promise<Result<boolean>> {
        try {
            const response = await this.api.unlikeLyrics(lyricsId);
            return ok(response.data.isSuccess);
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async shareLyrics(lyricsId: string, shareChannel: string): Promise<Result<boolean>> {
        try {
            const response = await this.api.shareLyrics(lyricsId, { shareChannel });
            return ok(response.data.isSuccess);
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async recordLyricsView(lyricsId: string): Promise<Result<boolean>> {
        try {
            const response = await this.api.recordLyricsView(lyricsId);
            return ok(response.data.isSuccess);
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }
}
```

(Exact generated client method names — `likeLyrics`/`unlikeLyrics`/`shareLyrics`/
`recordLyricsView`/`getSimilarLyrics` — depend on how the OpenAPI generator names spec 11 and 12's
endpoints from their `RouteMetadata` names; confirm against the regenerated `116.api.ts` and adjust
if the generator picks different casing/names.)

## Use cases

**`src/modules/lyrics/application/usecases/getpublishedlyrics.usecase.ts`**

```ts
import type {
    ILyricsRepositoryPort,
    IPublishedLyricsQuery
} from "@/modules/lyrics/application/repositories/lyrics.repository.port";
import type { ILyricsPage } from "@/modules/lyrics/domain/entities/ILyricsPage";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetPublishedLyricsUseCase
 * @extends {IResultUseCase<IPublishedLyricsQuery, ILyricsPage>}
 */
interface IGetPublishedLyricsUseCase extends IResultUseCase<IPublishedLyricsQuery, ILyricsPage> {}

/**
 * Use case for fetching one page of published lyrics.
 *
 * @class GetPublishedLyricsUseCase
 * @implements {IGetPublishedLyricsUseCase}
 *
 * @description
 * Fetches one page of published lyrics for the public listing. Delegates to the
 * lyrics repository and returns its `Result<ILyricsPage>` unchanged.
 */
export class GetPublishedLyricsUseCase implements IGetPublishedLyricsUseCase {
    private readonly lyricsRepository: ILyricsRepositoryPort;

    /**
     * @param lyricsRepository - Repository for lyrics operations (injected)
     */
    constructor({ lyricsRepository }: { lyricsRepository: ILyricsRepositoryPort }) {
        this.lyricsRepository = lyricsRepository;
    }

    /**
     * Executes the get published lyrics use case.
     *
     * @param query - Paging plus optional search
     * @returns {Promise<Result<ILyricsPage>>} `ok(ILyricsPage)` on success, `err(Failure)` on failure
     */
    async execute(query: IPublishedLyricsQuery): Promise<Result<ILyricsPage>> {
        return this.lyricsRepository.getPublishedLyrics(query);
    }
}
```

**`src/modules/lyrics/application/usecases/getlyricsbyslug.usecase.ts`**

```ts
import type { ILyricsRepositoryPort } from "@/modules/lyrics/application/repositories/lyrics.repository.port";
import type { ILyricsDetailEntity } from "@/modules/lyrics/domain/entities/ILyricsDetailEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetLyricsBySlugUseCase
 * @extends {IResultUseCase<string, ILyricsDetailEntity>}
 */
interface IGetLyricsBySlugUseCase extends IResultUseCase<string, ILyricsDetailEntity> {}

/**
 * Use case for fetching one lyrics page by its slug.
 *
 * @class GetLyricsBySlugUseCase
 * @implements {IGetLyricsBySlugUseCase}
 *
 * @description
 * Fetches the standalone lyrics page matching the given slug. Delegates to the lyrics
 * repository and returns its `Result<ILyricsDetailEntity>` unchanged.
 */
export class GetLyricsBySlugUseCase implements IGetLyricsBySlugUseCase {
    private readonly lyricsRepository: ILyricsRepositoryPort;

    /**
     * @param lyricsRepository - Repository for lyrics operations (injected)
     */
    constructor({ lyricsRepository }: { lyricsRepository: ILyricsRepositoryPort }) {
        this.lyricsRepository = lyricsRepository;
    }

    /**
     * Executes the get lyrics by slug use case.
     *
     * @param slug - The lyrics page's unique slug
     * @returns {Promise<Result<ILyricsDetailEntity>>} `ok(ILyricsDetailEntity)` on success, `err(Failure)` on failure
     */
    async execute(slug: string): Promise<Result<ILyricsDetailEntity>> {
        return this.lyricsRepository.getLyricsBySlug(slug);
    }
}
```

**`src/modules/lyrics/application/usecases/getsimilarlyrics.usecase.ts`** — thin pass-through,
same shape as the two above:

```ts
import type { ILyricsRepositoryPort } from "@/modules/lyrics/application/repositories/lyrics.repository.port";
import type { ILyricsSummaryEntity } from "@/modules/lyrics/domain/entities/ILyricsSummaryEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetSimilarLyricsUseCase
 * @extends {IResultUseCase<string, ILyricsSummaryEntity[]>}
 */
interface IGetSimilarLyricsUseCase extends IResultUseCase<string, ILyricsSummaryEntity[]> {}

/**
 * Use case for fetching lyrics similar to a given one.
 *
 * @class GetSimilarLyricsUseCase
 * @implements {IGetSimilarLyricsUseCase}
 *
 * @description
 * Fetches up to 10 lyrics similar to the given record — same video category when
 * linked, otherwise the latest standalone lyrics. Delegates to the lyrics repository
 * and returns its `Result<ILyricsSummaryEntity[]>` unchanged.
 */
export class GetSimilarLyricsUseCase implements IGetSimilarLyricsUseCase {
    private readonly lyricsRepository: ILyricsRepositoryPort;

    constructor({ lyricsRepository }: { lyricsRepository: ILyricsRepositoryPort }) {
        this.lyricsRepository = lyricsRepository;
    }

    async execute(lyricsId: string): Promise<Result<ILyricsSummaryEntity[]>> {
        return this.lyricsRepository.getSimilarLyrics(lyricsId);
    }
}
```

**Interaction use cases** — four thin pass-throughs, mirroring the shorts module's
`LikeShortUseCase` / `UnlikeShortUseCase` / `ShareShortUseCase` / `RecordShortViewUseCase` exactly
(same one-line `execute` bodies, same constructor-injection shape). Not reproduced field-by-field:

- **`likelyrics.usecase.ts`** → `LikeLyricsUseCase implements IResultUseCase<string, boolean>`,
  `execute(lyricsId) { return this.lyricsRepository.likeLyrics(lyricsId); }`
- **`unlikelyrics.usecase.ts`** → `UnlikeLyricsUseCase`, same shape, calls `unlikeLyrics`.
- **`sharelyrics.usecase.ts`** → `ShareLyricsUseCase implements IResultUseCase<{ lyricsId: string; shareChannel: string }, boolean>`,
  `execute(input) { return this.lyricsRepository.shareLyrics(input.lyricsId, input.shareChannel); }`
- **`recordlyricsview.usecase.ts`** → `RecordLyricsViewUseCase`, same shape as
  `RecordShortViewUseCase`, calls `recordLyricsView`.

## DI registration

**`src/modules/lyrics/infrastructure/dependencies/lyrics.dependencies.ts`**

```ts
import type { AwilixContainer } from "awilix";
import { asClass } from "awilix";
import { GetLyricsBySlugUseCase } from "@/modules/lyrics/application/usecases/getlyricsbyslug.usecase";
import { GetPublishedLyricsUseCase } from "@/modules/lyrics/application/usecases/getpublishedlyrics.usecase";
import { GetSimilarLyricsUseCase } from "@/modules/lyrics/application/usecases/getsimilarlyrics.usecase";
import { LikeLyricsUseCase } from "@/modules/lyrics/application/usecases/likelyrics.usecase";
import { RecordLyricsViewUseCase } from "@/modules/lyrics/application/usecases/recordlyricsview.usecase";
import { ShareLyricsUseCase } from "@/modules/lyrics/application/usecases/sharelyrics.usecase";
import { UnlikeLyricsUseCase } from "@/modules/lyrics/application/usecases/unlikelyrics.usecase";
import { LyricsRepositoryImpl } from "@/modules/lyrics/infrastructure/repositories/lyrics.repository.impl";

/**
 * Registers lyrics module dependencies in the Awilix container.
 *
 * @description
 * Registers the repository as a singleton and every use case as transient.
 * Called during application bootstrap in the service locator.
 *
 * @param container - The Awilix dependency injection container
 */
export function registerLyricsDependencies(container: AwilixContainer): void {
    container.register({
        lyricsRepository: asClass(LyricsRepositoryImpl).singleton(),
        getPublishedLyricsUseCase: asClass(GetPublishedLyricsUseCase).transient(),
        getLyricsBySlugUseCase: asClass(GetLyricsBySlugUseCase).transient(),
        getSimilarLyricsUseCase: asClass(GetSimilarLyricsUseCase).transient(),
        likeLyricsUseCase: asClass(LikeLyricsUseCase).transient(),
        unlikeLyricsUseCase: asClass(UnlikeLyricsUseCase).transient(),
        shareLyricsUseCase: asClass(ShareLyricsUseCase).transient(),
        recordLyricsViewUseCase: asClass(RecordLyricsViewUseCase).transient()
    });
}
```

**`src/shared/infrastructure/service.locator.ts`** (relevant excerpt — add alongside the other
`registerXDependencies` calls)

```ts
import { registerLyricsDependencies } from "@/modules/lyrics/infrastructure/dependencies/lyrics.dependencies";
// ...
registerArticlesDependencies(container);
registerVideosDependencies(container);
registerShortsDependencies(container);
registerLyricsDependencies(container);
```

## Presentation constants

**`src/modules/lyrics/presentation/constants/lyricsKeys.ts`** (mirrors `articleKeys.ts`'s shape)

```ts
/**
 * Query key factory for the lyrics module's React Query cache entries.
 */
export const lyricsKeys = {
    all: ["lyrics"] as const,
    feed: (search?: string, language?: string) =>
        [...lyricsKeys.all, "feed", search ?? "", language ?? ""] as const,
    detail: (slug: string) => [...lyricsKeys.all, "detail", slug] as const
};

/**
 * Items per page for the public lyrics listing.
 */
export const LYRICS_PAGE_SIZE = 12;
```

## Task checklist

- [ ] Confirm specs 01, 10, 11, 12 shipped and `116.api.ts` was regenerated (all seven client
  methods present on the generated `Api` client).
- [ ] Add `lyrics.repository.port.ts`, `lyrics.repository.impl.ts`.
- [ ] Add all seven use cases (two read, one similar, four interaction).
- [ ] Add `lyrics.dependencies.ts`; register it in `service.locator.ts`.
- [ ] Add `lyricsKeys.ts`.
- [ ] `tsc --noEmit` clean.
- [ ] `biome check` clean.
