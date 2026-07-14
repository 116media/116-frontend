# 02 — Support Matrix

The single most important reference for this feature: **which interaction applies to which
content type**. Some interactions are absent by product design (a full video has no like —
its like/comment come from YouTube, its "save" is add-to-playlist), and there is no endpoint
to build one against. This table prevents that class of mistake.

---

## Content type × interaction

| Interaction | Article | Full video | Short video | Comment (as a target) |
|---|:---:|:---:|:---:|:---:|
| **Like / Unlike** | ✅ | ❌ | ✅ | ✅ (idempotent) |
| **Comment** (+ reply) | ✅ | ❌ | ❌ | — |
| **Bookmark / Unbookmark** | ✅ | ❌ | ✅ | — |
| **Share** | ✅ (anon) | ✅ (anon) | ✅ (anon) | — |
| **Rating** (1–5) | ❌ | ✅ | ❌ | — |
| **View** (record) | ❌ | ❌ | ✅ (anon) | — |

Legend: ✅ backend endpoint exists · ❌ no endpoint · *(anon)* anonymous callers allowed ·
*idempotent* re-doing the action is a no-op (not an error).

---

## Frontend implementation status

Cross-referencing the matrix above with what the frontend actually has today:

| Interaction × type | Backend | Frontend | Verdict |
|---|:---:|---|---|
| Article like/unlike | ✅ | entity flags, port, use cases, hook, engagement UI, i18n | **shipped** |
| Article comment create + list | ✅ | entity, page, port, use cases, hooks, thread UI | **shipped** |
| Article comment reply | ✅ | — | **deferred** — spec [05](specs/05-comments.md) |
| Article comment edit own | ✅ | — | **deferred** — spec [05](specs/05-comments.md) |
| Article comment delete own | ✅ | — | **deferred** — spec [05](specs/05-comments.md) |
| Article comment like/unlike | ✅ | DTO carries `isLiked`/`likeCount`; no UI | **deferred** — spec [05](specs/05-comments.md) |
| Article bookmark/unbookmark | ✅ | full stack | **shipped** |
| Article "my bookmarks" list | ✅ | `getMyArticleBookmarks` API exists; no port/hook/page | **deferred** — spec [06](specs/06-bookmarks.md) |
| Article share | ✅ | use case, hook, share rail, notification | **shipped** *(platform inert)* |
| Video rating | ✅ | entity fields, port, use case, hook, modal, i18n | **shipped** *(no `myRating`)* |
| Video share | ✅ | use case, hook, modal, notification | **shipped** *(platform inert)* |
| Full-video like/bookmark/comment | ❌ | — | **by design** — like/comment come from YouTube; "save" is add-to-playlist |
| Short-video anything | ✅ | short-video type not modeled | **out of scope** |

---

## Reading the matrix into work

- **Green + shipped** → documented as the reference; no work.
- **Green + deferred** → the backend is ready and the frontend is missing; these are the
  actual build items, specced in this folder.
- **Green + shipped with a caveat** (share platform, rating readback) → documented gaps,
  tracked in [14](14-open-questions.md), not blocking.
- **Red (by design)** → never attempt. Video like/comment come from **YouTube**
  (`IYoutubeVideoStats`, scoreboard); the video "save" concept is **add-to-playlist**. These
  are deliberate product choices, not missing endpoints — see decision 9 in
  [14](14-open-questions.md).
- **Out of scope (short video)** → only becomes relevant if the short-video content type is
  introduced to the frontend; that is a separate feature.
