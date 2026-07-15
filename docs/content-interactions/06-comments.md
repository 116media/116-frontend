# 06 — Comments

Comments are the richest interaction: a paginated thread with a composer, one level of
replies, edit/delete of your own, and per-comment likes. **Articles only** — videos have no
comments (the video scoreboard's "comments" is a YouTube stat).

---

## The current cut vs. the full surface

The frontend ships **create + list**. The backend supports the whole thread. This doc
documents both and marks the boundary.

| Capability | Backend | Frontend | This doc |
|---|:---:|:---:|---|
| List (paginated, infinite) | ✅ | ✅ | shipped |
| Post top-level | ✅ | ✅ | shipped |
| Reply (one level) | ✅ | ❌ | **spec [05](specs/05-comments.md)** |
| Edit own | ✅ | ❌ | **spec [05](specs/05-comments.md)** |
| Delete own (soft) | ✅ | ❌ | **spec [05](specs/05-comments.md)** |
| Like a comment | ✅ | ❌ | **spec [05](specs/05-comments.md)** |

---

## List

`useArticleComments(articleId)` is an infinite query over `getArticleComments`, paging on a
0-based `pageIndex` while the mapped `hasNextPage` is true (page size **10**). Dummy-data
phase: a failed or empty page falls back to dummy comments so the thread previews. The list
renders newest-first; each row is one `IArticleCommentEntity`.

Deleted comments are **tombstones**: they stay in the list with `body = null`,
`author = null`, `isDeleted = true`, and render as a muted "comment deleted" row (so reply
context isn't lost).

---

## Post

`useAddArticleComment(articleId, slug)` is an auth-gated mutation. `submit(body, onPosted?)`
runs behind `useRequireAuth`; on success it:

1. **prepends** the new comment to the first cached page and bumps that page's `count`,
2. **bumps** the cached article's `commentCount` (keeps the header count live),
3. invalidates the comments query,
4. runs `onPosted` (the composer clears + the detail page scrolls to the thread).

Because the create response doesn't resolve an author, the optimistic row's byline is filled
from the **auth context** (`authorFromUser(user)`).

Body is validated **≤ 1000 chars** — the composer enforces it client-side and the backend
re-validates (400 `CommentBodyTooLong`).

---

## Reply (deferred)

Replies are **one level deep**. A reply targets a top-level comment; the backend rejects a
reply-to-a-reply with **400 `CannotReplyToReply`**, so the UI shows a reply affordance only
on top-level comments. Replies load lazily via `getCommentReplies(commentId)` (paginated),
and posting mirrors `useAddArticleComment` but calls the reply endpoint and prepends into
the parent's replies list, bumping `replyCount`.

---

## Edit / delete own (deferred)

- **Edit** — `PUT` with the new body; ownership enforced server-side
  (400 `NotCommentOwner`). The UI offers edit only when `comment.userId === currentUserId`.
- **Delete** — soft delete; the row becomes a tombstone in place, `commentCount` −1. Offered
  only for own comments. A confirm step (reuse `ConfirmDialog`) guards it.

Ownership is computed on the frontend from `comment.userId` vs the auth context's user id —
the DTO carries `userId` precisely so the client can decide whether to show edit/delete
without a round-trip.

---

## Comment likes (deferred)

Each comment carries `likeCount` + per-viewer `isLiked`. The like is **idempotent**
server-side. A small heart on each comment row reuses `useToggle` over the comment
like/unlike endpoints. See [05-likes.md](05-likes.md).

---

## Components

| Component | Role | Status |
|---|---|---|
| `ArticleDetailComments` | thread section: heading, composer, infinite list, states | shipped |
| `ArticleDetailComment` | one comment row (byline, body, relative date) | shipped |
| `ArticleDetailCommentComposer` | textarea + submit, char guard | shipped |
| *reply composer / edit form / delete confirm / comment-like* | — | deferred |

The shipped components are documented; the deferred ones are specced in full in
[specs/05-comments.md](specs/05-comments.md).

---

## i18n

`articles.comments.*` (title with count, empty, error title/retry, end-of-feed, load-more)
and `articles.detail.comment`. Deferred capabilities add reply/edit/delete/confirm strings —
see [12](12-i18n-and-notifications.md).
