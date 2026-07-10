# 11 — Tabs (Description · Lyrics · Similar)

Below the player/header block sits the page's tab navigation — shadcn-style tabs with
**animated panel transitions**: the outgoing panel slides/fades out and the incoming one
slides in from the direction of travel.

```text
┌────────────────────────────────────────────┐
│ ▸ Description    Lyrics    Similar videos  │   ← TabsList (shadcn look)
├────────────────────────────────────────────┤
│                                            │
│   [ active panel — slides in / out ]       │
│                                            │
└────────────────────────────────────────────┘
```

## The shared `Tabs` primitive

No tabs primitive exists yet; this page introduces
`shared/presentation/components/ui/Tabs`:

- **Radix** `@radix-ui/react-tabs` (latest via `npm show`) for semantics: roving focus,
  `aria-selected`, keyboard arrows — the shadcn anatomy (`Tabs`, `TabsList`,
  `TabsTrigger`, `TabsContent`).
- **Skin** — the shadcn look on theme tokens: `TabsList` as a `bg-muted rounded-lg p-1`
  strip; active `TabsTrigger` on `bg-background text-foreground shadow-sm rounded-md`;
  inactive triggers `text-muted-foreground`.
- **Animation** — the app already depends on `motion`. `TabsContent` wraps its children
  in a motion container; the `Tabs` root tracks the previous index so panels animate
  **direction-aware**: moving right slides the new panel in from the right
  (`x: 24 → 0`, `opacity: 0 → 1`, ~200ms ease-out) and vice versa. Radix unmounts
  inactive content by default, which pairs with a mount animation on the incoming panel;
  an `AnimatePresence` exit pass is a nice-to-have, not required for the effect.
- The primitive stays generic — animation is a built-in default (`animated` prop,
  default true) so other surfaces can reuse it.

## The three tabs

| Tab | Content | Notes |
|---|---|---|
| **Description** (default) | `VideoDetail.Description` — the DTO's plain-text `description`, `whitespace-pre-wrap`, muted body copy, Merriweather (`font-article`) for reading comfort | always present |
| **Lyrics** | `VideoDetail.Lyrics` — `songTitle` + `artistName` heading, `lyricsText` in `whitespace-pre-wrap` centered stanzas, `font-article` | **trigger only renders when `hasLyrics`**; content fetched lazily on first open via `useVideoLyrics(videoId, { enabled })`; a 404 (data drift vs the flag) shows the lyrics-empty state |
| **Similar** | `VideoDetail.Similar` — a `grid gap-4 sm:grid-cols-2 lg:grid-cols-3` of **three `VideoCard.Vertical`** feed cards (thumbnail, title, rating, relative date, share count) | fetched lazily on first open via `useSimilarVideos(categoryId, currentVideoId)`; empty → EmptyState-lite line |

Tab state is local (`useState`), defaulting to `description`. The active tab also gates
the lazy queries (`enabled`), so lyrics and similar cost nothing until visited.
