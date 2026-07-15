# 05 — Likes

A **like** is a per-user toggle with a live count. The backend exposes separate POST (like)
and DELETE (unlike) endpoints; the frontend flips optimistically and rolls back on failure.

Applies to: **articles** (shipped), **article comments** (deferred), **short videos** (out
of scope — type not modeled), **not full videos** (no endpoint).

---

## Behaviour

| Aspect | Rule |
|---|---|
| Toggle | One button; icon fills when liked (`fill-destructive`), outline when not |
| Count | `likeCount` shown beside the icon; +1 / −1 immediately on tap |
| Auth | Visitor required — a logged-out tap opens the auth modal, then resumes |
| Optimism | State flips before the request; rolls back on error |
| Backend | 409 if re-liking, 400 if unliking when not liked — both surface as rollback |
| Anonymous | Not allowed (no like without a session) |

---

## The hook (articles — reference)

`useToggleArticleLike(articleId, initialCount, initialLiked)` wraps the shared `useToggle`
over the like/unlike use cases and returns `{ liked, count, toggle }`:

```ts
const { liked, count, toggle } = useToggleArticleLike(
    article.id,
    article.likeCount,
    article.isLiked // false on feed cards (no per-user flag on the summary)
);
```

`initialLiked` seeds from the detail entity's `isLiked`; on feed surfaces where the summary
carries no flag it defaults to `false`. The button calls `toggle()`; `useToggle` flips
`on`/`count`, runs the correct use case, and rolls both back on failure
([10](10-state-management-and-hooks.md)).

---

## Auth gating

Like is a write, so it is gated. The engagement component wraps the toggle in
`useRequireAuth` so a logged-out user is taken through the auth modal and the like resumes
on success (same pattern as `ArticleCard.Engagement`). No toast on success — the flipped
icon is the feedback; no toast on failure either — the rollback is the feedback.

---

## Comment likes (deferred)

Article **comments** are themselves likeable. The DTO already carries `likeCount` +
`isLiked` per viewer; the backend like is **idempotent** (double-like is a no-op, not a
409). A comment-like reuses the same `useToggle`, wired over
`publicLikeArticleComment` / `publicUnlikeArticleComment`, seeded from the comment's own
`isLiked` / `likeCount`. Specced with the rest of comment completion in
[specs/05-comments.md](specs/05-comments.md).

---

## Why full videos have no like — by design

Full videos have **no like** and never will. This is a product decision, not a missing
endpoint: a video lives on YouTube, so its like/comment counts are shown from
**YouTube** (`IYoutubeVideoStats`, in the scoreboard). A native video like would compete
with the YouTube number rather than complement it. **Do not build a video like button.**
See decision 9 in [14](14-open-questions.md).

---

## Surfaces

| Surface | Component | State |
|---|---|---|
| Article feed / promotion card | `ArticleCard.Engagement` | counts, actionable toggle (`initialLiked=false`) |
| Article detail | `ArticleDetail.Engagement` | live like with `isLiked` seed |
| Article comment (deferred) | comment card action row | comment-like toggle |

The full component contract is in [specs/04-likes.md](specs/04-likes.md).
