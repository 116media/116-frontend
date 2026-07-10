# 06 — Target Structure: videos

Full target tree. Legend: `{ a.tsx · index.ts }` = a folder containing exactly those files.
`★ island container` = owns its own query (R3). `← COMPOUND` = one folder, dotted parts (R8).
`VideoPlayer` is **not here** — it is a shared library (R10a); see [09](09-target-shared.md).

```
modules/videos/presentation/
├── containers/
│   ├── VideoDetailContainer/          { VideoDetailContainer.tsx · index.ts }
│   ├── VideoFeedSectionContainer/     { VideoFeedSectionContainer.tsx · index.ts }
│   ├── ShowsSectionContainer/         { ShowsSectionContainer.tsx · index.ts }
│   └── VideoExclusiveShowContainer/   { VideoExclusiveShowContainer.tsx · index.ts }
├── components/
│   ├── pages/
│   │   └── VideoDetail/
│   │       ├── VideoDetail.tsx                    # composes shared VideoPlayer + sections + modals
│   │       ├── VideoDetail.Loading.tsx
│   │       ├── VideoDetail.Error.tsx
│   │       ├── VideoDetail.NotFound.tsx
│   │       └── index.ts
│   ├── sections/
│   │   ├── VideoDetailHeader/         { VideoDetailHeader.tsx · index.ts }
│   │   ├── VideoDetailScoreboard/     { VideoDetailScoreboard.tsx · index.ts }   (private ScoreboardColumn inline)
│   │   ├── VideoDetailTabs/           { VideoDetailTabs.tsx · index.ts }
│   │   ├── VideoDetailDescription/    { VideoDetailDescription.tsx · index.ts }
│   │   ├── VideoDetailLyrics/         { VideoDetailLyrics.tsx · VideoDetailLyrics.Loading.tsx · index.ts }   ★ island
│   │   ├── VideoDetailSimilar/        { VideoDetailSimilar.tsx · VideoDetailSimilar.Loading.tsx · index.ts }  ★ island
│   │   ├── VideoDetailTags/           { VideoDetailTags.tsx · index.ts }
│   │   ├── VideoFeedSection/          { VideoFeedSection.tsx · VideoFeedSection.Loading.tsx · types.ts · index.ts }
│   │   ├── ShowsSection/              { ShowsSection.tsx · ShowsSection.Loading.tsx · index.ts }
│   │   ├── VideoExclusiveShow/        { VideoExclusiveShow.tsx · VideoExclusiveShow.Loading.tsx · types.ts · index.ts }
│   │   ├── VideoExclusiveShowPoster/  { VideoExclusiveShowPoster.tsx · index.ts }
│   │   ├── VideoExclusiveShowEpisodes/{ VideoExclusiveShowEpisodes.tsx · index.ts }
│   │   └── VideosPopularSidebar/      { VideosPopularSidebar.tsx · VideosPopularSidebar.Loading.tsx · index.ts }  ★ island
│   ├── cards/
│   │   ├── VideoCard/                                    ← COMPOUND
│   │   │   ├── VideoCard.Vertical.tsx
│   │   │   ├── VideoCard.Horizontal.tsx
│   │   │   ├── VideoCard.Media.tsx
│   │   │   ├── VideoCard.Rating.tsx
│   │   │   ├── VideoCard.Date.tsx
│   │   │   ├── VideoCard.ShareCount.tsx
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── VideosMegaMenuCard/                           ← COMPOUND
│   │   │   ├── VideosMegaMenuCard.Compact.tsx
│   │   │   ├── VideosMegaMenuCard.FeaturedFullBleed.tsx
│   │   │   ├── VideosMegaMenuCard.FeaturedSpotlight.tsx
│   │   │   ├── VideosMegaMenuCard.Stats.tsx
│   │   │   ├── types.ts
│   │   │   └── index.ts                                  (✗ Body/Image orphans deleted)
│   │   └── ShowCard/                  { ShowCard.tsx · index.ts }   (private RevealOnHover inline)
│   ├── carousels/
│   │   └── ShowsCarousel/             { ShowsCarousel.tsx · index.ts }
│   ├── modals/
│   │   ├── VideoShareModal/           { VideoShareModal.tsx · index.ts }
│   │   ├── VideoRatingModal/          { VideoRatingModal.tsx · index.ts }
│   │   └── VideoPlaylistModal/        { VideoPlaylistModal.tsx · index.ts }
│   └── navigation/
│       └── VideosMegaMenu/                               ← COMPOUND
│           ├── VideosMegaMenu.tsx
│           ├── VideosMegaMenu.CategoryList.tsx
│           ├── types.ts
│           └── index.ts
├── hooks/          (useVideoDetail, useSimilarVideos, useVideoDetailPopular, useYoutubeStats,
│                    useVideoLyrics, useMyPlaylists, useCreatePlaylist, useAddToPlaylist,
│                    useRateVideo, useShareVideo, useShows)
├── constants/      (videoKeys.ts, plyr.ts)   ← STAR_POSITIONS + SENTINEL_OPTIONS moved to shared/ (DUP6/DUP7)
├── data/           (video-detail.dummy.ts, video-feed.dummy.ts, shows.dummy.ts, exclusive-show.dummy.ts)
├── utils/          (json-ld/video-json-ld.utils.ts)   ← concern folders, dashboard-style (root 04)
├── i18n/  utils/notification/  (videos.playlist / videos.rating / videos.share)
```

Notes:
- **No `media/` bucket in videos** — `VideoPlayer` is a shared library, imported from
  `@/shared/presentation/components/common/VideoPlayer` by `VideoDetail.tsx`.
- Modals are lifted out of the page into `modals/` (reuse-ready — shorts/ads can open them).
- All `dummy-*.ts` consolidated into `data/` as `*.dummy.ts`; `videoJsonLd` → `utils/json-ld/video-json-ld.utils.ts` (concern-folder form — see [../04-utils-and-helpers.md](../04-utils-and-helpers.md)).
- Deletions and dedup: see [10-cleanups-and-debt.md](10-cleanups-and-debt.md).
