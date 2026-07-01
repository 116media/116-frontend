# 09 — Interactions

`ArticleDetail.Engagement` is the detail page's action row: **like**, **comment**, and
**bookmark**, each with a live count. It reuses the feed's interaction hooks **unchanged**
and differs from the card in exactly one place — the **comment** button. On the feed card
the comment button *navigates* to the article; here, we are already on the article, so it
**scrolls to and focuses the comment composer** on this same page.

Share lives in its own rail ([08-share-rail.md](08-share-rail.md)), not in this row.

| Interaction | Kind | Behavior on the detail page |
|---|---|---|
| **Like** | mutation | Optimistic toggle, **auth-gated**, `POST/DELETE /likes` |
| **Bookmark** | mutation | Optimistic toggle, **auth-gated**, `POST/DELETE /bookmarks` |
| **Comment** | in-page scroll | Smooth-scrolls to the comments section and focuses the composer textarea — **no drawer, no navigation**. Shows `commentCount`. |

---

## Reused hooks, verbatim

The like and bookmark hooks are the same ones the feed card uses — no changes, no new
variants:

```ts
useToggleArticleLike(articleId, likeCount)     → { liked, count, toggle }
useToggleArticleBookmark(articleId, bookmarkCount) → { bookmarked, count, toggle }
```

Both own the boolean state client-side (the DTO has no per-user flag), start `false`, and
adjust the displayed count by ±1 optimistically, rolling back on failure. The **count
baseline** comes from the entity (`likeCount`, `bookmarkCount`); the delta is the local
toggle.

```tsx
const like = useToggleArticleLike(articleId, likeCount);
const bookmark = useToggleArticleBookmark(articleId, bookmarkCount);
```

---

## Auth gating — the same `useRequireAuth` the card uses

Like and bookmark require a session. The detail row gates them exactly as
`ArticleCard.Engagement` does — a guest tap opens the auth modal and resumes on success:

```tsx
const requireAuth = useRequireAuth();
onClick={() => requireAuth(like.toggle)}
```

The comment button needs no auth to *scroll* (reading and reaching the composer is public);
posting inside the composer is auth-gated by the composer itself
([12-comments.md](12-comments.md)).

### Colors — tokens, active states

Active states use tokens, matching the feed:

- **Liked**: `HeartIcon` gets `fill-destructive text-destructive`; the count turns
  `text-destructive`.
- **Bookmarked**: `BookmarkPlusIcon` gets `fill-primary text-primary`.
- **Comment**: `MessageSquareIcon`, muted, no active state (it is an action, not a toggle).

No hardcoded colors — `fill-destructive` / `fill-primary` are the tokens the module
standardized on (see [../articles/10-interactions.md](../articles/10-interactions.md)).

---

## The comment button — scroll + focus, not a drawer

On the feed the comment button navigates (`/articles/{slug}?comments=1`). On the detail
page there is nowhere to navigate — the composer is on the page. So the button runs a small
**scroll handler** that brings the comments section into view and focuses the textarea:

- The comments section carries a stable **id anchor** (`id="comments"`) — or the composer
  exposes a **shared ref** the page threads down.
- On click: `scrollIntoView({ behavior: "smooth", block: "start" })` on the section, then
  `focus()` on the textarea so the reader lands ready to type.

Two mechanisms, either acceptable:

1. **Id anchor + handler** — the engagement row receives an `onComment` callback (or knows
   the anchor id); it queries the section and the textarea and drives the scroll/focus.
2. **Shared ref** — the `ArticleDetail` assembler holds a `composerRef` (a
   `RefObject<HTMLTextAreaElement>`), passes it to the composer, and passes an
   `onComment` that scrolls to and focuses `composerRef.current`. Cleaner (no DOM query),
   preferred.

```tsx
const composerRef = useRef<HTMLTextAreaElement>(null);

const focusComposer = () => {
    composerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    composerRef.current?.focus({ preventScroll: true });
};
```

The button always shows `commentCount` beside the icon — the same live figure the comments
section reflects.

---

## No per-user initial state

The `ArticleDetailDto` has **no** `isLiked` / `isBookmarked`
([03-backend-api-reference.md](03-backend-api-reference.md) §1), so on first paint the
detail page cannot know whether the current user already liked or saved the article. Initial
state is `false` and optimistic — identical to the feed. This is a known limitation, not a
goal; the fix (a per-user flag or a batch "my interactions" endpoint) is tracked in
[19-open-questions.md](19-open-questions.md).

---

## Layout

The row sits after the body and before the tags block ([10-tags.md](10-tags.md)): a left
cluster (like · comment) and a right-aligned bookmark, all `Button variant="ghost"` /
`"outline"` with muted foregrounds — the same visual grammar as the card's engagement bar,
scaled up for the reading column.

The full component, the ref threading, and the scroll/focus handler are in
[specs/08-interactions.md](specs/08-interactions.md).
