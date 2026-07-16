# 11 — Loading, Empty & Error States

Interactions are mostly instantaneous, so their state surface is small — but the comment
thread and the my-bookmarks list are full paginated feeds and need the standard skeleton /
empty / error / end-of-feed treatment.

---

## Toggles (like, bookmark)

- **Loading** — none. Optimistic; the flipped icon *is* the pending state.
- **Error** — none visible. `useToggle` rolls the icon/count back silently.
- **Empty / disabled** — a logged-out user still sees the button; tapping opens the auth
  modal rather than doing nothing.

No spinners, no toasts. The interaction feels synchronous.

---

## Share

- **Loading** — none. Fire-and-forget.
- **Error** — swallowed; no toast (see [08](08-shares.md)).
- The only visible failure is the browser's own (e.g. the user cancels the Web Share
  sheet), which is caught and ignored.

---

## Rating

- **Loading** — `isPending` disables the stars while the POST is in flight.
- **Success** — a success toast (`RatingNotification.success`) + detail refetch.
- **Error** — a failure toast (`RatingNotification.failed`); the stars re-enable.

---

## Comment thread (full feed states)

Reuses the standard feed-state set, driven by `StateRenderer` over `useArticleComments`:

| State | Treatment |
|---|---|
| Loading | `ArticleDetailComments.Loading` — skeleton rows matching the comment card |
| Error | `EmptyState` with a retry that refetches (`articles.comments.error.*`) |
| Empty | `EmptyState` "no comments yet" — composer stays visible above it |
| Content | the list + `isFetchingNextPage` skeleton row + sentinel / end-of-feed |
| Posting | optimistic prepend (no spinner); the composer's submit shows `isPending` |

The composer is **always** rendered above the states — a reader can post into an empty
thread. A just-posted comment appears instantly via the optimistic prepend, even before the
invalidated refetch returns.

---

## My bookmarks (deferred feed)

Mirrors the article feed exactly (`ArticlesGrid` + its `.Loading` / `.Error` / `.Empty` /
`.EndOfFeed`), the only differences being:

- **Auth boundary** — the `/bookmarks` route is Visitor-gated; a logged-out visitor is
  redirected to sign in, not shown an empty grid.
- **Empty copy** — "You haven't bookmarked anything yet" with a link to browse, distinct
  from the feed's "no articles yet".

---

## The auth-gate flow (shared)

Every gated write funnels through `useRequireAuth`:

1. User taps like / bookmark / rate / comment while logged out.
2. The auth modal opens; the pending action is captured.
3. On successful sign-in, the action resumes automatically.
4. On dismissal, nothing happens — no error, no partial state.

This is the same modal and flow used across the app; interactions don't add a bespoke
gating UI.
