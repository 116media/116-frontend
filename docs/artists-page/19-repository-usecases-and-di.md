# 19 — Repository, Use Cases & DI

> **Resized for the expanded scope.** An earlier version of this document declared a five-method
> port, five use cases and six DI registrations, and an `IArtistCatalogQuery` with no `sort` field
> — which made *Chansons populaires* unexpressible even though `sort=views` already exists on the
> backend ([16](16-backend-gaps-and-contracts.md)). All four counts and the query type are
> **corrected** below.

Wires the entities and mapper from [18](18-domain-entities-and-mappers.md) into the app: the
repository port, its implementation against the generated client, the read use cases, and Awilix
registration. Shapes mirror `modules/articles` and `modules/videos` exactly.

> **Prerequisite:** `116.api.ts` must be regenerated (`yarn api:generate`) after
> [16](16-backend-gaps-and-contracts.md) Gap 1 and Gap 2 ship. Until then the list method and the
> `isVerified` field do not exist on the client and the index-page half of this document cannot be
> written. Never hand-edit the generated file.

## Repository port

**`src/modules/artists/application/repositories/artists.repository.port.ts`**

```ts
import type { IArticlePage } from "@/modules/articles/domain/entities/IArticlePage";
import type {
    ArtistReleaseType,
    IArtistAlbumEntity
} from "@/modules/artists/domain/entities/IArtistAlbumEntity";
import type { IArtistDetailEntity } from "@/modules/artists/domain/entities/IArtistDetailEntity";
import type { IArtistPage } from "@/modules/artists/domain/entities/IArtistPage";
import type { ILyricsPage } from "@/modules/lyrics/domain/entities/ILyricsPage";
import type { IVideoPage } from "@/modules/videos/domain/entities/IVideoPage";
import type { Result } from "@/shared/domain/results/result";

/**
 * Query for one page of the public artist directory. Mirrors GET /public/artists.
 * `letter` and `search` are mutually exclusive; the caller enforces that, the server
 * rejects the combination.
 *
 * @interface IArtistsDirectoryQuery
 *
 * @property {number} pageIndex - Zero-based page number
 * @property {number} pageSize - Items per page
 * @property {string} [letter] - Single bucket, "A"–"Z" or "#"
 * @property {string} [search] - Name substring, minimum two characters
 */
export interface IArtistsDirectoryQuery {
    pageIndex: number;
    pageSize: number;
    letter?: string;
    search?: string;
}

/**
 * Sort keys a catalog request may carry. `views` backs Chansons populaires, `publishedAt`
 * backs every date-ordered section. Both already exist on GET /public/lyrics.
 */
export type ArtistCatalogSort = "views" | "publishedAt";

/**
 * Query for one page of a single artist's catalog section.
 *
 * @interface IArtistCatalogQuery
 *
 * @property {string} slug - The artist's slug
 * @property {number} pageIndex - Zero-based page number
 * @property {number} pageSize - Items per page
 * @property {ArtistCatalogSort} [sort] - Ordering key; defaults to `publishedAt`
 */
export interface IArtistCatalogQuery {
    slug: string;
    pageIndex: number;
    pageSize: number;
    sort?: ArtistCatalogSort;
}

/**
 * Query for an artist's releases, scoped to one release type so Albums and Mixtapes are
 * two calls against one endpoint.
 *
 * @interface IArtistReleasesQuery
 * @extends {IArtistCatalogQuery}
 *
 * @property {ArtistReleaseType} releaseType - Which heading this request fills
 */
export interface IArtistReleasesQuery extends Omit<IArtistCatalogQuery, "sort"> {
    releaseType: ArtistReleaseType;
}

/**
 * Port for the artists module's read operations.
 *
 * @interface IArtistsRepositoryPort
 */
export interface IArtistsRepositoryPort {
    getArtists(query: IArtistsDirectoryQuery): Promise<Result<IArtistPage>>;
    getArtistBySlug(slug: string): Promise<Result<IArtistDetailEntity>>;
    getArtistLyrics(query: IArtistCatalogQuery): Promise<Result<ILyricsPage>>;
    getArtistVideos(query: IArtistCatalogQuery): Promise<Result<IVideoPage>>;
    getArtistReleases(query: IArtistReleasesQuery): Promise<Result<IArtistAlbumEntity[]>>;
    getArtistNews(query: IArtistCatalogQuery): Promise<Result<IArticlePage>>;
}
```

