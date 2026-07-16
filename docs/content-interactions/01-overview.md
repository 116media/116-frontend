# 01 — Overview

## What "content interactions" means here

An **interaction** is a lightweight, high-frequency action a reader takes on a piece of
content. They are not a page or a route; they are a behaviour that attaches to content
surfaces. The frontend already ships most of them for articles and a subset for videos.
This documentation gathers the whole surface into one place, records the exact backend
contract, and specs the gaps.

Five interaction kinds:

| Kind | One-liner | Per-user state | Count |
|---|---|---|---|
| **Like** | Toggle appreciation | `isLiked` | `likeCount` |
| **Comment** | Write / read discussion | ownership (`userId`) | `commentCount` |
| **Bookmark** | Save for later | `isBookmarked` | `bookmarkCount` |
| **Share** | Record an outbound share | none (anonymous) | `shareCount` |
| **Rating** | 1–5 stars | *(not readable — see below)* | `ratingAverage` + `ratingCount` |

---

## Goals

- **One documented contract.** Every interaction endpoint, its auth, its request/response
  shape, and the per-user flags it feeds — in [03](03-backend-api-reference.md) and
  [04](04-domain-entities-and-mappers.md).
- **Optimistic by default.** Likes, bookmarks, and comment posts update the UI before the
  server confirms and roll back on failure. The mechanism is the shared `useToggle`
  ([10](10-state-management-and-hooks.md)).
- **Auth-gated writes.** Every write except *share* requires a signed-in Visitor. The
  frontend gates through `useRequireAuth` — clicking like while logged out opens the auth
  modal, then resumes the action.
- **Reuse across surfaces.** A like button on a feed card and on the detail page share one
  hook; the article implementation is the template the video surfaces follow where the
  backend allows.

---

## Scope

**In scope (documented + specced):**

- Article: like/unlike, bookmark/unbookmark, share, comment create + list. *(All shipped —
  documented as the reference.)*
- Article comments **completion**: reply, edit own, delete own, comment like/unlike.
  *(Backend ready; frontend deferred — specced here.)*
- Article **"my bookmarks"** list. *(Backend ready; no frontend surface — specced here.)*
- Video: share, rating. *(Shipped — documented.)*
- The share **channel** (`shareChannel`) and the video **rating readback**
  (`isRated`/`ratedStars`) — once gaps, now wired end-to-end ([14](14-open-questions.md)).

**Out of scope:**

- **Short videos.** The backend supports like/bookmark/share/view on short videos, but the
  short-video content type is not modeled anywhere in the frontend. Noted in
  [02](02-support-matrix.md); not specced.
- **Full-video like/bookmark/comment.** Excluded by design — video like/comment come from
  YouTube (scoreboard) and "save" is add-to-playlist. See decision 9 in
  [14](14-open-questions.md).
- **Admin comment moderation.** Admin delete is an `/admin/...` endpoint, out of the public
  frontend's scope.

---

## Decisions locked

1. **Separate on/off use cases, not a toggle endpoint.** The backend exposes POST (on) and
   DELETE (off) pairs; the frontend picks the verb from the next state inside `useToggle`.
2. **Optimistic, no success reconciliation for toggles.** Like/bookmark flip immediately
   and only touch the server on error (rollback). Ratings, which recompute an aggregate
   server-side, invalidate the detail query instead.
3. **Shares are fire-and-forget.** Failures are swallowed — share telemetry never blocks or
   toasts. The share still "works" (the sheet opened / URL copied) even if recording fails.
4. **The share channel is recorded.** The frontend passes a `shareChannel` label to the
   share use case; the backend parses it (case-insensitive, via the `ShareChannel` value
   object) and stores an `EnumShareChannel` on the share row. Named `ShareChannel`, not
   `Platform`, to avoid the Identity module's `EnumPlatform` (OS). See [08](08-shares.md)
   and [14](14-open-questions.md).
5. **Comment thread is one level deep.** A reply-to-a-reply is rejected by the backend
   (400). The UI never offers a reply affordance on a reply.
6. **Rating cannot show "your rating".** No endpoint returns the caller's own star value,
   so the rating modal always opens unselected; after submit it toasts and refetches the
   new aggregate. See [09](09-ratings.md).
7. **Counts are denormalized on the parent.** `likeCount` / `commentCount` /
   `bookmarkCount` / `shareCount` / `ratingCount` live on the article/video read DTOs; the
   frontend never sums interaction rows.

---

## The reference implementation

Articles are complete for like/bookmark/share/comment-create-and-list. Read those first —
`useToggleArticleLike`, `useToggleArticleBookmark`, `useShareArticle`, `useArticleComments`,
`useAddArticleComment` — they are the pattern every new interaction hook copies. The specs
in this folder either **document** those verbatim or **extend** them (comment reply/edit/
delete, my-bookmarks) following the same shape.
