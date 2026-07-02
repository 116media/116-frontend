# Spec 05 — Player

Design ref: [../05-player.md](../05-player.md).

## 1. Dependencies

```bash
npm show plyr-react dist-tags.latest   # 6.0.0 at writing
npm show plyr dist-tags.latest         # 3.8.4 at writing
yarn add plyr-react@<latest> plyr@<latest>
```

## 2. `VideoDetail/VideoDetailPlayer.tsx`

Scoped props: `{ youtubeVideoUrl: string | null; thumbnailUrl: string | null;
title: string }`.

- `const youtubeId = extractYoutubeId(youtubeVideoUrl)`.
- **No id** → render the poster frame: 16:9 `rounded-lg` box, thumbnail via
  `next/image fill` (muted `PlayIcon` fallback surface when the thumbnail is also
  null) — never an empty Plyr shell.
- **With id** → the dynamically imported inner player:

```tsx
const PlyrPlayer = dynamic(() => import("./VideoDetailPlayer.Plyr"), {
    ssr: false,
    loading: () => <PlayerPosterFrame … />
});
```

`VideoDetailPlayer.Plyr.tsx` (client-only file) imports `plyr-react` +
`"plyr-react/plyr.css"` + the brand CSS, and renders:

```tsx
<Plyr
    source={{ type: "video", sources: [{ src: youtubeId, provider: "youtube" }] }}
    options={PLYR_OPTIONS}
/>
```

`PLYR_OPTIONS` (module const): `controls: ["play-large", "play", "progress",
"current-time", "mute", "volume", "settings", "fullscreen"]`,
`settings: ["quality", "speed"]`, `ratio: "16:9"`, `clickToPlay: true`,
`hideControls: true`, `resetOnEnd: true` — the dashboard's YouTube set.

## 3. Brand CSS — `VideoDetail/video-plyr.css`

Scoped under `.video-detail-player`, tokens only (full block in
[../05-player.md](../05-player.md)): `--plyr-color-main: var(--primary)` with the
`.dark` override to `var(--secondary)`; menu surfaces on `--popover`; control radius
0.5rem; the frame wrapper `rounded-lg overflow-hidden`. Imported once by the Plyr file.

## 4. Frame

The exported component wraps everything in
`<div className="video-detail-player w-full overflow-hidden rounded-lg">` so the player
clips to the standard card radius.

## Tasks

- [ ] Deps pinned after `npm show`; `yarn build` passes with the dynamic import.
- [ ] Null-url and null-thumbnail fallbacks render (dummy with url stripped).
- [ ] Controls themed primary (light) / secondary (dark); menus on popover tokens.
- [ ] No SSR crash (`window` untouched server-side); poster shows during load.
- [ ] `tsc` + biome clean.