**Correction — the port grew from five methods to six**, and `IArtistCatalogQuery` gained `sort`.

`sort` is the load-bearing change. Chansons populaires and Dernières chansons are the *same
endpoint with different orderings* ([07](07-artist-detail-tabs.md)); without a `sort` field on the
query there is no way to express Populaires at all, and the section would have looked blocked on a
backend gap it does not have. `sort=views` already ships
([16](16-backend-gaps-and-contracts.md)) — the gap was in this document, not in the API.

Notes on the shape:

- **The port is read-only.** No claim mutation. The claim endpoint exists on the backend, but
  whether the frontend exposes a CTA for it is unresolved ([22](22-verified-artists-and-claiming.md),
  [25](25-open-questions.md)) — the method is added when that question is answered, not before.
- **Every method takes `slug`, never an id.** The whole surface is slug-addressed and the client
  never holds an artist id ([14](14-data-requirements.md)).
- **`getArtistReleases` replaces the earlier `getArtistAlbums(slug)`.** Albums and mixtapes are one
  query behind a `releaseType` filter (Gap 3 + 4), not two methods. It takes the catalog query's
  page fields at page size 12 ([08](08-catalog-sections.md)) — realistically one page for every
  artist, but the parameter is there so a prolific discography is not silently truncated. `sort` is
  omitted: release ordering is fixed at `ReleaseYear` desc, then `Name`.
- **The array-returning methods return one page's items, not an envelope.** Exhaustion is decided
  against `totals` on the profile entity ([18](18-domain-entities-and-mappers.md)), which the client
  already holds — the heading count and the load-more control read the same number, which is the
  rule [08](08-catalog-sections.md) sets for every section.
- **`getArtistNews` returns `IArticlePage`**, the articles module's own page entity. This module
  does not re-map articles ([18](18-domain-entities-and-mappers.md)).
- **`getArtistTourDates` returns both halves in one array**, ordered by the caller. The
  upcoming/past split is computed at render from today's date, never stored
  ([14](14-data-requirements.md)); `includePast` only controls whether past dates are fetched at
  all, and the page fields apply to them alone — upcoming dates are never paginated
  ([08](08-catalog-sections.md)).
- **Only the first four methods are servable today.** The rest land with Gaps 3, 4 and 5; until then their
  sections do not render ([08](08-catalog-sections.md)).

## Repository implementation

**`src/modules/artists/infrastructure/repositories/artists.repository.impl.ts`**

