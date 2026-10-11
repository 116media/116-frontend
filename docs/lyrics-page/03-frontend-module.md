# Lyrics Page — Frontend Module

New module: `src/modules/lyrics/`. Structured exactly like every other content module (clean
architecture: `domain/ → application/ → infrastructure/ → presentation/`). Originally scoped like
**`videos`** (read-only, no interactions) — that scope grew: lyrics now has view/like/share
tracking (spec 11), so it sits between `videos` and `articles` in size — it has the three simplest
interactions `shorts` has, but none of `articles`' comments/bookmarks.

## Layout

```text
src/modules/lyrics/
  domain/entities/
    ILyricsSummaryEntity.ts       # list-row shape: id, slug, songTitle, artistName, language, excerpt, coverImageUrl
    ILyricsDetailEntity.ts        # full page shape: + lyricsText, coverImageUrl, credits, counts, isLiked, videoSlug, meta* (no author)
    ILyricsPage.ts                # paginated page of ILyricsSummaryEntity (mirrors IArticlePage)
  application/
    repositories/lyrics.repository.port.ts
    usecases/
      getpublishedlyrics.usecase.ts
      getlyricsbyslug.usecase.ts
      getsimilarlyrics.usecase.ts
      likelyrics.usecase.ts
      unlikelyrics.usecase.ts
      sharelyrics.usecase.ts
      recordlyricsview.usecase.ts
  infrastructure/
    mappers/lyrics.mapper.ts
    repositories/lyrics.repository.impl.ts
    dependencies/lyrics.dependencies.ts
  presentation/
    constants/lyricsKeys.ts
    hooks/
      useLyricsFeed.ts
      useLyricsDetail.ts
      useSimilarLyrics.ts
      useToggleLyricsLike.ts
      useShareLyrics.ts
      useRecordLyricsView.ts
    components/
      cards/LyricsCard/                       # cover art, one card per list row (and similar-lyrics row)
      sections/LyricsGrid/                    # grid + loading/empty/error/end states
      sections/LyricsDetailBody/               # cover hero, credits card, engagement bar, full text, video cross-link
      sections/LyricsSimilarSection/           # up to 10 LyricsCards, reusing LyricsGrid
      navigation/LyricsSearchInput/
      navigation/LyricsLanguageSelect/        # searchable filter over the full ISO 639-1 list
      pages/LyricsDetail/LyricsDetail.NotFound.tsx
    containers/
      LyricsFeedContainer/
      LyricsDetailContainer/
    utils/json-ld/lyrics-json-ld.utils.ts
    i18n/
      index.ts
      locales/{en,fr}/{lyrics,lyrics-detail}.ts
```

This feature also touches one file **outside** this new module: `src/modules/videos/` gains a
`slug` field on `IVideoLyricsEntity` and a cross-link render in `VideoDetailLyrics.tsx` (spec 09,
question 5) — everything else in `videos` is unchanged.

## Domain entities

**`ILyricsSummaryEntity`** — the list-row shape, reused as-is for the similar-lyrics section.
Carries `slug` (the card's link) and `coverImageUrl` (the card's artwork), but deliberately
excludes `lyricsText` (the full body has no place in a card) and credits/counts/`meta*` (not
needed until the detail page):

```ts
export interface ILyricsSummaryEntity {
    id: string;
    slug: string;
    songTitle: string;
    artistName: string;
    language: string;
    excerpt: string; // first ~120 chars of lyricsText, for the card preview
    coverImageUrl: string | null;
}
```

**`ILyricsDetailEntity`** — the full standalone-page shape, the mirror of `IArticleDetailEntity` /
video's detail entity, *not* of `IVideoLyricsEntity` (which is deliberately stripped down for its
embedded use). Carries `videoSlug`, not the raw `videoId` — the backend resolves the linked
video's slug server-side in the same lookup (question 4), so the page never needs a second fetch
to render its "watch the video" cross-link. It also carries `artistSlug` alongside the existing
plain-text `artistName`, resolved the same way once the backend's `ArtistEntity` (spec 08 in the
backend docs) links a claimed profile — `null` for the common case of an unclaimed artist, in
which case `artistName` renders as plain text with no navigation. `credits` groups the five
song-credit fields requested (album, release year, label, songwriter, producer) into one nested
object rather than five flat fields:

```ts
export interface ILyricsCredits {
    album: string | null;
    releaseYear: number | null;
    label: string | null;
    songwriter: string | null; // who wrote the words — see the naming note below
    producer: string | null; // who produced the instrumental/recording
}

export interface ILyricsDetailEntity {
    id: string;
    slug: string;
    songTitle: string;
    artistName: string;
    artistSlug: string | null; // present → artist name links to /artistes/{artistSlug}
    lyricsText: string;
    language: string;
    coverImageUrl: string | null;
    credits: ILyricsCredits;
    viewCount: number;
    likeCount: number;
    shareCount: number;
    isLiked: boolean; // per-viewer, false for anonymous readers
    videoSlug: string | null; // present → "Watch the video" cross-link
    metaTitle: string | null;
    metaDescription: string | null;
}
```

No `author` field, and the requested "author" song credit is deliberately named `songwriter`, not
`author` or `writer`. `LyricsDto.Author` is CMS attribution (the admin who entered the record into
the system), not the songwriter or performer — naming the new credit field `Author` would collide
with that existing, unrelated field and reintroduce the exact ambiguity already resolved once in
this doc set. `artistName` identifies the performer; `credits.songwriter` identifies who wrote the
words, when known and distinct (see [05-open-questions.md](05-open-questions.md), question 2).

