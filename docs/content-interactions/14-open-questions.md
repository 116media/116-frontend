# 14 — Open Questions

Decisions locked, backend gaps, and assumptions for the content-interactions feature.

---

## Decisions locked

1. **On/off use cases, not a toggle.** POST=on, DELETE=off; the verb is chosen from the next
   state inside `useToggle`.
2. **Optimistic toggles, no success re-read.** Like/bookmark flip immediately, roll back on
   error, never reconcile on success.
3. **Rating invalidates, not optimistic.** The aggregate is server-computed, so submit →
   toast → refetch the detail entity.
4. **Comment post = optimistic prepend + invalidate.** Instant row from the auth context's
   author, then the invalidated refetch reconciles.
5. **Shares are anonymous and fire-and-forget.** No auth, no spinner, no failure toast.
6. **Like/bookmark are silent.** No toasts — the flip and rollback are the only feedback.
7. **Comment thread is one level deep.** No reply-to-reply affordance, ever.
8. **Ownership is client-derived.** Edit/delete affordances gate on `comment.userId` vs the
   auth user id — no server round-trip to decide.
9. **Videos have no native like / comment / bookmark — by design, not a gap.**
   - **Like / comment** for a video are shown from **YouTube** (`IYoutubeVideoStats`, in the
     scoreboard) — the video lives on YouTube, so its social proof comes from there. A native
     video like/comment would compete with the YouTube numbers, not complement them.
   - **Bookmark** is an *article* concept (save an editorial piece to read later). The video
     equivalent of "save" already exists as **add-to-playlist** — a richer, named-collection
     model. A flat video bookmark would duplicate playlists with a worse UX.
   - Videos therefore expose only the interactions that are theirs to own: **share** and
     **rating**. Do not add native video like/comment/bookmark.

---

## Backend gaps (closed backend-side; frontend wiring lands with the next client regen)

### G1 — Shares had no channel — **closed, end to end**

The share command, `*ShareEntity` (article, video, short video), and endpoints now carry a
`ShareChannel` (an `EnumShareChannel` — `Facebook`/`X`/`WhatsApp`/`Clipboard`/`WebShare` —
stored via the `ShareChannel` value object, `share_channel` column). Named `ShareChannel`,
not `Platform`, to avoid colliding with the Identity module's `EnumPlatform` (OS). The
endpoints take an optional JSON body `{ "shareChannel": "..." }`, parsed case-insensitively
(unrecognized → ignored). The frontend sends it from the share hooks and rail; see
[08 — Shares](08-shares.md).

### G2 — No rating readback — **closed in the backend**

`VideoDetailDto` now carries `IsRated` (bool, mirrors the `IsLiked`/`IsBookmarked` family) and
`RatedStars` (1–5, null when anonymous or unrated), populated on `GET /public/videos/{slug}`
from the caller's `VideoRatingEntity` via the same optional-claims pattern as the article
detail endpoint.
**Remaining:** regenerate the API client, add `isRated`/`ratedStars` to `IVideoDetailEntity` +
mapper, and seed `VideoRatingModal`'s selection from it.

### G3 — No standalone "is bookmarked / liked" check

The per-user flags ride only on the **article** read DTOs. There is no lightweight
`GET .../is-bookmarked`. Fine today (the flag arrives with the content), but a surface that
needs the flag *without* fetching the content (e.g. a global "saved" indicator) has no source.

---

## Assumptions

- **Short videos stay out of scope** until the short-video content type is introduced to the
  frontend; the backend's short-video like/bookmark/share/view endpoints are then a separate
  feature that reuses these patterns.
- **Comment moderation is split by app — by design.** There are two delete paths:
  - **Delete own comment** — `DELETE /public/.../comments/{id}` (ownership-checked). A
    **Visitor** self-service action; belongs in this public frontend (specced in
    [specs/05-comments.md](specs/05-comments.md), Phase 4).
  - **Delete any comment** — `DELETE /admin/.../comments/{id}` (`RequireAdminOrSuperAdmin`).
    **Moderation**; belongs in **`apps/dashboard`**, never here. The public frontend is
    Visitor-only — it has no admin session and would 403 against the admin policy, so this
    endpoint is never called from this app.
- **Dummy-data phase.** Comment lists fall back to dummy comments when the backend is sparse;
  this is removed once real content flows (same pattern as the feeds).
- **Counts are trusted from the DTO.** The frontend never recomputes a count by summing rows;
  it displays and optimistically adjusts the denormalized value. Anonymous share/view counts
  are naive increments today (inflatable) — deduplication and integrity are a backend
  follow-up documented in [15 — Counting Anonymous Actions](15-counting-anonymous-actions.md).

---

## Deferred, ready to build (backend exists) — **shipped**

Both are now implemented in this frontend:

- Comment **reply** (one level, `ArticleDetailComment.Replies`), **edit own**, **delete own**
  (inline confirm), **like** (`useToggleArticleCommentLike`).
- Article **"my bookmarks"** list at `/bookmarks` (`BookmarksContainer` +
  `useMyArticleBookmarks`), auth-gated with a login-prompt empty state.

See [13-implementation-plan.md](13-implementation-plan.md) for the original phasing.
