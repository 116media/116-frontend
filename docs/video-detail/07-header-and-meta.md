# 07 — Header & Meta (title · category · rating · stats · actions)

Directly under the player sits the video's identity and action strip —
`VideoDetail.Header`. Scoped props only; it never receives the whole entity.

```text
┌──────────────────────────────────────────────────────────────┐
│ [116 Music Video]                                            │  category Tag
│ Video Title In Serif Display                                 │  h1
│ ★★★★☆ 4.6 (128) · 👁 1.2M · 👍 24K · 💬 1.3K · ↗ 312        │  rating + yt stats + shares
│                                    [ Share ] [ + Playlist ]  │  actions
└──────────────────────────────────────────────────────────────┘
```

## Pieces

- **Category** — the `Tag` primitive (`variant="primary"`, `size="sm"`), linking nowhere
  in this cut (no category-filtered videos route exists yet).
- **Title** — `h1`, `font-serif` (Playfair Display) matching the article detail's
  editorial title treatment, `text-2xl md:text-3xl`, `line-clamp-3`.
- **Rating** — two layers:
  - *Display*: the shared `StarRating` idiom already used by `VideoCard.Rating`
    (average + `(count)` in muted text).
  - *Action*: hovering/tapping the stars lets an authenticated viewer submit 1–5 via
    `useRateVideo` (auth-gated with `useRequireAuth`, success/error toasts from a
    `rating.notification.ts` config, detail query invalidated to refresh the average).
    Guests get the login modal and the rating resumes after login.
- **YouTube stats** — views / likes / comments chips from
  [06-youtube-data.md](06-youtube-data.md), `formatCount`ed, each an icon + number in
  muted text. Null fields hide their chip.
- **Share count** — the backend's own `shareCount` with the `ShareIcon`, kept live by
  the share mutation's optimistic bump.
- **Actions** —
  - *Share*: `Button` (`variant="outline"`) opening the share modal
    ([08-share-modal.md](08-share-modal.md)).
  - *Add to playlist*: `Button` with `ListPlus`-style barrel icon opening the playlist
    modal ([09-playlist-modal.md](09-playlist-modal.md)); auth-gated at the modal level
    so guests see the login prompt.
- **No author** — the DTO's `author`/`authorId` are dropped at the mapper; nothing in
  the header (or anywhere on the page) renders a byline.

## Tags

`VideoDetail.Tags` renders below the header — the same labeled pill block as the
article detail ("TAGS:" uppercase label + `#`-prefixed `Tag` pills, slate resting fill,
brand hover). Video tags don't deep-link (no `tagSlug` filter on the published-videos
endpoint — see [03-backend-api-reference.md](03-backend-api-reference.md) §5), so pills
render as `as="span"` until the backend grows the filter. Empty tags → block renders
nothing.

## Responsiveness

The strip wraps: actions drop under the meta row on narrow screens (`flex-wrap`), the
stat chips scroll-wrap in two lines max, and the title stays clamped at three lines.
