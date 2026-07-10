# 10 — Popular Videos Sidebar

The right column: a titled, **one-column** list of up to five popular videos. It is the
visual twin of the articles page's popular sidebar — same header, same muted block, same
horizontal-row rhythm — built from the **exclusive-section horizontal card**.

```text
┌──────┐
│  🔥  │  Popular videos
└──────┘
─────────────────────────────────    ← SectionHeader divider
╭ bg-muted/30 rounded-xl ────────╮   ← the gossip-strip block
│ ┌────┐ Title line one…         │
│ │IMG │ ★★★★☆ 4.6 (128)         │   ← VideoCard.Horizontal rows
│ └────┘ ↗ 312 · 2 days ago      │
│ ────────────────────────────── │   ← <hr> separators
│ ┌────┐ …                       │
╰────────────────────────────────╯
```

## Composition

- **Header** — the shared `SectionHeader` (icon box + title + divider) with the
  `FlameIcon`, exactly like `ArticlesPopularSidebar`.
- **Rows** — `VideoCard.Horizontal` **reused as-is** (the exclusive-show episode card:
  landscape thumbnail with play overlay, two-line title, star rating, relative date,
  share count). It already carries every field the sidebar needs — thumbnail, title,
  published date, rating stars, share count.
- **Block** — the rows sit inside the gossip-strip surface
  (`rounded-xl bg-muted/30` + responsive padding) separated by `<hr>`, so the column
  reads identically to the articles' popular strip.
- **Own folder** — `VideosPopularSidebar/` beside `VideoDetail/`
  (`VideosPopularSidebar.tsx`, `VideosPopularSidebar.Loading.tsx`, `index.ts`), matching
  the `ArticlesPopularSidebar` naming standard.

## Data

`useVideoDetailPopular(currentVideoId)` — keyed `videoKeys.popular(currentVideoId)`:

1. `getPromotedVideosUseCase` (editorial "popular" signal), exclude the open video;
2. fallback to the first page of `getPublishedVideosUseCase` when promoted yields
   nothing usable, exclude the open video;
3. cap at 5; unwrap `Result` failures to `[]` so the sidebar degrades quietly;
4. dummy-data phase: fall back to the feed dummies (each with a thumbnail) exactly like
   the articles sidebar.

This is the interim promoted→published strategy; it swaps to a real
`GET /videos/popular` when the backend ships it
([18-open-questions.md](18-open-questions.md)).

## States

- **Loading** — the `SectionHeader` + a skeleton block of 5 horizontal-row placeholders
  (thumbnail block + title/rating/date lines, `<hr>`-separated) inside the same muted
  surface, built from the shared `Skeleton` primitive.
- **Empty** — the whole column renders nothing (no heading over an empty box).
- **Error** — treated as empty; the sidebar is supplementary and never shows an error
  surface.