```ts
import type {
    IArtistCatalogQuery,
    IArtistReleasesQuery,
    IArtistsDirectoryQuery,
    IArtistsRepositoryPort
} from "@/modules/artists/application/repositories/artists.repository.port";
import type { IArtistAlbumEntity } from "@/modules/artists/domain/entities/IArtistAlbumEntity";
import type { IArtistDetailEntity } from "@/modules/artists/domain/entities/IArtistDetailEntity";
import type { IArtistPage } from "@/modules/artists/domain/entities/IArtistPage";
import { ArtistsMapper } from "@/modules/artists/infrastructure/mappers/artists.mapper";
import type { ILyricsPage } from "@/modules/lyrics/domain/entities/ILyricsPage";
import { LyricsMapper } from "@/modules/lyrics/infrastructure/mappers/lyrics.mapper";
import type { IVideoPage } from "@/modules/videos/domain/entities/IVideoPage";
import { VideosMapper } from "@/modules/videos/infrastructure/mappers/videos.mapper";
import { err, ok, type Result } from "@/shared/domain/results/result";
import type { Api } from "@/shared/infrastructure/api/generated/116.api";
import { ProblemMapper } from "@/shared/infrastructure/mappers/problem.mapper";

/**
 * Artists repository implementation using the public REST API.
 *
 * @description
 * Implements IArtistsRepositoryPort by delegating to an injected Api instance, browser
 * (Awilix `api`) or server (createServerApiClient()). Every method returns `Result<T>`;
 * errors are converted to typed Failure values via ProblemMapper.
 */
export class ArtistsRepositoryImpl implements IArtistsRepositoryPort {
    private readonly api: Api<unknown>["api"];

    constructor({ client }: { client: Api<unknown> }) {
        this.api = client.api;
    }

    async getArtists(query: IArtistsDirectoryQuery): Promise<Result<IArtistPage>> {
        try {
            const response = await this.api.getPublicArtists({
                pageIndex: query.pageIndex,
                pageSize: query.pageSize,
                letter: query.letter,
                search: query.search
            });
            return ok(
                ArtistsMapper.artistPageFromDto(
                    response.data.artists,
                    response.data.availableLetters ?? null
                )
            );
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getArtistBySlug(slug: string): Promise<Result<IArtistDetailEntity>> {
        try {
            const response = await this.api.getPublicArtistBySlug(slug);
            return ok(ArtistsMapper.artistDetailFromDto(response.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getArtistLyrics(query: IArtistCatalogQuery): Promise<Result<ILyricsPage>> {
        try {
            const response = await this.api.getPublicArtistBySlug(query.slug, {
                lyricsPageIndex: query.pageIndex,
                lyricsPageSize: query.pageSize,
                lyricsSort: query.sort ?? "publishedAt",
                videosPageSize: 0
            });
            return ok(LyricsMapper.lyricsPageFromDto(response.data.lyrics));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getArtistVideos(query: IArtistCatalogQuery): Promise<Result<IVideoPage>> {
        try {
            const response = await this.api.getPublicArtistBySlug(query.slug, {
                videosPageIndex: query.pageIndex,
                videosPageSize: query.pageSize,
                lyricsPageSize: 0
            });
            return ok(VideosMapper.videoPageFromDto(response.data.videos));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getArtistReleases(query: IArtistReleasesQuery): Promise<Result<IArtistAlbumEntity[]>> {
        try {
            const response = await this.api.getPublicArtistReleases(query.slug, {
                releaseType: query.releaseType
            });
            return ok(ArtistsMapper.artistAlbumListFromDto(response.data.releases));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }
}
```

`getArtistReleases` and `getArtistNews` are omitted above — they are the same six lines against
endpoints that do not exist yet (Gaps 3, 4 and 5). Write them when the gap lands and the client is
regenerated, not before; a method calling a `getPublicArtistReleases` that `116.api.ts` does not
export will not compile.

**`lyricsSort` is the whole of Chansons populaires.** The section is one extra query parameter on a
call the profile already makes, not a new endpoint — the backend support is already there
([16](16-backend-gaps-and-contracts.md)). Confirm the generated parameter's exact name and its
accepted values after regeneration; `views` and `publishedAt` are what the design assumes.

### The catalog paging problem, stated honestly

`GET /public/artists/{slug}` takes `PaginatedRequest` for **both** catalogs
([15](15-backend-current-state.md)). Paging one tab therefore re-requests the whole profile.

The implementation above suppresses the other catalog with `pageSize: 0` so the wasted work is
bounded, but this is a compromise:

| Option | Cost |
|---|---|
| **A.** Re-call the profile endpoint with the other page size 0 *(above)* | one redundant artist row + one count query per page-load |
| **B.** Add `GET /public/artists/{slug}/lyrics` and `/videos` | two new backend endpoints, not currently in [16](16-backend-gaps-and-contracts.md) |

