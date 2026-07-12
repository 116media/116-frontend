# Spec 02 — Repository & Use Cases

Design ref: [../03-domain-and-module.md](../03-domain-and-module.md). The `Result<T>` port,
its impl wrapping the generated client, one class per use case, and DI registration. Mirrors
`videos.repository.*` and `videos.dependencies.ts`.

---

## 1. Port

`src/modules/shorts/application/repositories/shorts.repository.port.ts`

```ts
import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";
import type { IShortVideoPage } from "@/modules/shorts/domain/entities/IShortVideoPage";
import type { Result } from "@/shared/domain/results/result";

/**
 * IShortsFeedQuery
 *
 * @description
 * Paging + optional search scoping for the shorts feed.
 *
 * @interface IShortsFeedQuery
 * @property {number} pageIndex - Zero-based page index.
 * @property {number} pageSize - Page size.
 * @property {string} [search] - Optional title search term.
 */
export interface IShortsFeedQuery {
    pageIndex: number;
    pageSize: number;
    search?: string;
}

/**
 * IShareShortInput
 *
 * @description
 * A share event to record against a short.
 *
 * @interface IShareShortInput
 * @property {string} shortId - The short being shared.
 * @property {string} [shareChannel] - Optional channel identifier (facebook/x/whatsapp/clipboard/webshare).
 */
export interface IShareShortInput {
    shortId: string;
    shareChannel?: string;
}

/**
 * IShortsRepositoryPort
 *
 * @description
 * Data access for public short videos. Every method returns `Result<T>` and never
 * throws; interaction methods resolve the backend `isSuccess` flag.
 */
export interface IShortsRepositoryPort {
    getShorts(query: IShortsFeedQuery): Promise<Result<IShortVideoPage>>;
    getShortBySlug(slug: string): Promise<Result<IShortVideoEntity>>;
    likeShort(shortId: string): Promise<Result<boolean>>;
    unlikeShort(shortId: string): Promise<Result<boolean>>;
    shareShort(input: IShareShortInput): Promise<Result<boolean>>;
    recordShortView(shortId: string): Promise<Result<boolean>>;
}
```

## 2. Impl

`src/modules/shorts/infrastructure/repositories/shorts.repository.impl.ts`

```ts
import type {
    IShareShortInput,
    IShortsFeedQuery,
    IShortsRepositoryPort
} from "@/modules/shorts/application/repositories/shorts.repository.port";
import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";
import type { IShortVideoPage } from "@/modules/shorts/domain/entities/IShortVideoPage";
import { ShortsMapper } from "@/modules/shorts/infrastructure/mappers/shorts.mapper";
import { ProblemMapper } from "@/shared/infrastructure/mappers/problem.mapper";
import type { Api } from "@/shared/infrastructure/api/generated/116.api";
import { type Result, err, ok } from "@/shared/domain/results/result";

/**
 * ShortsRepositoryImpl
 *
 * @description
 * Wraps the generated short-video client calls, mapping success through
 * `ShortsMapper` and failure through `ProblemMapper.toFailure`. Interaction calls
 * resolve the backend `isSuccess` flag.
 */
export class ShortsRepositoryImpl implements IShortsRepositoryPort {
    private readonly api: Api<unknown>;

    constructor({ client }: { client: Api<unknown> }) {
        this.api = client;
    }

    /**
     * Fetches one page of active shorts.
     *
     * @param query - Paging + optional search.
     * @returns {Promise<Result<IShortVideoPage>>} The mapped page or a failure.
     */
    async getShorts(query: IShortsFeedQuery): Promise<Result<IShortVideoPage>> {
        try {
            const response = await this.api.getPublicShorts(query);
            return ok(ShortsMapper.shortPageFromDto(response.data.shortVideos));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    /**
     * Fetches one short by slug.
     *
     * @param slug - The short's slug.
     * @returns {Promise<Result<IShortVideoEntity>>} The mapped short or a failure.
     */
    async getShortBySlug(slug: string): Promise<Result<IShortVideoEntity>> {
        try {
            const response = await this.api.getPublicShortBySlug(slug);
            return ok(ShortsMapper.shortFromDto(response.data.shortVideo));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    /**
     * Likes a short.
     *
     * @param shortId - The short to like.
     * @returns {Promise<Result<boolean>>} The success flag or a failure.
     */
    async likeShort(shortId: string): Promise<Result<boolean>> {
        try {
            const response = await this.api.publicLikeShortVideo(shortId);
            return ok(response.data.isSuccess);
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    /**
     * Removes a like from a short.
     *
     * @param shortId - The short to unlike.
     * @returns {Promise<Result<boolean>>} The success flag or a failure.
     */
    async unlikeShort(shortId: string): Promise<Result<boolean>> {
        try {
            const response = await this.api.publicUnlikeShortVideo(shortId);
            return ok(response.data.isSuccess);
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    /**
     * Records a share event against a short.
     *
     * @param input - The short id and optional channel.
     * @returns {Promise<Result<boolean>>} The success flag or a failure.
     */
    async shareShort({ shortId, shareChannel }: IShareShortInput): Promise<Result<boolean>> {
        try {
            const response = await this.api.publicShareShortVideo(shortId, { shareChannel });
            return ok(response.data.isSuccess);
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    /**
     * Records a view event against a short (engagement-gated by the caller).
     *
     * @param shortId - The short viewed.
     * @returns {Promise<Result<boolean>>} The success flag or a failure.
     */
    async recordShortView(shortId: string): Promise<Result<boolean>> {
        try {
            const response = await this.api.publicRecordShortVideoView(shortId);
            return ok(response.data.isSuccess);
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }
}
```

