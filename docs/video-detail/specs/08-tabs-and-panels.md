# Spec 08 — Animated Tabs & the Three Panels

Design ref: [../11-tabs.md](../11-tabs.md), [../12-similar-videos.md](../12-similar-videos.md).

## 1. Shared `Tabs` — `ui/Tabs/index.tsx`

`@radix-ui/react-tabs` (latest via `npm show`) wrapped with the shadcn anatomy plus a
motion layer (`motion/react` — already a dependency):

- `Tabs` (root) — tracks value order to compute travel direction; exposes it via
  context.
- `TabsList` — `inline-flex rounded-lg bg-muted p-1 text-muted-foreground`
  (`className` merged last for per-surface overrides).
- `TabsTrigger` — `rounded-md px-3 py-1.5 text-sm font-medium transition-colors`
  active: `bg-background text-foreground shadow-sm`.
- `TabsContent` — wraps children in
  `<motion.div initial={{ opacity: 0, x: direction * 24 }} animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.2, ease: "easeOut" }}>`; `direction` = sign of
  (newIndex − prevIndex). `animated` prop (default true) disables the wrapper for
  consumers that don't want motion.

Radix keeps semantics (roving focus, arrows, `aria-selected`); inactive content is
unmounted, so the mount animation is the transition.

## 2. `VideoDetail.Tabs.tsx`

Props: `{ videoId, categoryId, description, hasLyrics }`.
Local `value` state, default `"description"`; opened-tab memory (`useState<Set>`) feeds
the lazy `enabled` flags.

Triggers: `videos.detail.tabs.description` (always), `.lyrics` (**only when
`hasLyrics`**), `.similar` (always).

## 3. Panels

- `VideoDetail.Description.tsx` — `{ description }`; `font-article
  whitespace-pre-wrap leading-relaxed text-muted-foreground` prose block.
- `VideoDetail.Lyrics.tsx` — `{ videoId, enabled }`; `useVideoLyrics`; heading
  `songTitle` (serif) + `videos.detail.lyrics.by` + `artistName`; `lyricsText` in
  `font-article whitespace-pre-wrap`; loading → stanza `Skeleton` lines; failure/404 →
  `videos.detail.lyrics.empty` muted line.
- `VideoDetail.Similar.tsx` — `{ categoryId, currentVideoId, enabled }`;
  `useSimilarVideos`; `grid gap-4 sm:grid-cols-2 lg:grid-cols-3` of
  **`VideoCard.Vertical` reused untouched** (thumbnail, title, rating, relative date,
  share count all come with it); loading → 3 card skeletons; empty →
  `videos.detail.similar.empty` line.

## Tasks

- [ ] `Tabs` primitive: radix pinned via `npm show`, direction-aware slide+fade both
      ways, keyboard nav intact, `animated` opt-out.
- [ ] Lyrics trigger absent when `hasLyrics` is false; lazy queries fire only on first
      open and stay cached.
- [ ] Similar renders exactly 3 `VideoCard.Vertical`, current video excluded.
- [ ] All three panels' loading/empty states per
      [../14-loading-empty-error.md](../14-loading-empty-error.md).
- [ ] `tsc` + biome clean.