**Option A ships v1.** It is correct, needs no backend work, and the redundancy is a single row
lookup — not a page of data. If profiling shows it matters, B is a clean follow-up that changes
only this file. Confirm `pageSize: 0` is accepted by the backend's `PaginatedRequest` validation
before relying on it; if it enforces a minimum, use `pageSize: 1` and discard the result.

## Use cases

**Nine** thin `Result` pass-throughs — corrected from the earlier *"Five thin use cases"*, which
counted a three-tab profile. Each is identical in shape to `GetPublishedArticlesUseCase`. One is
shown in full; the rest differ only in name, input, and output type.

**`src/modules/artists/application/usecases/getartists.usecase.ts`**

```ts
import type {
    IArtistsDirectoryQuery,
    IArtistsRepositoryPort
} from "@/modules/artists/application/repositories/artists.repository.port";
import type { IArtistPage } from "@/modules/artists/domain/entities/IArtistPage";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetArtistsUseCase
 * @extends {IResultUseCase<IArtistsDirectoryQuery, IArtistPage>}
 */
interface IGetArtistsUseCase extends IResultUseCase<IArtistsDirectoryQuery, IArtistPage> {}

/**
 * Use case for fetching one page of the public artist directory.
 *
 * @class GetArtistsUseCase
 * @implements {IGetArtistsUseCase}
 *
 * @description
 * Fetches one page of artists with published content, optionally scoped to a letter
 * bucket or a name search. Delegates to the artists repository and returns its
 * `Result<IArtistPage>` unchanged.
 */
export class GetArtistsUseCase implements IGetArtistsUseCase {
    private readonly artistsRepository: IArtistsRepositoryPort;

    /**
     * @param artistsRepository - Repository for artist operations (injected)
     */
    constructor({ artistsRepository }: { artistsRepository: IArtistsRepositoryPort }) {
        this.artistsRepository = artistsRepository;
    }

    /**
     * Executes the get artists use case.
     *
     * @param query - Paging plus an optional letter or search filter
     * @returns {Promise<Result<IArtistPage>>} `ok(IArtistPage)` on success, `err(Failure)` on failure
     */
    async execute(query: IArtistsDirectoryQuery): Promise<Result<IArtistPage>> {
        return this.artistsRepository.getArtists(query);
    }
}
```

| File | Class | Input → Output | Ships with |
|---|---|---|---|
| `getartists.usecase.ts` | `GetArtistsUseCase` | `IArtistsDirectoryQuery` → `IArtistPage` | Gap 1 |
| `getartistbyslug.usecase.ts` | `GetArtistBySlugUseCase` | `string` → `IArtistDetailEntity` | today |
| `getartistlyrics.usecase.ts` | `GetArtistLyricsUseCase` | `IArtistCatalogQuery` → `ILyricsPage` | today |
| `getartistvideos.usecase.ts` | `GetArtistVideosUseCase` | `IArtistCatalogQuery` → `IVideoPage` | today |
| `getartistreleases.usecase.ts` | `GetArtistReleasesUseCase` | `IArtistReleasesQuery` → `IArtistAlbumEntity[]` | Gap 3 + 4 |
| `getartistnews.usecase.ts` | `GetArtistNewsUseCase` | `IArtistCatalogQuery` → `IArticlePage` | Gap 5 |

**`GetArtistLyricsUseCase` serves both Populaires and Récentes**, distinguished only by
`query.sort`. It is not two use cases: the input, the output and the repository call are identical
and only an ordering differs. Two classes would exist solely to hardcode one field.

**Correction:** `getartistalbums.usecase.ts` / `GetArtistAlbumsUseCase` is renamed
`getartistreleases` / `GetArtistReleasesUseCase` and now takes a `releaseType`. Mixtapes are the
same query as albums ([08](08-catalog-sections.md)).

Use cases stay pass-throughs. The default-tab resolution, the letter/search mutual exclusion and
the 404-on-empty rule are all decided elsewhere — in the mapper
([18](18-domain-entities-and-mappers.md)), the container and the route respectively. Nothing
branches here.

