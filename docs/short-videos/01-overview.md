# 01 — Overview

Short videos are vertical (9:16) clips uploaded to Cloudinary and surfaced to readers as a
TikTok-style experience: a horizontal teaser strip on the homepage, and a full-screen,
swipeable player. This doc fixes the goals, the scope, and the decisions everything else
builds on.

---

## Goals

- Bring the dashboard-managed shorts ("Réels") to the public site with a **TikTok/Instagram
  interaction model**: autoplay-on-active, tap-to-pause, double-tap-like, swipe between
  clips, a right-side action rail with live counts.
- **Reuse the dashboard's visual language** (the 9:16 portrait stage, rounded corners, the
  dark scrim, the brand tokens) so shorts feel of a piece with the rest of the product.
- Fit the existing frontend architecture: a dedicated `shorts` module mirroring `videos`,
  `Result<T>` repositories, optimistic `useToggle` interactions, the compound-with-context
  component pattern, theme tokens only.

## Non-goals

- **No comments.** The backend has no comment capability for shorts; the player has no
  comment button or count. Do not scaffold one.
- **No admin/upload surface.** Creating, uploading, and activating shorts stays in the
  dashboard. This feature is read + interact only.
- **No standalone `/shorts/{slug}` route in this cut.** The feature lives on the homepage
  and its modal. A deep-link route is noted as a follow-up in
  [10-open-questions.md](10-open-questions.md).

---

## The TikTok behaviours, precisely

| Behaviour | Rule |
|---|---|
| Homepage strip | Simple horizontal scroll-snap row of tiles — **not** the shows carousel. Placed between promoted articles and the exclusive-show hero. |
| Open | Tapping a tile opens the full-screen modal focused on that short. |
| Modal backdrop | Transparent/dark full-bleed; closeable via a close button, backdrop, or `Escape`. |
| Navigate | One short visible at a time; **swipe up → next**, **swipe down → previous**; **up/down arrow buttons** do the same; `ArrowUp`/`ArrowDown` keys mirror them. |
| Autoplay | The active short autoplays (muted-first to satisfy autoplay policy); off-screen shorts are paused. |
| Single tap | Pause / unpause the active short. |
| Double tap | Like the active short, with a heart-burst animation (Instagram-style). |
| Counts | The action rail shows a live **like count** and **share count**. |
| End of feed | Reaching the last loaded short fetches the next page; a terminal state shows when the feed is exhausted. |

---

## Scope of this cut

**In:** homepage strip · full-screen swipe player · autoplay/pause · single-tap pause ·
double-tap like · up/down arrow + swipe + keyboard navigation · like toggle with count ·
share with count · engagement-gated view counting · i18n (en/fr) · loading/empty/error
states.

**Deferred (specced but not built now unless requested):** bookmark/save action (backend
supports it; the user asked only for like + share) · a standalone deep-link route ·
"my liked / saved shorts" list. See [10-open-questions.md](10-open-questions.md).

---

## Decisions locked

- **Dedicated module.** Shorts get their own `src/modules/shorts/` module (mirrors the
  dashboard's `modules/shorts` and the frontend `videos` module), not a corner of `videos`.
- **Reuse the shared `VideoPlayer` (Plyr), extended to remote files.** The shared player is
  already Plyr-based and app-themed but YouTube-only; extend it to also play direct
  file/remote URLs (like the dashboard's dual-source player), then reuse it for shorts in a
  bare 9:16 autoplay mode with the gesture/rail overlay on top. No separate native player.
  Rationale in [05-modal-player.md](05-modal-player.md).
- **Liked state seeded from the server.** Every read carries `isLiked` (and `isBookmarked`)
  for the caller, so the heart reflects a prior like on load, then toggles optimistically and
  rolls back on failure.
- **Like/bookmark auth-gated; share/view anonymous.** Double-tap-like by a logged-out
  reader opens the auth modal, then resumes the like (via `useRequireAuth`).
- **Vertical player uses the cursor for-you feed.** `getShortsFeed({ cursor, pageSize })` is a
  seeded, stable, cursor-paged feed; the homepage strip uses the paged list
  `getPublicShorts({ pageIndex, pageSize })`.
- **Counts via `formatCount`.** Same compact formatting as every other count in the app.
</content>
