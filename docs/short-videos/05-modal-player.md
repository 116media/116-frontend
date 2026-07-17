# 05 — Modal Player

The full-screen player: a transparent, closeable modal showing one short at a time, with a
the shared Plyr player (extended to files), a vertical snap feed, an action rail, and up/down
navigation. Built as
a compound component fed by a context provider.

---

## Reuse the shared `VideoPlayer` (Plyr) — extended to remote files

The shared `VideoPlayer` (`shared/presentation/components/common/VideoPlayer`) is already a
Plyr embed carrying the app theme (`video-plyr.css` binds Plyr's CSS variables to theme
tokens, light/dark aware) — but it only accepts a **YouTube** source. That's an artificial
limit: Plyr plays direct file/remote URLs too (the dashboard's own `VideoPlayer` does
exactly this, inferring the MIME type from the URL extension).

So the shared `VideoPlayer` is **extended to support both sources** — a YouTube URL *or* a
direct file/remote `videoUrl` — and shorts **reuse it**. No separate native player. This is
the entity-agnostic shared library its own doc already advertises ("consumed by any feature
that plays a video (detail page, shorts, promoted previews)"). Extending it here also lifts
the same YouTube-only limit for any future non-YouTube video surface.

What the shared player gains (spec in [specs/05-modal-player.md](specs/05-modal-player.md)):

| Addition | Rule |
|---|---|
| `videoUrl` prop | Direct file/remote source; resolves to a Plyr `{ src, type }` source with the MIME inferred from the extension (mp4/mov/webm/…), like the dashboard. |
| Source precedence | `youtubeVideoUrl` → YouTube provider source; else `videoUrl` → file source; else poster-only. |
| `ratio` prop | Defaults `"16:9"`; shorts pass `"9:16"`. |
| `controls` preset | Full set (default, unchanged) or a **bare** preset (`["progress"]` / none) for the TikTok surface. |
| Playback flags + ref | `autoPlay` / `muted` / `loop`, and a forwarded ref to the Plyr instance so a caller can drive play/pause imperatively. |
| Theme | Unchanged — the existing `video-plyr.css` skin already themes both source types. |

The shorts module keeps a **thin** `ShortVideoPlayer` wrapper
(`components/media/ShortVideoPlayer`) that configures the shared player for the TikTok
context and orchestrates active/paused/mute across slides:

| Concern | Rule |
|---|---|
| Config | Shared `VideoPlayer` with `videoUrl`, `ratio="9:16"`, bare controls, `loop`, `muted` first |
| Autoplay | Plays (muted) when it becomes the active slide, via the Plyr ref; a tap unmutes + reveals a mute toggle |
| Off-screen | Non-active slides pause and reset (`currentTime = 0`) through the ref |
| Chrome | `clickToPlay` disabled — the shorts tap layer owns pause; controls hidden so the surface stays full-bleed |
| Fallback | No `videoUrl` → the shared player's poster-only branch (never an empty box) |

---

## The modal shell

| Aspect | Rule |
|---|---|
| Container | `fixed inset-0 z-[…]`, above the navbar; body scroll locked while open |
| Backdrop | Dark, near-opaque scrim (`bg-black/90`) — "transparent modal" means full-bleed video over a dark backdrop, not the centered card `Dialog` |
| Stage | Centered 9:16 column, `h-[min(90vh,calc(100vw*16/9))] aspect-[9/16] rounded-lg overflow-hidden` (the dashboard's `min(90vh,160vw)` recipe) |
| Close | Top-right circular close button (`XIcon`); backdrop click and `Escape` also close |
| Portal | Rendered through a portal (Radix `Dialog` in non-modal/custom mode, or `createPortal`), `role="dialog" aria-modal="true"` |

The existing `Dialog` primitive is a centered `max-w-md` card — not this. Reuse Radix
`Dialog`'s `Root`/`Portal`/`Overlay` for focus-trap + scroll-lock + escape handling, but
supply full-screen classes to `DialogContent` (className is merged via `cn`), or build the
shell directly on `createPortal` if the focus-trap gets in the way of the video surface.
This decision is flagged in [10-open-questions.md](10-open-questions.md).

---

## Vertical feed & snapping

One short fills the stage; the reader moves one short per gesture. Two viable mechanics
(pick one — see open questions):

- **CSS scroll-snap column** — a vertical `overflow-y snap-y snap-mandatory` track with one
  full-height slide per short; an `IntersectionObserver` marks the most-visible slide
  active. Native momentum, cheap. Arrow buttons call `scrollIntoView` on the target slide.
- **Transform/index model** — a single active index in context; navigation translates the
  track by `100%`. Tighter control over "exactly one per swipe", more code.

Recommendation: **scroll-snap column** with an `IntersectionObserver` (reusing
`useIntersectionObserver` + a `snap` threshold) driving the active index. It gives correct
swipe physics for free and keeps arrow/keyboard nav as `scrollIntoView` calls.

The active-index change is what pauses the previous video, plays the new one, and starts the
view-count engagement timer ([08-view-counting.md](08-view-counting.md)).

---

## Compound + context

Following the established slot-and-context pattern (`VideoExclusiveShow`, `Comment`), the
player is a compound assembled from a provider:

```
context/ShortsPlayerProvider.tsx     holds: shorts[], activeIndex, isPlaying, isMuted,
                                     goTo/goNext/goPrev, togglePlay, toggleMute, like(index)
components/modals/ShortsPlayer/
  ShortsPlayer.tsx                   the shell (portal, backdrop, stage, close) + provider
  ShortsPlayer.Track.tsx             the vertical snap track mapping slides
  ShortsPlayer.Slide.tsx            one short: <ShortVideoPlayer> + overlays, self-reads ctx
  ShortsPlayer.ActionRail.tsx        like + share buttons with counts (right rail)
  ShortsPlayer.Nav.tsx               up/down arrow buttons (prev/next)
  ShortsPlayer.Caption.tsx          title + author over the bottom scrim
  ShortsPlayer.LikeBurst.tsx        the double-tap heart-burst overlay
  ShortsPlayer.Close.tsx            the close button
  types.ts, index.ts                (index.ts assembles the ShortsPlayer namespace)
```

Slots read what they need from context and self-guard visibility, so the shell JSX stays
declarative:

```tsx
<ShortsPlayer …>
    <ShortsPlayer.Track>
        {/* one ShortsPlayer.Slide per short */}
    </ShortsPlayer.Track>
    <ShortsPlayer.Nav />
    <ShortsPlayer.Close />
</ShortsPlayer>
```

The action rail and caption render **per slide** (inside `ShortsPlayer.Slide`), so each
short shows its own counts and title.

---

## Styling reused from the dashboard

Concrete values pulled from `apps/dashboard` `VideoPreview` / `VideoPlayer`, expressed in
frontend theme tokens / Tailwind:

| Dashboard (SCSS) | Frontend (Tailwind + tokens) |
|---|---|
| stage `aspect-ratio: 9/16; height: min(90vh,160vw)` | `aspect-[9/16] h-[min(90vh,calc(100vw*16/9))]` |
| `border-radius: 8px` | `rounded-lg` |
| overlay `background: rgba(0,0,0,0.65)` | `bg-black/90` (darker for full-bleed video) |
| audio pill `rgba(0,0,0,0.4)`, radius 8px | `bg-black/40 rounded-lg` |
| brand `#490fd2` | `text-primary` / `bg-primary` tokens |
| bottom control scrim gradient | `bg-gradient-to-t from-black/70 to-transparent` |

Colors come from `theme.css` tokens in `className` only — never hardcoded hex. The action
rail, caption, and burst are the net-new TikTok elements the dashboard doesn't have; the
data for them (`likeCount`, `shareCount`, `title`, `authorName`) is all on the entity.
</content>
