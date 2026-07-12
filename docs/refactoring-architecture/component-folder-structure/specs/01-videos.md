# Spec — videos migration

Target: [../06-target-videos.md](../06-target-videos.md). Prereq: Phase 1 (VideoPlayer in
shared, dead files deleted).

## Containers

- [x] `VideoDetail/index.tsx` → `containers/VideoDetailContainer/VideoDetailContainer.tsx` (+ `index.ts`)
- [x] `VideoFeedSection/index.tsx` → `containers/VideoFeedSectionContainer/…`
- [x] `ShowsSection/index.tsx` → `containers/ShowsSectionContainer/…`
- [x] `VideoExclusiveShow/index.tsx` → `containers/VideoExclusiveShowContainer/…`

## pages/VideoDetail (decompose the flat pile)

- [x] `VideoDetail.tsx` → `components/pages/VideoDetail/VideoDetail.tsx`
- [x] `VideoDetail.Loading/.Error/.NotFound.tsx` → same folder (flat state files)
- [x] add `components/pages/VideoDetail/index.ts`
- [x] `videoJsonLd.ts` → `utils/json-ld/video-json-ld.utils.ts` (X4); add `buildYoutubeEmbedUrl` (DUP8)
- [x] player files → **shared** (Phase 1): `VideoDetail.tsx` now imports `@/shared/…/media/VideoPlayer`

## sections (each its own folder)

- [x] `VideoDetail.Header.tsx` → `sections/VideoDetailHeader/VideoDetailHeader.tsx`
- [x] `VideoDetail.Scoreboard.tsx` → `sections/VideoDetailScoreboard/…` (keep `ScoreboardColumn` inline — R7a/X1)
- [x] `VideoDetail.Tabs.tsx` → `sections/VideoDetailTabs/…`
- [x] `VideoDetail.Description.tsx` → `sections/VideoDetailDescription/…`
- [x] `VideoDetail.Lyrics.tsx` → `sections/VideoDetailLyrics/…` (+ `VideoDetailLyrics.Loading.tsx`) ★ island
- [x] `VideoDetail.Similar.tsx` → `sections/VideoDetailSimilar/…` (+ `.Loading.tsx`, `SimilarCardSkeleton` private — X9) ★ island
- [x] `VideoDetail.Tags.tsx` → `sections/VideoDetailTags/…`
- [x] `VideoFeedSection/*` → `sections/VideoFeedSection/` (`.tsx`, `.Loading.tsx`, `types.ts`, `index.ts`); `VideoFeedSection/dummy-feed.ts` → `data/video-feed.dummy.ts`
- [x] `ShowsSection/*` → `sections/ShowsSection/`; `dummy-shows.ts` → `data/shows.dummy.ts`
- [x] `VideoExclusiveShow/*` → `sections/VideoExclusiveShow/`; `VideoExclusiveShow/dummy-feed.ts` → `data/exclusive-show.dummy.ts`
- [x] `ExclusiveShowPoster/*` → `sections/VideoExclusiveShowPoster/`
- [x] `ExclusiveShowEpisodes/*` → `sections/VideoExclusiveShowEpisodes/`
- [x] `VideosPopularSidebar/*` → `sections/VideosPopularSidebar/` (`PopularRowSkeleton` private in `.Loading.tsx` — X7/C1) ★ island

## cards

- [x] `VideoCard/*` → `cards/VideoCard/` (compound; keep dotted parts + `types.ts` + `index.ts`)
- [x] `VideosMegaMenuCard/*` → `cards/VideosMegaMenuCard/`; rename `…CardStats.tsx` → `VideosMegaMenuCard.Stats.tsx`; **delete** `…CardBody.tsx` + `…CardImage.tsx` (D1) and their types
- [x] `ShowCard/*` → `cards/ShowCard/` (`RevealOnHover` inline — X2)

## carousels / modals / navigation

- [x] `ShowsCarousel/*` → `carousels/ShowsCarousel/`
- [x] `VideoShareModal.tsx` → `modals/VideoShareModal/` (use shared `resolveShareUrl` — DUP2)
- [x] `VideoRatingModal.tsx` → `modals/VideoRatingModal/`
- [x] `VideoPlaylistModal.tsx` → `modals/VideoPlaylistModal/`
- [x] `VideosMegaMenu/index.tsx` → `navigation/VideosMegaMenu/VideosMegaMenu.tsx`; `VideosMegaCategoryList.tsx` → `VideosMegaMenu.CategoryList.tsx` (compound)

## non-component dirs

- [x] confirm `constants/` holds `videoKeys.ts`; `PLYR_OPTIONS` stays inline in the **shared** `VideoPlayer.Plyr.tsx` (the player left this module — R10a), so no `plyr.ts` here; `STAR_POSITIONS` (DUP7) and `SENTINEL_OPTIONS` (DUP6) live in **`shared/presentation/constants/`**, not here
- [x] all dummies live under `data/` as `*.dummy.ts`
- [x] `yarn lint:types` + `biome` + `yarn build` clean
