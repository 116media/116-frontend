# 10 — State Management & Hooks

Every interaction is a mutation with optimistic UI. This doc covers the shared toggle
mechanism, the per-interaction hooks, and the query keys they touch.

---

## The optimistic toggle — `useToggle`

`src/shared/presentation/hooks/useToggle.ts` is the heart of like and bookmark. It holds
local `on` (boolean) + `count` (number), flips both immediately on `toggle()`, runs the
mutation, and **rolls both back on error**:

```ts
export function useToggle(
    initialCount: number,
    onExecute: (next: boolean) => Promise<boolean>,
    initialOn = false
) {
    const [on, setOn] = useState(initialOn);
    const [count, setCount] = useState(initialCount);
    const mutation = useMutation<boolean, Failure, boolean>({ mutationFn: onExecute });

    const toggle = () => {
        const next = !on;
        setOn(next);
        setCount((c) => c + (next ? 1 : -1));
        mutation.mutate(next, {
            onError: () => {
                setOn(!next);
                setCount((c) => c + (next ? -1 : 1));
            }
        });
    };
    return { on, count, toggle };
}
```

Notes:

- **No success reconciliation.** On success nothing is re-read — the optimistic value stands
  (a like is a boolean, not a contended counter).
- **`runInteraction`** bridges `Result<boolean>` use cases to the throw-based mutation:
  `if (!result.ok) throw result.error; return result.value;` — so a failed `Result` triggers
  `onError` and the rollback.
- **Seeding.** `initialOn` comes from the entity's per-user flag (`isLiked` / `isBookmarked`)
  on detail surfaces, `false` on feed cards that carry no flag.

---

## Per-interaction hooks

| Hook | Kind | Shape | Status |
|---|---|---|---|
| `useToggleArticleLike(id, count, liked?)` | like | `{ liked, count, toggle }` | shipped |
| `useToggleArticleBookmark(id, count, marked?)` | bookmark | `{ bookmarked, count, toggle }` | shipped |
| `useShareArticle(id, slug)` | share | `() => Promise<void>` | shipped |
| `useArticleComments(id)` | comment list | infinite query | shipped |
| `useAddArticleComment(id, slug)` | comment post | `{ submit, isPending }` | shipped |
| `useRateVideo(id, slug)` | rating | `{ submit, isPending }` | shipped |
| `useShareVideo(id, slug)` | share | `(shareChannel) => void` | shipped |
| `useToggleArticleCommentLike(commentId, count, liked)` | comment like | `{ liked, count, toggle }` | **deferred** |
| `useReplyToComment(articleId, parentId)` | reply | `{ submit, isPending }` | **deferred** |
| `useEditArticleComment(articleId, commentId)` | edit | `{ submit, isPending }` | **deferred** |
| `useDeleteArticleComment(articleId, commentId, slug)` | delete | `{ remove, isPending }` | **deferred** |
| `useCommentReplies(commentId)` | replies list | infinite query | **deferred** |
| `useMyArticleBookmarks()` | bookmarks list | infinite query | **deferred** |

The deferred hooks are specced in [specs/03-hooks-and-keys.md](specs/03-hooks-and-keys.md)
and the per-interaction spec files.

---

## Two mutation shapes

1. **Optimistic-local (like, bookmark, comment-like)** — `useToggle`; UI updates first,
   rolls back on error, never re-reads on success.
2. **Invalidate-on-success (comment post, rating, edit/delete)** — a normal `useMutation`
   whose `onSuccess` patches or invalidates the relevant cache so the server truth returns.
   Comment post additionally does an optimistic **prepend** for instant feedback while also
   invalidating.

Rating is invalidate-only (the aggregate is server-computed); comment post is optimistic
prepend **plus** invalidate (best of both — instant row, correct final list).

---

## Query keys

Interaction reads live under the content module's key factory. Articles:

```ts
articleKeys.comments(articleId)   // [...all, "detail", articleId, "comments"]  — comment list
articleKeys.detail(slug)          // patched for commentCount / like / bookmark counts
// deferred:
articleKeys.replies(commentId)    // [...all, "detail", commentId, "replies"]
articleKeys.myBookmarks(filters)  // [...all, "bookmarks", filters]
```

Videos reuse `videoKeys.detail(slug)` — rating and share both invalidate/patch it. No
separate interaction keys exist for videos (no like/comment/bookmark).

`ARTICLE_COMMENTS_PAGE_SIZE = 10`. Mutations patch the cache directly (prepend, count bump)
and then invalidate, so the optimistic view and the eventual server view converge.

---

## Auth gating

Writes route through `useRequireAuth`: `submit`/`toggle` call `requireAuth(() => …)`, which
runs the action if signed in, else opens the auth modal and resumes on success. Share is the
exception — anonymous-allowed, never gated.
