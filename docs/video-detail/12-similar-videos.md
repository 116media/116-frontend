# 12 — Similar Videos

The third tab: a grid of **three** videos related to the one playing, rendered with the
**feed section's `VideoCard.Vertical`** — reused untouched, so each card already shows
the thumbnail (16:9, play overlay), title, star rating, relative published date, and
share count, and links to its own `/videos/{slug}`.

## Source

There is no similar-videos endpoint
([03-backend-api-reference.md](03-backend-api-reference.md) §5), so similarity is
approximated client-side as **same category, newest first**:

```text
useSimilarVideos(categoryId, currentVideoId)
    getPublishedVideosUseCase({ pageIndex: 0, pageSize: 4, categoryId })
    → items.filter(v => v.id !== currentVideoId).slice(0, 3)
    → Result failure → []
```

- `pageSize: 4` guarantees three survivors after excluding the current video.
- Keyed `videoKeys.similar(currentVideoId)`; `enabled` only once the Similar tab has
  been opened ([11-tabs.md](11-tabs.md)), then cached.
- Dummy-data phase: falls back to three feed dummies (thumbnails included), current
  video excluded, so the tab always previews.

A real relatedness signal (shared tags, engagement co-occurrence) is a backend follow-up
— see [18-open-questions.md](18-open-questions.md). Tag-based similarity is not possible
client-side today because the published-videos endpoint has no tag filter.

## Layout & states

- Grid: `grid gap-4 sm:grid-cols-2 lg:grid-cols-3` — three across on desktop, stacking
  down responsively; cards keep their `rounded-lg` frame.
- **Loading** — three `Skeleton` card placeholders matching the vertical-card footprint
  (16:9 block + title/meta lines).
- **Empty** — a single muted line (`videos.detail.similar.empty`); no boxy EmptyState
  inside a tab panel.
- **Error** — treated as empty (supplementary content), consistent with the popular
  sidebar's quiet degradation.