**`ILyricsPage`** — `{ items: ILyricsSummaryEntity[]; pageIndex: number; count: number;
hasNextPage: boolean }`, matching `IArticlePage`'s shape exactly so `useLyricsFeed` can reuse the
same `useInfiniteQuery` pattern as `useArticlesFeed`.

## Application layer

**`lyrics.repository.port.ts`** — seven methods: three reads, four interactions (no
comments/bookmarks ports exist for this module, unlike articles):

```ts
export interface ILyricsQuery {
    pageIndex: number;
    pageSize: number;
    search?: string;
    language?: string; // exact-match filter, e.g. "fr" / "ln" / "en" — question 6
}

export interface ILyricsRepositoryPort {
    getPublishedLyrics(query: ILyricsQuery): Promise<Result<ILyricsPage>>;
    getLyricsBySlug(slug: string): Promise<Result<ILyricsDetailEntity>>;
    getSimilarLyrics(lyricsId: string): Promise<Result<ILyricsSummaryEntity[]>>;
    likeLyrics(lyricsId: string): Promise<Result<boolean>>;
    unlikeLyrics(lyricsId: string): Promise<Result<boolean>>;
    shareLyrics(lyricsId: string, shareChannel: string): Promise<Result<boolean>>;
    recordLyricsView(lyricsId: string): Promise<Result<boolean>>;
}
```

Seven use cases, each a thin pass-through to the port (the established pattern — see
`getpublishedarticles.usecase.ts` for the read shape, `likeshort.usecase.ts` /
`recordshortview.usecase.ts` for the interaction shape every use case in this codebase follows).

## Infrastructure layer

**`lyrics.mapper.ts`** — a single `export const LyricsMapper = { ... } as const` object (this
codebase's mapper convention — see `ArticlesMapper`, `VideosMapper`), with
`LyricsMapper.lyricsSummaryFromDto`, `.creditsFromDto`, `.lyricsDetailFromDto`, and
`.lyricsPageFromDto` (list-mapping owned by the mapper — call sites never `.map(Mapper.x)`).
`lyricsSummaryFromDto` derives `excerpt` by truncating `lyricsText` client-side (the backend
doesn't send a separate excerpt field).

**`lyrics.repository.impl.ts`** — calls the generated `116.api.ts` client methods
(`getPublishedLyrics`, the single-param `getLyricsBySlug(slug)`, `getSimilarLyrics`,
`likeLyrics`/`unlikeLyrics`, `shareLyrics`, `recordLyricsView` — all seven only exist in this shape
once specs 01, 10, 11, and 12's backend changes ship and the client is regenerated), wraps each in
the shared `ProblemMapper.toFailure` → `Result<T>` pattern every repository impl uses.

**`lyrics.dependencies.ts`** — registers `lyricsRepository` as a singleton and all seven use cases
as transient, registered into the container from `service.locator.ts` alongside
`registerArticlesDependencies` / `registerVideosDependencies` / `registerShortsDependencies`.

## Presentation layer

- **`LyricsGrid`** — mirrors `ArticlesGrid`'s shape: `.Empty` / `.Error` / `.EndOfFeed` / `.Loading`
  sibling files, an `IntersectionObserver` sentinel for infinite scroll. Reused as-is by
  `LyricsSimilarSection`.
- **`LyricsSearchInput`** / **`LyricsLanguageSelect`** — the feed's two filter controls.
  `LyricsLanguageSelect` is a **searchable** filter over the full ISO 639-1 list (question 6) —
  the dashboard's own lyrics form proves content isn't limited to a handful of languages, so the
  filter mirrors `CountrySelect`'s searchable-popover pattern (query state, filtered results,
  `useDismiss`), not a plain `DropdownMenu` (which doesn't scale to ~180 items).
- **`LyricsFeedContainer`** — the smart container owning `useLyricsFeed` (an island container, per
  this codebase's component-folder rules), rendered from `app/(public)/lyrics/page.tsx`.
- **`LyricsDetailBody`** — cover hero, the credits card (`LyricsDetailBody.Credits`, rendering
  only the song-credit fields that are actually present), the engagement bar (view count, like
  toggle, share), the full lyrics text, and the video cross-link.
- **`LyricsSimilarSection`** — up to 10 `LyricsCard`s from `useSimilarLyrics`; renders nothing at
  all (no heading, no empty state) when the list resolves empty.
- **`LyricsDetailContainer`** — owns `useLyricsDetail` plus the engagement hooks
  (`useToggleLyricsLike`, `useShareLyrics`, `useRecordLyricsView`) and `useSimilarLyrics`, rendered
  from the `[slug]` route.
- **`lyrics-json-ld.utils.ts`** — builds `schema.org` `MusicComposition` + nested `MusicRecording`
  structured data for the detail page (see
  [04-routes-and-artist-placeholder.md](04-routes-and-artist-placeholder.md) for the schema-type
  decision), mirroring `article-json-ld.utils.ts`'s shape (fields omitted rather than emitted
  null, mapped entity data only, never raw HTML).
- **i18n** — a new per-module namespace, `lyricsMessages`, composed into `resources.ts` alongside
  `articlesMessages` / `videosMessages` / `shortsMessages`, per the existing composition-root
  pattern (`../../../../docs/i18n/frontend/04-message-modules.md`).

Full code-level specs: [specs/02-domain-entities-and-mapper.md](specs/02-domain-entities-and-mapper.md),
[specs/03-repository-usecases-and-di.md](specs/03-repository-usecases-and-di.md),
[specs/05-lyrics-detail-page.md](specs/05-lyrics-detail-page.md) (page composition, credits card,
engagement bar, similar-lyrics section), and — for the `videos`-module cross-link —
[specs/09-video-cross-link.md](specs/09-video-cross-link.md).
