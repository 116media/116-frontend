# 05 — The Player (Plyr)

The playback surface is **plyr-react** wrapping a YouTube embed — the same stack the
dashboard's `VideoPlayer` uses (`plyr-react@6.0.0` + `plyr@3.8.4`), rebuilt for this app
with token-based brand theming instead of SCSS modules.

## Packages

```bash
yarn add plyr-react@6.0.0 plyr@3.8.4
```

(Verify with `npm show plyr-react dist-tags.latest` before pinning — 6.0.0 at the time
of writing, matching the dashboard.)

## Component

`VideoDetailPlayer` (in `VideoDetail/`) renders `<Plyr source={youtubeSource} …>` with:

- **Source**: `{ type: "video", sources: [{ src: youtubeId, provider: "youtube" }] }` —
  the id extracted from `youtubeVideoUrl` by a shared `extractYoutubeId` util (handles
  `watch?v=`, `youtu.be/`, `embed/`, `shorts/`, and bare-id forms).
- **Options** (mirroring the dashboard's YouTube set): `controls: [play-large, play,
  progress, current-time, mute, volume, settings, fullscreen]`, `settings: [quality,
  speed]`, `ratio: "16:9"`, `clickToPlay`, `hideControls`, `resetOnEnd`.
- **Poster**: `thumbnailUrl` when present.
- **Null source**: when `youtubeVideoUrl` is null, render the thumbnail (or the muted
  `NewspaperIcon`-style fallback with a film glyph) instead of an empty player.

## SSR

Plyr touches `window` at import time, so the player is loaded with
`next/dynamic(..., { ssr: false })`. The dynamic `loading` fallback renders the
16:9 poster frame (thumbnail + centered play glyph) so the layout never shifts and the
server HTML still shows the cover.

## Brand theming

Plyr is themed entirely through its CSS custom properties, bound to **theme tokens** so
dark/light follows automatically. A `video-plyr.css` (imported once next to the player)
scopes the overrides:

```css
.video-detail-player .plyr {
    --plyr-color-main: var(--primary);
    --plyr-video-control-color: var(--primitive-white);
    --plyr-video-control-background-hover: var(--primary);
    --plyr-range-fill-background: var(--primary);
    --plyr-badge-background: var(--primary);
    --plyr-menu-background: var(--popover);
    --plyr-menu-color: var(--popover-foreground);
    --plyr-control-radius: 0.5rem;
    border-radius: var(--radius-lg, 0.5rem);
    overflow: hidden;
}
.dark .video-detail-player .plyr {
    --plyr-color-main: var(--secondary);
    --plyr-video-control-background-hover: var(--secondary);
    --plyr-range-fill-background: var(--secondary);
    --plyr-badge-background: var(--secondary);
}
```

Primary drives the accent in light mode, **secondary in dark mode** — the same
primary/secondary duality the rest of the app uses (`dark:group-hover:text-secondary`
etc.). The frame is `rounded-lg` with clipped corners like every other card.

## Events

No telemetry is wired to play events in this cut (the backend has no video-view
endpoint — see [18-open-questions.md](18-open-questions.md)). The share/rating actions
live in the header, not the player.
