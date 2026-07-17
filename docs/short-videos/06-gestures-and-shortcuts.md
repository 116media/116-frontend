# 06 — Gestures & Shortcuts

The TikTok/Instagram interaction model on the active short: navigate by swipe / arrows /
keys, single-tap to pause, double-tap to like. This doc fixes the gesture rules and how
single-vs-double tap is disambiguated.

---

## Navigation

| Input | Action |
|---|---|
| Swipe up | Next short |
| Swipe down | Previous short |
| Up arrow button (`ChevronUp`) | Previous short |
| Down arrow button (`ChevronDown`) | Next short |
| `ArrowUp` key | Previous short |
| `ArrowDown` key | Next short |
| `Escape` key | Close the modal |

Note the natural asymmetry: **swiping up** moves the feed *up* to reveal the **next** short
(content scrolls upward), while the **up arrow button** conventionally means "go to the
**previous** item". This matches TikTok: the swipe direction and the button glyph point
opposite ways on purpose. Documented here so it isn't "fixed" into inconsistency.

With the recommended scroll-snap track ([05-modal-player.md](05-modal-player.md)), swipe is
native; the arrow buttons and keys call `scrollIntoView({ behavior: "smooth" })` on the
target slide, and the `IntersectionObserver` updates the active index when the snap settles.

At the **first** short, "previous" is a no-op (arrow disabled/hidden). Approaching the
**last loaded** short triggers `onLoadMore` (next page); once the feed is exhausted, "next"
is a no-op and a subtle end-of-feed cue shows.

---

## Single tap vs double tap

Both gestures target the video surface, so a tap must wait to see whether a second tap
follows. The rule:

- **Single tap** → toggle play/pause (`togglePlay`).
- **Double tap** → like the active short (`like`), with the heart-burst.

Disambiguation with a short timer:

```
onTap:
  if a pending single-tap timer exists → it's a double tap:
     clear the timer, run like() + burst, swallow the pause
  else → start a ~250ms timer; if it expires with no 2nd tap, run togglePlay()
```

`DOUBLE_TAP_MS = 250`. A double tap must **not** also toggle pause — the pending single-tap
timer is cleared before it fires. The burst animation (`ShortsPlayer.LikeBurst`) plays on
every double tap, even when the short is already liked (Instagram behaviour: the heart
pops; a second double-tap does not unlike). Unliking is done from the action-rail heart, not
by double tap.

Pointer handling uses `onPointerUp` (works for touch + mouse); guard against drags being
read as taps by ignoring a pointer that moved beyond a small threshold (so a swipe isn't a
tap). Keep the tap handler off the action rail and nav buttons (they `stopPropagation`) so
tapping a button never pauses the video.

---

## Autoplay & audio

- The active short **autoplays muted** on becoming active (autoplay policy compliance).
- The **first user tap anywhere** in the modal unmutes and reveals a mute toggle; mute
  state persists across slides within the session.
- A short paused by single-tap shows a centered play glyph; tapping again resumes.
- Leaving a slide pauses and resets it; returning replays from the start.

---

## Accessibility

- Arrow buttons are real `<button>`s with `aria-label` ("previous short" / "next short")
  and are keyboard-focusable; the key handlers duplicate them so keyboard users never need
  the pointer.
- The like button on the rail carries `aria-pressed` + `aria-label`; the double-tap gesture
  is an enhancement layered on top of it, not the only way to like.
- `prefers-reduced-motion`: the heart-burst and smooth-scroll degrade to instant.
- Focus is trapped in the modal while open and restored to the originating tile on close.
</content>
