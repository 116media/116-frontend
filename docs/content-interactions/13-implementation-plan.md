# 13 — Implementation Plan

Most interactions are already shipped for articles and videos. This plan covers the
**remaining work** — comment completion, my-bookmarks — plus the documentation of the
shipped surface. Each phase is independently verifiable (`npx tsc --noEmit` + biome clean)
and maps to a spec.

---

## Dependencies

- No new npm packages. All interaction UI reuses shipped primitives (`Button`, `Textarea`,
  `ConfirmDialog`, `StateRenderer`, `EmptyState`, the barrel icons).
- Backend endpoints for every deferred item **already exist** — no backend work is required
  for comment reply/edit/delete/like or my-bookmarks.
- The share `platform` gap and rating `myRating` gap are **backend changes**, out of this
  plan's scope; tracked in [14](14-open-questions.md).
- Run `npm show <pkg> dist-tags.latest` before pinning anything only if a new dep is ever
  proposed (none is).

---

## Phases

### Phase 0 — Document the shipped surface *(this docs set)*

- Record every endpoint, entity flag, hook, and component for the shipped interactions.
- Verify: docs match the code (`useToggle`, `useToggleArticleLike`, `useShareArticle`,
  `useArticleComments`, `useAddArticleComment`, `useRateVideo`, `useShareVideo`).
- Specs: [specs/01](specs/01-domain-and-mappers.md), [specs/02](specs/02-repository-and-usecases.md),
  [specs/03](specs/03-hooks-and-keys.md).

### Phase 1 — Comment entity extension

- Add `parentCommentId`, `replyCount`, `likeCount`, `isLiked` to `IArticleCommentEntity`.
- Extend the comment mapper to carry them; default flags to false.
- Verify: `tsc` clean; existing comment list renders unchanged.
- Spec: [specs/01](specs/01-domain-and-mappers.md), [specs/05](specs/05-comments.md).

### Phase 2 — Comment like

- Port + use cases for `likeArticleComment` / `unlikeArticleComment` (+ DI, cradle).
- `useToggleArticleCommentLike` over `useToggle`, seeded from the comment's `isLiked`/`likeCount`.
- A heart affordance on `ArticleDetailComment`, auth-gated.
- Verify: like flips optimistically; idempotent re-like is a no-op.
- Spec: [specs/05](specs/05-comments.md).

### Phase 3 — Replies

- Port + use cases: `getCommentReplies` (paginated), `addCommentReply`.
- `useCommentReplies(commentId)` infinite query; `useReplyToComment` mutation (prepend +
  `replyCount` bump).
- Reply composer + "view N replies" toggle on **top-level** comments only.
- Verify: reply-to-reply affordance never appears; posting prepends into the parent.
- Spec: [specs/05](specs/05-comments.md).

### Phase 4 — Edit / delete own comment

- Port + use cases: `editArticleComment`, `deleteArticleComment`.
- `useEditArticleComment` (inline edit form), `useDeleteArticleComment` (confirm →
  tombstone in place + `commentCount` −1).
- Ownership gate: affordances only when `comment.userId === currentUserId`.
- Verify: editing another user's comment is impossible from the UI; delete leaves a tombstone.
- Spec: [specs/05](specs/05-comments.md).

### Phase 5 — My bookmarks

- Port `getMyArticleBookmarks` + use case + DI.
- `useMyArticleBookmarks()` infinite query; `/bookmarks` Visitor-gated route reusing
  `ArticlesGrid` + states.
- Verify: the grid pages the user's saved articles; logged-out access redirects to sign in.
- Spec: [specs/06](specs/06-bookmarks.md).

### Phase 6 — i18n & notifications

- Add the deferred `articles.comments.*` (reply/edit/delete/confirm/replies) and
  `articles.bookmarks.*` keys to en + fr.
- Add `editFailed` / `deleteFailed` / `replyFailed` to the comment notification config.
- Verify: en/fr key parity; every new string resolves.
- Spec: [specs/09](specs/09-i18n-and-notifications.md).

---

## Verification checklist

- [ ] Shipped interactions documented and cross-checked against code (Phase 0).
- [ ] Comment entity carries `parentCommentId`/`replyCount`/`likeCount`/`isLiked` (Phase 1).
- [ ] Comment like toggles optimistically and is idempotent (Phase 2).
- [ ] Replies load lazily and post into the parent; no nested-reply affordance (Phase 3).
- [ ] Edit/delete gated to the owner; delete soft-tombstones and decrements the count (Phase 4).
- [ ] `/bookmarks` pages saved articles; auth-gated (Phase 5).
- [ ] All new copy present in en + fr; comment mutation toasts wired (Phase 6).
- [ ] `tsc` + biome clean after every phase; production build passes.