## 3. Use cases

One class per file under `src/modules/shorts/application/usecases/`, each implementing
`IResultUseCase<Input, Output>`, constructor destructuring `{ shortsRepository }`. Example
(the feed):

```ts
import type { IShortsFeedQuery, IShortsRepositoryPort } from "@/modules/shorts/application/repositories/shorts.repository.port";
import type { IShortVideoPage } from "@/modules/shorts/domain/entities/IShortVideoPage";
import type { IResultUseCase } from "@/shared/application/usecases/result.usecase";
import type { Result } from "@/shared/domain/results/result";

/**
 * GetShortsUseCase
 *
 * @description
 * Fetches one page of active shorts for the homepage strip and player feed.
 */
export class GetShortsUseCase implements IResultUseCase<IShortsFeedQuery, IShortVideoPage> {
    private readonly shortsRepository: IShortsRepositoryPort;

    constructor({ shortsRepository }: { shortsRepository: IShortsRepositoryPort }) {
        this.shortsRepository = shortsRepository;
    }

    /**
     * @param input - Paging + optional search.
     * @returns {Promise<Result<IShortVideoPage>>} The mapped page or a failure.
     */
    execute(input: IShortsFeedQuery): Promise<Result<IShortVideoPage>> {
        return this.shortsRepository.getShorts(input);
    }
}
```

The remaining use cases follow the identical shape:

| Class | File | Input → Output |
|---|---|---|
| `GetShortBySlugUseCase` | `getshortbyslug.usecase.ts` | `string` → `IShortVideoEntity` |
| `LikeShortUseCase` | `likeshort.usecase.ts` | `string` → `boolean` |
| `UnlikeShortUseCase` | `unlikeshort.usecase.ts` | `string` → `boolean` |
| `ShareShortUseCase` | `shareshort.usecase.ts` | `IShareShortInput` → `boolean` |
| `RecordShortViewUseCase` | `recordshortview.usecase.ts` | `string` → `boolean` |

(Deferred: `BookmarkShortUseCase` / `UnbookmarkShortUseCase` — spec-ready, not registered.)

## 4. DI + cradle

`src/modules/shorts/infrastructure/dependencies/shorts.dependencies.ts`

```ts
import { asClass } from "awilix";

import { GetShortsUseCase } from "@/modules/shorts/application/usecases/getshorts.usecase";
import { GetShortBySlugUseCase } from "@/modules/shorts/application/usecases/getshortbyslug.usecase";
import { LikeShortUseCase } from "@/modules/shorts/application/usecases/likeshort.usecase";
import { UnlikeShortUseCase } from "@/modules/shorts/application/usecases/unlikeshort.usecase";
import { ShareShortUseCase } from "@/modules/shorts/application/usecases/shareshort.usecase";
import { RecordShortViewUseCase } from "@/modules/shorts/application/usecases/recordshortview.usecase";
import { ShortsRepositoryImpl } from "@/modules/shorts/infrastructure/repositories/shorts.repository.impl";

/**
 * registerShortsDependencies
 *
 * @description
 * Registers the shorts repository (singleton) and its use cases (transient) into
 * the Awilix container.
 *
 * @param container - The application container to register into.
 */
export function registerShortsDependencies(container: AwilixContainer<Cradle>): void {
    container.register({
        shortsRepository: asClass(ShortsRepositoryImpl).singleton(),
        getShortsUseCase: asClass(GetShortsUseCase).transient(),
        getShortBySlugUseCase: asClass(GetShortBySlugUseCase).transient(),
        likeShortUseCase: asClass(LikeShortUseCase).transient(),
        unlikeShortUseCase: asClass(UnlikeShortUseCase).transient(),
        shareShortUseCase: asClass(ShareShortUseCase).transient(),
        recordShortViewUseCase: asClass(RecordShortViewUseCase).transient()
    });
}
```

Add the matching entries to the `Cradle` interface in
`src/shared/infrastructure/service.locator.ts` (`shortsRepository`, the six use cases) and
call `registerShortsDependencies(container)` where the other modules register.

---

## Tasks

- [ ] Port `IShortsRepositoryPort` + `IShortsFeedQuery` + `IShareShortInput` created.
- [ ] `ShortsRepositoryImpl` wraps all six client calls; every catch → `ProblemMapper.toFailure`.
- [ ] Six use cases created, each `IResultUseCase`, delegating to the port.
- [ ] `registerShortsDependencies` registers repo singleton + use cases transient.
- [ ] `Cradle` interface extended; `registerShortsDependencies` invoked at container setup.
- [ ] `container.cradle.getShortsUseCase` (etc.) resolve at runtime.
- [ ] Bookmark use cases left unregistered (deferred).
- [ ] `tsc` + biome clean.
</content>
