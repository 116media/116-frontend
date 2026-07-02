# Video Detail Page — Design & Implementation Docs

Design and implementation documentation for the web frontend **single video (video
detail) page** at `/videos/[slug]`. Every video card in the app — the feed grid, the
exclusive-show episodes, the shows carousel, the mega menu — already links to
`/videos/{slug}`; this page is the destination.

The page centers on a **Plyr-powered YouTube player** themed to the brand colors, framed
by the video's title, category, star rating, tags, and live YouTube statistics (views,
likes, comments). It carries a **share modal** (horizontal social button group), an
**add-to-playlist modal** (checkbox list of the viewer's playlists), a **popular-videos
sidebar**, and an animated **tab set** below the player: Description (default), Lyrics
(when linked), and Similar videos.

## Reading order

Design references (the why and the look):

| Doc | Covers |
|---|---|
| [01-overview.md](01-overview.md) | Goal, inputs, constraints |
| [02-architecture.md](02-architecture.md) | Vertical slice in the `videos` module |
| [03-backend-api-reference.md](03-backend-api-reference.md) | Every endpoint + DTO the page consumes |
| [04-page-composition.md](04-page-composition.md) | RSC → container → assembler, layout shell |
| [05-player.md](05-player.md) | Plyr + brand theming |
| [06-youtube-data.md](06-youtube-data.md) | YouTube Data API v3 stats |
| [07-header-and-meta.md](07-header-and-meta.md) | Title, category, rating, stats, actions |
| [08-share-modal.md](08-share-modal.md) | Share dialog + horizontal social group |
| [09-playlist-modal.md](09-playlist-modal.md) | Add-to-playlist dialog |
| [10-popular-videos-sidebar.md](10-popular-videos-sidebar.md) | Right column |
| [11-tabs.md](11-tabs.md) | Animated tab navigation |
| [12-similar-videos.md](12-similar-videos.md) | Similar grid inside the tabs |
| [13-state-management-and-hooks.md](13-state-management-and-hooks.md) | Queries, mutations, keys |
| [14-loading-empty-error.md](14-loading-empty-error.md) | Non-happy paths |
| [15-i18n.md](15-i18n.md) | Key groups, en/fr |
| [16-seo-and-metadata.md](16-seo-and-metadata.md) | Metadata + VideoObject JSON-LD |
| [17-implementation-plan.md](17-implementation-plan.md) | Phases |
| [18-open-questions.md](18-open-questions.md) | Decisions + backend gaps |

Implementation specs (the what, phase by phase): [specs/00-index.md](specs/00-index.md).

## Conventions

Same rules as the article detail page: JSDoc-only comments (no `//` notes), scoped props
(sub-composers receive only the fields they render), theme tokens in `className` (no
hardcoded colors — social brand backgrounds via the `Colors` palette are the one
documented exception), `Result<T>` from every repository method, icons from the shared
barrel only, i18n for every string, and `npm show <pkg> dist-tags.latest` before pinning
any new package. All cards use `rounded-lg`.
