# 17 — Implementation Plan

Build order, one reviewable phase at a time; each phase ends `tsc` + biome clean. The
specs in [specs/](specs/00-index.md) carry the file-level detail.

| Phase | Scope | Spec |
|---|---|---|
| 1 | Domain entities (`IVideoDetailEntity`, `IVideoLyricsEntity`, `IPlaylistEntity`, `IYoutubeVideoStats`) + mapper functions | [01](specs/01-domain-and-mappers.md) |
| 2 | Port + impl methods, eight use cases, DI + Cradle registration | [02](specs/02-repository-and-usecases.md) |
| 3 | `videoKeys` + all query/mutation hooks + notification configs + dummies | [03](specs/03-hooks-and-keys.md) |
| 4 | YouTube route handler + stats slice (`/api/youtube/[videoId]`, env, util) | [04](specs/04-youtube-data.md) |
| 5 | Player: plyr deps, `extractYoutubeId`, `VideoDetailPlayer`, brand CSS | [05](specs/05-player.md) |
| 6 | Header, rating action, stat chips, tags block | [06](specs/06-header-meta-and-tags.md) |
| 7 | Shared `Checkbox`, `SocialShareGroup` extraction (+ article rail rewire), share + playlist modals | [07](specs/07-share-and-playlist-modals.md) |
| 8 | Shared animated `Tabs` + Description/Lyrics/Similar panels | [08](specs/08-tabs-and-panels.md) |
| 9 | `VideosPopularSidebar` (+ loading) | [09](specs/09-popular-sidebar.md) |
| 10 | Assembler, container, route (`page/loading/not-found`), metadata + JSON-LD | [10](specs/10-page-and-layout.md) |
| 11 | i18n en/fr + barrel spreads | [11](specs/11-i18n.md) |

## Dependency notes

- Phase 5 needs `plyr-react`/`plyr`; phase 7 needs `@radix-ui/react-checkbox`; phase 8
  needs `@radix-ui/react-tabs` — each version checked with
  `npm show <pkg> dist-tags.latest` at install time. `motion` is already a dependency.
- Phase 7's `SocialShareGroup` extraction **touches the article share rail** — verify
  the articles page still renders identically after the rewire.
- Phase 10 verifies against `node_modules/next/dist/docs/` (params promise, metadata,
  route handlers) — the customized-Next rule from `AGENTS.md` applies.

## Verification per phase

`npx tsc --noEmit` + `yarn lint:code`, plus a `yarn build` at phases 4, 5, 10 (route
handler, dynamic import, and route registration are build-sensitive). Behavioral pass
at the end: play, rate, share (each network + copy), add to playlists, all three tabs
(animations both directions), sidebar navigation, dark *and* light modes, and mobile
widths.
