# 03 — Domain & Module

Shorts get a dedicated `src/modules/shorts/` module, mirroring the `videos` module's clean
layering: `I`-prefixed domain entities, a `Result<T>` repository (port + impl), one class
per use case, a stateless mapper with `xListFromDto` helpers, Awilix DI, and a presentation
layer.

---

## Folder layout

```
src/modules/shorts/
  domain/entities/
    IShortVideoEntity.ts          short entity (frontend shape)
    IShortVideoPage.ts            paginated page + hasNextPage
  application/
    repositories/shorts.repository.port.ts
    usecases/getshorts.usecase.ts
    usecases/getshortbyslug.usecase.ts
    usecases/likeshort.usecase.ts
    usecases/unlikeshort.usecase.ts
    usecases/shareshort.usecase.ts
    usecases/recordshortview.usecase.ts
  infrastructure/
    mappers/shorts.mapper.ts
    repositories/shorts.repository.impl.ts
    dependencies/shorts.dependencies.ts
  presentation/
    constants/shortKeys.ts
    hooks/useShortsFeed.ts
    hooks/useToggleShortLike.ts
    hooks/useShareShort.ts
    hooks/useRecordShortView.ts
    containers/ShortsFeedSectionContainer/
    context/ShortsPlayerProvider.tsx
    components/sections/ShortsStrip/
    components/cards/ShortCard/
    components/modals/ShortsPlayer/          (compound: Modal/Slide/Video/ActionRail/Nav/…)
    components/media/ShortVideoPlayer/
    utils/notification/shorts.share.notification.ts
    i18n/{en,fr}/…
```

Deferred use cases/hooks (`bookmarkshort` / `unbookmarkshort`, `useToggleShortBookmark`)
are specced but not wired in this cut.

---

## Domain entities

`IShortVideoEntity` — the frontend shape. Drops audit/author-internal fields the surfaces
don't need; normalizes nullables and counts. There is no `isLiked` to carry (the DTO has
none), so the entity has none either — liked state is player-local.

```ts
export interface IShortVideoEntity {
    id: string;
    title: string;
    slug: string;
    videoUrl: string | null;
    thumbnailUrl: string | null;
    hasFullVideo: boolean;
    viewCount: number;
    likeCount: number;
    shareCount: number;
    authorName: string | null;
}
```

`IShortVideoPage` — the paged envelope, `hasNextPage` derived exactly as `videos` does:

```ts
export interface IShortVideoPage {
    items: IShortVideoEntity[];
    pageIndex: number;
    pageSize: number;
    count: number;
    hasNextPage: boolean;
}
```

`bookmarkCount` and the parent-video linkage (`videoId`) are dropped from the entity in
this cut — add them back when bookmark/save or the "watch full video" affordance ships.

---

## Mapper

`ShortsMapper` — stateless, pure, with the mandated list + page helpers (call sites never
`.map(Mapper.x)`):

```ts
export const ShortsMapper = {
    shortFromDto(dto: ShortVideoDto): IShortVideoEntity { /* normalize nullables + counts */ },
    shortListFromDto(dtos: ShortVideoDto[]): IShortVideoEntity[] {
        return dtos.map(ShortsMapper.shortFromDto);
    },
    shortPageFromDto(dto: ShortVideoDtoPaginatedResult): IShortVideoPage {
        return {
            items: ShortsMapper.shortListFromDto(dto.items),
            pageIndex: dto.pageIndex,
            pageSize: dto.pageSize,
            count: dto.count,
            hasNextPage: (dto.pageIndex + 1) * dto.pageSize < dto.count
        };
    }
} as const;
```

`authorName` maps from `dto.author?.userName ?? null`.

---

## Repository & use cases

The port returns `Result<T>` from every method; the impl wraps each generated client call
in `try/catch`, mapping success through `ShortsMapper` and failure through
`ProblemMapper.toFailure`. Interaction use cases return `Result<boolean>` (the
`isSuccess` flag) so `runInteraction` can bridge them to the optimistic toggle.

```ts
export interface IShortsRepositoryPort {
    getShorts(query: IShortsFeedQuery): Promise<Result<IShortVideoPage>>;
    getShortBySlug(slug: string): Promise<Result<IShortVideoEntity>>;
    likeShort(shortId: string): Promise<Result<boolean>>;
    unlikeShort(shortId: string): Promise<Result<boolean>>;
    shareShort(input: IShareShortInput): Promise<Result<boolean>>;
    recordShortView(shortId: string): Promise<Result<boolean>>;
}
```

`IShortsFeedQuery { pageIndex: number; pageSize: number; search?: string }`.
`IShareShortInput { shortId: string; shareChannel?: string }`.

Each use case is one class implementing `IResultUseCase<Input, Output>`, constructor
destructuring `{ shortsRepository }`, `execute()` delegating to the port. Registered in
`shorts.dependencies.ts` — repository `asClass(...).singleton()`, use cases
`asClass(...).transient()` — and added to the `Cradle` interface in `service.locator.ts`.

The full JSDoc'd snippets are in [specs/01-domain-and-mappers.md](specs/01-domain-and-mappers.md)
and [specs/02-repository-and-usecases.md](specs/02-repository-and-usecases.md).
</content>
