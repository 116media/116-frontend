# 07 — Interactions

Like and share, each with a live count on the action rail. Like is an optimistic auth-gated
toggle; share records an event and bumps a count. No comments (unsupported). Bookmark is
available in the backend but deferred in this cut.

---

## The action rail

A vertical rail on the right edge of the active short (TikTok layout), rendered per slide
inside `ShortsPlayer.Slide`:

| Item | Icon | Count | Auth |
|---|---|---|---|
| Like | `HeartIcon` (fills when liked) | `formatCount(likeCount)` | Visitor (auth-gated) |
| Share | `ShareIcon` | `formatCount(shareCount)` | Anonymous |

Each item is an icon button stacked over its count label, `text-white` with a drop-shadow
for legibility over video. Active like = `fill-destructive text-destructive` (same token as
the article like). Counts use `formatCount` (compact: 1.2K, 3.4M), same as everywhere else.

---

## Like

Optimistic toggle over `publicLikeShortVideo` / `publicUnlikeShortVideo`, via the shared
`useToggle` + `runInteraction`, wrapped in `useToggleShortLike`:

- Tapping the heart (or double-tapping the video) flips `liked` and adjusts the count
  instantly; a failure rolls both back. No toast — the flip is the feedback.
- **Auth-gated** through `useRequireAuth`: a logged-out like opens the auth modal and
  resumes the like on success (same as article likes).
- **Seed from the server.** The DTO carries `isLiked` for the caller, so `initialLiked` is
  seeded from it and the heart reflects a prior like on load (false when anonymous).
- The backend 409s a repeat like; the UI never sends one because the icon already reflects
  `liked`. Double-tap on an already-liked short re-bursts but does not re-call the API.

`useToggleShortLike(shortId, likeCount, short.isLiked)` → `{ liked, count, toggle }`.

---

## Share

Share opens the app's existing share surface for the short's link and records the channel.
Reuse `SocialShareGroup` (emits `facebook` / `x` / `whatsapp` / `clipboard` / `webshare`)
inside a small share sheet, and `useShareShort` to record + optimistically bump:

- On a channel pick, fire-and-forget `publicShareShortVideo(shortId, { shareChannel })`
  (failures swallowed — telemetry never blocks sharing) and optimistically bump the cached
  `shareCount` for that short in the feed query, mirroring `useShareVideo`.
- The short's shareable link is its public URL (deep-link route pending — until then, the
  homepage URL or a `?short={slug}` param; see open questions). Copy-to-clipboard and the
  Web Share API both map to their `shareChannel` values.
- The channel identifiers are passed straight through to the backend (case-insensitive
  parse; unknown ignored) — no mapper, consistent with the article/video share refactor.

`useShareShort(shortId)` → `recordShare(shareChannel: string)`.

---

## Bookmark (deferred)

The backend supports bookmark/unbookmark (Visitor auth) and the DTO carries `bookmarkCount`.
The user asked only for like + share, so bookmark is **not** in this cut. It is specced as a
drop-in (`useToggleShortBookmark`, a rail item with `BookmarkIcon` + `fill-primary`) so it
can be enabled later without rework. See [specs/07-interactions-like-share.md](specs/07-interactions-like-share.md).

---

## Comments

Not supported by the backend — no `ShortVideoComment` entity, endpoint, or count exists. The
player shows **no** comment button and **no** comment count. Do not add a placeholder.
</content>
