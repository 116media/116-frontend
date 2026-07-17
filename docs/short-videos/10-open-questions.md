# 10 — Open Questions

Decisions locked for the build, plus the backend gaps and assumptions to confirm before or
during implementation.

---

## Decisions locked

- **Dedicated `shorts` module** mirroring `videos` (not folded into `videos`).
- **Reuse the shared `VideoPlayer` (Plyr), extended to remote files** — not a separate native
  player. The shared player is already app-themed; add direct file/remote source support
  (dual-source, like the dashboard) and a bare 9:16 mode for shorts.
- **Scroll-snap vertical track** in the modal, `IntersectionObserver`-driven active index
  (swipe physics for free); arrows/keys call `scrollIntoView`.
- **Liked state seeded from the server** (`isLiked` on every read); heart reflects a prior
  like on load, then toggles optimistically.
- **Like/bookmark auth-gated; share/view anonymous.**
- **Vertical player uses the cursor for-you feed** (`getShortsFeed`); the homepage strip uses
  the paged list (`getPublicShorts`).
- **Bookmark deferred** (backend-supported; not requested this cut).
- **No comments** (backend-unsupported).

---

## Backend capabilities (resolved — all three shipped)

1. **`isLiked` / `isBookmarked` on reads — shipped.** All three shorts reads (paged list,
   for-you feed, by-slug) resolve the caller's per-user flags (false when anonymous). Seed
   the like heart from `isLiked`; no session-local guessing needed.
2. **Cursor / for-you feed — shipped.** `GET /api/v1/public/shorts/feed` is a cursor-paged
   keyset endpoint with stable ordering (no page drift, no repeats within a cursor session).
   Use it for the vertical player feed; keep the paged list for the homepage strip + search.
3. **Randomized "for you" ordering — shipped.** The feed orders by a seeded pseudo-random
   shuffle; the seed is embedded in the cursor so a session stays stable and a fresh call
   (no cursor) reshuffles. A `null` `nextCursor` marks the end — restart to loop.

**Frontend follow-up:** regenerate the API client (`116.api.ts`) once the backend is running
so `getShortsFeed`, `nextCursor`, and the `isLiked` / `isBookmarked` DTO fields are available.

---

## Assumptions to confirm

1. **Modal shell mechanism.** Recommendation: reuse Radix `Dialog` Root/Portal/Overlay for
   focus-trap + scroll-lock + escape, with full-screen classes overriding the centered card.
   Fallback: `createPortal` directly if the focus-trap interferes with the video surface.
   Confirm during build.
2. **Shareable link.** No deep-link route in this cut. Interim: share the homepage URL or a
   `?short={slug}` query param; the `getPublicShortBySlug` read already exists to back a real
   `/shorts/{slug}` route later. **Confirm:** is a deep-link route wanted now or later?
3. **Tile view-count display.** Assumed the strip tile shows `viewCount` (TikTok-like). If
   the product prefers a cleaner tile (poster + title only), drop the overlay — trivial.
4. **Autoplay-with-sound.** Assumed muted-autoplay-then-unmute-on-tap (browser policy safe).
   If product wants sound-on immediately, it will be blocked by autoplay policy until first
   interaction — the muted-first approach is the standard workaround.
5. **`DOUBLE_TAP_MS = 250` / `VIEW_ENGAGEMENT_MS = 2000`.** Reasonable defaults; tune after
   feel-testing.
6. **Strip page size vs modal page size.** Assumed one shared infinite query feeds both. If
   the strip should show only a small teaser count (e.g. 10) while the modal pages deeper,
   split into two queries — noted but not assumed.

---

## Follow-ups (post-cut)

- `/shorts/{slug}` deep-link route (SEO, shareable) backed by `getPublicShortBySlug`.
- Bookmark/save rail item (spec ready).
- "My liked / saved shorts" list (needs the per-user flags gap resolved).
- "Watch full video" affordance when `hasFullVideo` / `videoId` is set (jump to the parent
  video detail).
</content>
