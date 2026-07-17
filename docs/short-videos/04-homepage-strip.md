# 04 — Homepage Strip

The homepage entry point: a simple horizontally-scrolling row of 9:16 short tiles, placed
between the promoted-articles section and the exclusive-show hero. Tapping a tile opens the
player modal focused on that short.

---

## Placement

The homepage (`app/(public)/page.tsx`) streams sections in order. The shorts strip slots as
a new `<Suspense>` **immediately after** the promotion feed and **before** the exclusive
show:

```tsx
<div className="flex flex-col gap-8 lg:gap-12">
    <Suspense fallback={<ArticlePromotionFeedLoading />}>
        <ArticlePromotionFeedContainer />
    </Suspense>

    {/* Short videos — TikTok-style teaser strip */}
    <Suspense fallback={<ShortsFeedSectionLoading />}>
        <ShortsFeedSectionContainer />
    </Suspense>

    <Suspense fallback={<VideoExclusiveShowSplitLoading />}>
        <VideoExclusiveShowContainer variant="split" />
    </Suspense>

    <ShowsSectionContainer />
    <VideoFeedSectionContainer />
</div>
```

`ShortsFeedSectionContainer` is an **island container**: it owns its own client query
(`useShortsFeed`) rather than resolving on the server, because the strip and the modal
share one paged feed and the modal needs `fetchNextPage` on the client. It renders the
section heading, the strip, and the state fallbacks.

---

## The scroll row (not a carousel)

Per the requirement, this is a **plain horizontal scroll-snap row**, not `ShowsCarousel`
and not `Md3Carousel` — no arrows, no paging dots, no motion carousel. Just an overflow
container the reader flicks through:

```
overflow-x-auto · flex · gap · snap-x snap-mandatory · scrollbar hidden
each tile: snap-start · shrink-0 · fixed width
```

Tiles are a fixed portrait size (roughly `w-40 aspect-[9/16]` on mobile, a touch larger on
`lg`), so a handful peek in at a time and the rest scroll off-screen. The row scrolls
horizontally; the *modal* is where vertical swiping happens.

---

## The tile — `ShortCard`

A `ShortCard` is a 9:16 thumbnail button that reuses the dashboard's short styling:

| Element | Treatment |
|---|---|
| Frame | `aspect-[9/16] rounded-lg overflow-hidden` |
| Poster | `thumbnailUrl` as a `next/image` fill (or `videoUrl` first-frame fallback), `object-cover` |
| Scrim | bottom gradient `from-black/70 to-transparent` for legibility |
| Title | one/two-line clamp over the scrim, `text-white` |
| View count | small overlay with a play/eye icon + `formatCount(viewCount)` |
| Hover/focus | subtle scale, visible focus ring (keyboard reachable) |

The card is a `<button>` (or `role="button"` tile) — clicking it calls
`onOpen(index)` which the container turns into "open the modal at this short".

Empty state (`ShortsStrip.Empty`): when the feed has no active shorts, the whole section is
omitted (returns `null`) rather than showing an empty shell — the homepage simply skips it.
Loading (`ShortsFeedSectionLoading`): a row of shimmer tiles at the same dimensions.

---

## Opening the modal

The container holds the modal's open state and the active index:

```
const [openAt, setOpenAt] = useState<number | null>(null);
...
<ShortsStrip shorts={items} onOpen={setOpenAt} />
{openAt !== null && (
    <ShortsPlayer
        shorts={items}
        initialIndex={openAt}
        hasNextPage={hasNextPage}
        onLoadMore={fetchNextPage}
        onClose={() => setOpenAt(null)}
    />
)}
```

The strip and the modal render the **same** `items` array from the one infinite query, so a
short liked in the modal and the same tile in the strip stay consistent through the shared
TanStack cache. The modal drives `onLoadMore` as the reader swipes toward the end.
</content>
