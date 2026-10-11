# Spec 18 — Frontend: Homepage Sections & Detail-Page Redesign

Covers the frontend side of
[../06-musixmatch-scale-expansion.md](../06-musixmatch-scale-expansion.md). Depends on specs
13–17 shipping backend-side; the client (`116.api.ts`) regenerates once they do.

## Homepage sections (`app/(public)/lyrics/page.tsx`)

New island containers, each owning its own query (per this app's island-container rule):

```text
sections/LyricsHomepageSections/
  LyricsVideosRail/          # "Lyrics Videos" — 3-col VideosGrid, category = 116 Lyrics
  TopLyricsRail/              # "Top Lyrics" — Tabs (views/likes/shares) + LyricsGrid
  NewLyricsRail/               # "New Lyrics" — LyricsGrid, fixed 10, no pagination
```

- `LyricsVideosRail` — `useVideosByCategory(LYRICS_VIDEO_CATEGORY_ID)` (existing hook, existing
  endpoint), rendered through `VideosGrid` with a new `columns={3}` prop.
- `TopLyricsRail` — `useTopLyrics(metric)`, three fixed (non-infinite) `useQuery` calls switched by
  a tab control; `metric` state lives in this container, not lifted to the page.
- `NewLyricsRail` — `useLyricsFeed({ pageSize: 10, sort: "createdAt" })` sliced to one page, no
  `useInfiniteQuery`.

These sit above the existing `LyricsFeedContainer` (search + language filter + full grid), which is
unchanged.

## Detail-page layout (`app/(public)/lyrics/[slug]/page.tsx`)

`LyricsDetailBody` restructures into the two-column layout from 06 §2:

```text
sections/LyricsDetailBody/
  LyricsDetailBody.tsx          # grid: main column + <LyricsSimilarSidebar> aside
  LyricsDetailBody.Banner.tsx   # cover/album art, title, artist name (Link when artistSlug present)
  LyricsDetailBody.Credits.tsx  # trimmed: album / release year / label only
  LyricsDetailBody.Writers.tsx  # new — songwriter / producer, rendered below the lyrics body
  LyricsDetailBody.AlbumTracks.tsx    # new — "More from this album" card
  LyricsDetailBody.StreamingModal.tsx # new — "Go to album" launcher + modal
```

`LyricsDetailBody.Banner`'s artist name renders as
`<Link href={ARTIST_DETAIL_PATH_RESOLVED(artistSlug)}>{artistName}</Link>` only when
`ILyricsDetailEntity.artistSlug` is non-null; otherwise plain text — no conditional layout shift,
just swap the element.

## Translation UI

```text
sections/LyricsTranslation/
  LyricsLanguageSwitcher/     # tabs/select: original + every language with a published translation
  LyricsTranslationBody/      # renders the active language's text (original or LyricsMapper-mapped translation)
  LyricsTranslationReview/    # propose-a-correction form + revision history list + vote buttons
```

`useLyricsTranslations(lyricsId)` — list of available languages. `useRequestTranslation(lyricsId,
language)` — mutation calling the new `POST /translations` endpoint (spec 15), invalidates the
list query on success so a newly-generated language appears in the switcher immediately.
`useProposeTranslationRevision` / `useVoteOnRevision` — mutations, optimistic vote-count bump on
the revision list (mirrors the existing `useToggleLyricsLike` optimistic pattern).

## Similar-lyrics sidebar

`LyricsSimilarSection` is renamed `LyricsSimilarSidebar` (same data hook, `useSimilarLyrics`,
unchanged — the sourcing logic change is entirely backend-side, spec 14) — only the container's
layout position moves, from a below-the-fold section to `<aside>` in the two-column grid, sticky on
desktop (`position: sticky; top: <header height>`), stacked below the album-tracks card on mobile.

## Artist module (new)

```text
src/modules/artists/
  domain/entities/IArtistDetailEntity.ts   # name, slug, bio, avatarUrl, songs, videos
  application/usecases/getartistbyslug.usecase.ts
  infrastructure/mappers/artists.mapper.ts
  infrastructure/repositories/artists.repository.impl.ts
  presentation/
    hooks/useArtistDetail.ts
    components/sections/ArtistDetailBody/   # bio, avatar, tabs: songs / videos
    containers/ArtistDetailContainer/
```

`app/(public)/artistes/[slug]/page.tsx` (new route — the `/artistes` index page, spec 06, stays the
"coming soon" `EmptyState` unchanged; only per-slug pages are real now, and only for claimed
artists — an unclaimed artist has no `slug` to link to in the first place, so this route is only
ever reached via a real link, never a guessable/browsable one until a directory feature is
separately scoped).

## Task checklist

- [ ] `VideosGrid` gains `columns?: 3 | 4` prop, `LyricsVideosRail` island container
- [ ] `useTopLyrics`, `TopLyricsRail` with tab control
- [ ] `NewLyricsRail`
- [ ] `LyricsDetailBody` two-column layout; `.Banner`, `.Writers`, `.AlbumTracks`,
  `.StreamingModal` new files; `.Credits` trimmed
- [ ] `LyricsSimilarSection` renamed/repositioned to `LyricsSimilarSidebar`
- [ ] `src/modules/lyrics/presentation/components/sections/LyricsTranslation/` (three components)
  + corresponding hooks
- [ ] New `src/modules/artists/` module + `/artistes/[slug]` route
- [ ] i18n: new keys for all of the above, `fr`/`en` mirrored (existing convention)
- [ ] `tsc`/biome/build clean; manual verification of all new sections and the two-column detail
  layout at mobile and desktop breakpoints