## DI registration

**`src/modules/artists/infrastructure/dependencies/artists.dependencies.ts`**

```ts
import { asClass, type AwilixContainer } from "awilix";
import { GetArtistBySlugUseCase } from "@/modules/artists/application/usecases/getartistbyslug.usecase";
import { GetArtistLyricsUseCase } from "@/modules/artists/application/usecases/getartistlyrics.usecase";
import { GetArtistNewsUseCase } from "@/modules/artists/application/usecases/getartistnews.usecase";
import { GetArtistReleasesUseCase } from "@/modules/artists/application/usecases/getartistreleases.usecase";
import { GetArtistVideosUseCase } from "@/modules/artists/application/usecases/getartistvideos.usecase";
import { GetArtistsUseCase } from "@/modules/artists/application/usecases/getartists.usecase";
import { ArtistsRepositoryImpl } from "@/modules/artists/infrastructure/repositories/artists.repository.impl";

/**
 * Registers artists module dependencies in the Awilix container.
 *
 * @description
 * Registers the repository as a singleton and every use case as transient.
 * Called during application bootstrap in the service locator.
 *
 * @param container - The Awilix dependency injection container
 */
export function registerArtistsDependencies(container: AwilixContainer): void {
    container.register({
        artistsRepository: asClass(ArtistsRepositoryImpl).singleton(),
        getArtistsUseCase: asClass(GetArtistsUseCase).transient(),
        getArtistBySlugUseCase: asClass(GetArtistBySlugUseCase).transient(),
        getArtistLyricsUseCase: asClass(GetArtistLyricsUseCase).transient(),
        getArtistVideosUseCase: asClass(GetArtistVideosUseCase).transient(),
        getArtistReleasesUseCase: asClass(GetArtistReleasesUseCase).transient(),
        getArtistNewsUseCase: asClass(GetArtistNewsUseCase).transient()
    });
}
```

**Seven registrations: one repository singleton and six transient use cases** — corrected from the
earlier six, which counted the repository plus five use cases.

The registration block grows with the gaps rather than shipping empty: a use case is registered in
the same change that adds its file and its endpoint. Registering a class whose repository method
calls a non-existent generated client method does not fail at registration time — it fails at the
first call, in production, on whichever profile happens to have a release.

**`src/shared/infrastructure/service.locator.ts`** — two edits, both alongside the existing
per-module blocks:

```ts
import { registerArtistsDependencies } from "@/modules/artists/infrastructure/dependencies/artists.dependencies";
// ...
registerArticlesDependencies(container);
registerVideosDependencies(container);
registerShortsDependencies(container);
registerArtistsDependencies(container);
```

and the **ten** new registrations added to the `Cradle` type so `container.cradle.getArtistsUseCase`
type-checks. The locator declares every use case's type explicitly — a missing entry compiles the
registration but leaves the cradle property `unknown` at every call site.

Server-side calls resolve the same use cases through `createServerCradle()`, which re-registers a
cookie-aware `client` in a per-request scope. Nothing module-specific is needed for SSR.

## Task checklist

- [ ] Backend Gaps 1, 1a, 2 shipped; `yarn api:generate` run; `getPublicArtists`,
  `getPublicArtistBySlug`, and `isVerified` present in `116.api.ts`.
- [ ] Confirm the generated method and DTO names against this document and correct the imports.
- [ ] Confirm `PaginatedRequest` accepts `pageSize: 0`, or switch to the `pageSize: 1` fallback.
- [ ] Confirm the generated lyrics `sort` parameter name and its accepted values.
- [ ] Add `artists.repository.port.ts`, `artists.repository.impl.ts`.
- [ ] Add the four servable-today use cases; add the other five with their gaps.
- [ ] Add `artists.dependencies.ts`; register it and the ten cradle types in `service.locator.ts`.
- [ ] `tsc --noEmit` clean.
- [ ] `biome check` clean.
