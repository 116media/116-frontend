# 04 — Page Composition

Server-first, like the article detail: an async RSC fetches the video by slug (SEO + fast
first paint), gates missing slugs through `notFound()`, and seeds a thin client container
whose query hydrates without a refetch. The assembler below it is the only component that
holds the whole entity; every sub-composer receives scoped props.

```text
page.tsx (RSC)
    fetchVideo(slug)  ── cache() ── shared with generateMetadata
    notFound() gate · VideoObject JSON-LD
    └── VideoDetailContainer (client)          initialData hydration
        └── VideoDetail (assembler)
            ├── VideoDetailPlayer           Plyr / YouTube
            ├── VideoDetail.Header          title · category · rating · yt stats
            │                               · share button · playlist button
            ├── VideoDetail.Tags            tag pills
            ├── VideoDetail.Tabs            Description | Lyrics | Similar
            │   ├── VideoDetail.Description
            │   ├── VideoDetail.Lyrics      (gated by hasLyrics)
            │   └── VideoDetail.Similar     3 × VideoCard.Vertical
            ├── VideoShareModal             Dialog + SocialShareGroup (horizontal)
            ├── VideoPlaylistModal          Dialog + checkbox list
            └── VideosPopularSidebar        right column (own folder)
```

## Layout shell

Desktop (`lg+`) is a two-column grid; mobile stacks, sidebar last:

```text
lg:grid lg:grid-cols-[minmax(0,2.5fr)_minmax(0,1fr)] lg:gap-6

┌───────────────────────────────┬──────────────────┐
│ player                        │ 🔥 Popular videos │
│ header (title/meta/actions)   │ ┌──────────────┐ │
│ tags                          │ │ horiz card    │ │
│ tabs: Descr | Lyrics | Similar│ │ ──────────── │ │
│ [ active panel, animated ]    │ │ horiz card…  │ │
│                               │ └──────────────┘ │
└───────────────────────────────┴──────────────────┘
```

## Data ownership

| Data | Fetched by | When |
|---|---|---|
| Video detail | RSC (server cradle) → `initialData` | request time |
| YouTube stats | client hook via `/api/youtube/{id}` | mount (player column) |
| Lyrics | client hook, `enabled: hasLyrics && tab === "lyrics"` | first tab open |
| Similar videos | client hook, `enabled: tab === "similar"` | first tab open |
| Popular videos | client hook | mount (sidebar) |
| My playlists | client hook, `enabled: modal open && authenticated` | modal open |

Lazy `enabled` gating keeps the initial page to two client queries (stats + popular);
tab panels and the playlist modal fetch on first use and stay cached.

## Server/client split

`page.tsx`, `loading.tsx`, `not-found.tsx` and the JSON-LD script are server; everything
under `VideoDetailContainer` is client (`"use client"`), because the player, tabs, and
modals are interactive. Plyr itself is browser-only — the player
mounts behind a dynamic import with a poster-image placeholder during SSR
([05-player.md](05-player.md)), so the server HTML still carries the full header, tags,
description, and sidebar for SEO.
