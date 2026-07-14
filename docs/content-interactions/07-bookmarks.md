# 07 — Bookmarks

A **bookmark** is a per-user "save for later" toggle with a count, plus a **list** of
everything the user saved. Articles (shipped) and short videos (out of scope). Not full
videos.

---

## Behaviour

| Aspect | Rule |
|---|---|
| Toggle | One button; icon fills when bookmarked (`fill-primary`), outline when not |
| Count | `bookmarkCount` shown beside the icon; +1 / −1 immediately |
| Auth | Visitor required — logged-out tap opens the auth modal, then resumes |
| Optimism | Flips before the request; rolls back on error |
| Backend | 409 if re-bookmarking, 400 if unbookmarking when not saved — both rollback |
| Anonymous | Not allowed |

Bookmark is the structural twin of like — same `useToggle`, same auth gate, same optimistic
rollback — differing only in the endpoints and the active-state token (`fill-primary` vs
`fill-destructive`).

---

## The hook (articles — reference)

`useToggleArticleBookmark(articleId, initialCount, initialBookmarked)` wraps `useToggle`
over the bookmark/unbookmark use cases and returns `{ bookmarked, count, toggle }`, seeded
from the detail entity's `isBookmarked` / `bookmarkCount` (false on feed cards).

---

## My bookmarks (deferred)

The backend has **`GET /public/articles/bookmarks`** (Visitor auth), returning the caller's
bookmarked articles as a paginated `ArticleSummaryDto` list. **No frontend surface consumes
it yet** — no port method, no hook, no page.

The specced build ([specs/06-bookmarks.md](specs/06-bookmarks.md)):

- port `getMyArticleBookmarks(query)` + use case + DI,
- `useMyArticleBookmarks()` infinite query (mirrors `useArticlesFeed`),
- a `/bookmarks` route (Visitor-gated) rendering the existing `ArticlesGrid` + states +
  infinite scroll — the feature reuses the article feed grid wholesale, only the data source
  changes.

There is **no** "my bookmarks" for short videos (no endpoint) and **no** standalone "is this
bookmarked?" check — the `isBookmarked` flag rides on the article read DTOs, so the toggle
seeds its state without an extra request.

---

## Surfaces

| Surface | Component | State |
|---|---|---|
| Article feed / promotion card | `ArticleCard.Engagement` | count + toggle (`initialBookmarked=false`) |
| Article detail | `ArticleDetail.Engagement` | live bookmark with `isBookmarked` seed |
| My bookmarks (deferred) | `/bookmarks` route + `ArticlesGrid` | paginated saved list |

The full component + hook contract is in [specs/06-bookmarks.md](specs/06-bookmarks.md).
