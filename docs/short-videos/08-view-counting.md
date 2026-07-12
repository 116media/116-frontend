# 08 — View Counting

A view is recorded once a short has actually been watched — an engagement gate, not a
render. The backend deduplicates per viewer; the frontend only decides *when* to fire the
event. This mirrors the anonymous-action counting already documented for shares/views in
`content-interactions/15-counting-anonymous-actions.md`.

---

## The engagement gate

A view event fires for a short when **all** hold:

1. The short is the **active** slide in the player (most-visible in the snap track).
2. It has been **playing** (not paused) for a continuous **watch threshold** — 
   `VIEW_ENGAGEMENT_MS = 2000` (2s), matching the backend's intent.
3. The event has **not already fired** for this short **in this modal session** (a local
   `Set<shortId>` guards re-fires while swiping back and forth).

Scrolling past a short without dwelling, or pausing immediately, does not count. The timer
resets if the reader swipes away or pauses before the threshold.

```
on active-slide change / play state change:
  if active && playing && !firedThisSession.has(id):
     start a 2s timer
  else:
     clear the timer
on timer elapse:
  firedThisSession.add(id)
  recordShortView(id)   // fire-and-forget
```

Homepage-strip tiles do **not** count views (they show posters, not playback). Only the
player records views.

---

## The request

`useRecordShortView` calls `publicRecordShortVideoView(shortId)` — fire-and-forget, failures
swallowed (a lost view event must never disrupt playback). The response
`{ isSuccess, isCounted }` is ignored by the UI; `isCounted=false` (a deduped repeat) is not
an error.

Dedup identity is assembled server-side from:

- **`X-Device-Id`** — already attached to every request by the existing
  `deviceIdInterceptor`; no per-call work needed here.
- Client IP + `User-Agent` — read server-side.

So the same viewer replaying the same short within the dedup window increments nothing,
whether logged in or anonymous. The frontend's only job is the engagement gate plus the
per-session `Set` guard (so one modal session sends at most one event per short even across
repeated swipes).

---

## Optimistic count?

`viewCount` is shown on the homepage tile, not on the player rail, and is low-stakes. Do
**not** optimistically bump it — the dedup window means an optimistic increment would often
be wrong (a repeat view that the server won't count). Views reconcile on the next feed
fetch. Like and share counts *are* bumped optimistically ([07-interactions.md](07-interactions.md));
views are not.
</content>
