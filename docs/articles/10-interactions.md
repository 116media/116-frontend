# Interactions (Like / Comment / Share / Bookmark)

`ArticleCardEngagement` renders **four** interactions: **like**, **comment**,
**share**, and **bookmark**. The buttons stop propagation so they never trigger the
card's article link. They fall into two kinds:

| Interaction | Kind | Behavior from the card |
| --- | --- | --- |
| **Like** | mutation | Optimistic toggle, **auth-gated**, `POST/DELETE /likes` |
| **Bookmark** | mutation | Optimistic toggle, **auth-gated**, `POST/DELETE /bookmarks` |
| **Share** | mutation + native | Opens the share sheet; fires `POST /shares` telemetry (auth only) |
| **Comment** | navigation → drawer | Opens the article and **auto-opens the comments drawer**, scrolled to the composer (see below). Shows the count. |

Composing a comment needs the full thread, which lives on the detail page — so from the
**listing card** the comment button **opens the article with its comments drawer already
open**. The card still shows the live `commentCount`.

---

## The engagement bar

```tsx
/**
 * ArticleCardEngagement
 *
 * @description
 * The bottom action row of the article card: like (with count), comment count, share,
 * and bookmark. Like and bookmark toggle optimistically and are gated behind auth; a
 * guest tap opens the auth modal and resumes on success. All buttons stop event
 * propagation so they do not follow the card's article link.
 *
 * @param articleId - The article the mutations target.
 * @param slug - The article slug (comment link target).
 * @param likeCount - Baseline like count.
 * @param commentCount - Comment count shown on the comment button.
 * @param bookmarkCount - Baseline bookmark count.
 */
export function ArticleCardEngagement({
    articleId, slug, likeCount, commentCount, bookmarkCount
}: ArticleCardEngagementProps) {
    const like = useToggleArticleLike(articleId, likeCount);
    const bookmark = useToggleArticleBookmark(articleId, bookmarkCount ?? 0);
    return (/* … four ghost buttons — full body in specs/06 … */);
}
```

The row is a left cluster (like · comment · share) and a right-aligned bookmark, all
`Button variant="ghost" size="sm"` with muted foreground. Every sub-component receives
only the fields it needs — never the whole `article`. The full implementation is in
[specs/06-interactions-and-dummy-data.md](specs/06-interactions-and-dummy-data.md).

---

## Local state, because the DTO has no per-user flags

`ArticleSummaryDto` exposes **counts** but neither `isLiked` nor `isBookmarked` (see
[03-backend-api-reference.md](03-backend-api-reference.md)). So the "did I like this?"
state is **client-owned**:

- Each toggle hook keeps the boolean in a small per-article store (the mutation's own
  state, keyed by `article.id`), starting `false` on load.
- On toggle: flip the boolean, adjust the displayed count by ±1 **optimistically**,
  fire the mutation, and roll back if it fails.
- The **count** baseline comes from the entity (`likeCount`, `bookmarkCount`); the
  delta is the local toggle.

> This is a known limitation, not a design goal: without a per-user flag the initial
> liked/bookmarked state cannot reflect the server on first paint. Documented in
> [15-open-questions.md](15-open-questions.md) with the request to add `isLiked` /
> `isBookmarked` (or a batch "my interactions" endpoint).

### Colors (tokens, not the brief's raw values)

The brief used `fill-red-500 text-red-500` for a liked heart and `fill-primary` for a
bookmark. Per the no-hardcoded-colors rule, use tokens: `fill-destructive
text-destructive` for like, `fill-primary text-primary` for bookmark — or introduce a
dedicated `--like` token if a non-destructive red is wanted. See
[15-open-questions.md](15-open-questions.md).

---

## Auth gating

Like and bookmark require a session. Reuse `useRequireAuth` (the same gate the rest of
the app uses):

A guest tap opens the auth modal and resumes on success:

```ts
const requireAuth = useRequireAuth();
const onLike = requireAuth(() => like.toggle());
```

Share does not require auth for the local share sheet; the `POST /shares` telemetry
call is fire-and-forget and only sent when authenticated.

---

## Mutation hooks

One thin hook per action, each over a use case that wraps the generated client
(`publicLikeArticle`, `publicUnlikeArticle`, `publicBookmarkArticle`,
`publicUnbookmarkArticle`, `publicShareArticle`). Shape mirrors `useLogin`:

```tsx
/**
 * useToggleArticleLike
 *
 * @description
 * Optimistically toggles the like state for one article and calls the like/unlike
 * endpoint accordingly. Adjusts the cached like count by ±1 and rolls back on failure.
 *
 * @param articleId - The article to like/unlike.
 */
export function useToggleArticleLike(articleId: string) { /* useMutation … */ }
```

On success/settled, the hooks may `invalidateQueries(articleKeys.all)` to reconcile
counts with the server; optimistic updates keep the UI immediate.

---

## Comment → article + comments drawer (deferred)

The comment button opens the article **with its comments drawer already open**, focused
on the composer at the bottom. It needs no auth to open (reading is public); posting a
comment inside the drawer is auth-gated.

**Planned behavior (detail-page work — implement later):**

- The card's comment button navigates to the article with an intent to open comments —
  e.g. `href={`/articles/${slug}?comments=1`}` (a query flag the detail page reads),
  `stopPropagation` only so it still routes.
- On the detail page, that flag **auto-opens a comments drawer**:
  - **Tablet (`md`+):** a **left-side drawer** sliding in from the left.
  - **Mobile:** a **bottom sheet** sliding up from the bottom.
- The drawer **auto-scrolls to and focuses the comment text input** at the bottom, so
  the visitor lands ready to type.
- Built on a shared `Drawer`/`Sheet` primitive (Radix Dialog with side variants — none
  exists yet), reusing `useRequireAuth` to gate posting.

> **Status: deferred.** This is detail-page scope and is not part of the listing build.
> The listing card only needs to *link with the comments intent*; the drawer, the
> thread, and posting are a later phase. Captured here and in
> [15-open-questions.md](15-open-questions.md) so the card's link shape is decided now
> (query flag, not a `#comments` hash) and won't need to change when the drawer ships.

For the first cut the comment button may simply link to `/articles/${slug}` (the detail
route); the `?comments=1` auto-open is wired when the drawer lands.

## Scope

- **In scope from the card (this build):** like, unlike, bookmark, unbookmark, share,
  and the comment **link** (opens the article).
- **Deferred (later phase):** the comments **drawer** (left on tablet / bottom on
  mobile) with auto-scroll to the composer, and posting/editing comments — all
  detail-page concerns.
