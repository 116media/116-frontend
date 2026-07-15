# Content Interactions — Design & Implementation Docs

Design and implementation documentation for the web frontend's **content-interaction
features** — the ways a reader engages with content: **likes**, **comments**,
**bookmarks**, **shares**, and **ratings**. These behaviours are cross-cutting: they
attach to article and video surfaces (feed cards, detail pages, sidebars) rather than
living on a page of their own.

These docs mirror the structure of [`../article-detail/`](../article-detail/): numbered
design docs (the *why* and the *what*), a `specs/` folder of implementation-ready,
JSDoc'd, checklist-tracked specs (the *how*), and a locked set of decisions.

This is **documentation only** — no code is written into the codebase from these files.
The `specs/` snippets are the contract an implementer copies from.

---

## The feature at a glance

An interaction is a small, high-frequency action layered onto a piece of content. Five
kinds exist, and **not every kind applies to every content type** — the backend contract
decides that (see [02-support-matrix.md](02-support-matrix.md)):

1. **Like / Unlike** — a per-user toggle with a live count. Articles and short videos
   only; full videos have no like ([05-likes.md](05-likes.md)).
2. **Comment** — post, list (paginated), reply (one level), edit / delete own,
   like a comment. Articles only ([06-comments.md](06-comments.md)).
3. **Bookmark / Unbookmark** — a per-user toggle plus a "my bookmarks" list. Articles
   and short videos ([07-bookmarks.md](07-bookmarks.md)).
4. **Share** — records a share event (anonymous allowed) and bumps a running count.
   Articles, full videos, short videos ([08-shares.md](08-shares.md)).
5. **Rating** — one 1–5 star rating per user, upserted, feeding an aggregate average.
   Full videos only ([09-ratings.md](09-ratings.md)).

The unifying frontend concern is **optimistic UI**: a like flips instantly and rolls
back on failure, a comment appears at the top of the list before the server confirms.
That pattern is centralized in the shared `useToggle` hook
([10-state-management-and-hooks.md](10-state-management-and-hooks.md)).

---

## Where interactions surface

| Surface | Interactions shown |
|---|---|
| Article feed / promotion cards | like · comment · bookmark counts (`ArticleCard.Engagement`) |
| Article detail page | like · comment · bookmark (live, actionable) + share rail + comment thread |
| Video feed cards | share count · rating (`VideoCard.ShareCount`, `VideoCard.Rating`) |
| Video detail page | rating modal · share modal · scoreboard (rating + YouTube-derived stats) |
| "My bookmarks" (deferred) | paginated list of the user's bookmarked articles |

---

## Design docs

| File | What it covers |
|---|---|
| [01-overview.md](01-overview.md) | Goals, scope, the five interactions, decisions locked |
| [02-support-matrix.md](02-support-matrix.md) | Content-type × interaction support (the key reference table) |
| [03-backend-api-reference.md](03-backend-api-reference.md) | Every public endpoint, auth, rate limit, request/response shape |
| [04-domain-entities-and-mappers.md](04-domain-entities-and-mappers.md) | Per-user flags + counts on read DTOs, comment entities, mappers |
| [05-likes.md](05-likes.md) | Like / unlike toggle: articles (live), the video gap, comment likes |
| [06-comments.md](06-comments.md) | Post / list / reply / edit / delete / like — current cut vs. deferred |
| [07-bookmarks.md](07-bookmarks.md) | Bookmark toggle + the "my bookmarks" list |
| [08-shares.md](08-shares.md) | Share event recording, the missing platform param, Web Share API |
| [09-ratings.md](09-ratings.md) | Star rating upsert, the missing `myRating` readback |
| [10-state-management-and-hooks.md](10-state-management-and-hooks.md) | Hooks, query keys, the optimistic `useToggle` pattern |
| [11-loading-empty-error.md](11-loading-empty-error.md) | Skeletons, empty threads, retryable errors, auth-gate flow |
| [12-i18n-and-notifications.md](12-i18n-and-notifications.md) | Interaction strings + notification configs (en/fr) |
| [13-implementation-plan.md](13-implementation-plan.md) | Phased build order and verification checklists |
| [14-open-questions.md](14-open-questions.md) | Decisions locked, backend gaps, assumptions |
| [15-counting-anonymous-actions.md](15-counting-anonymous-actions.md) | How anonymous shares & views are counted, dedup, YouTube's model |

---

## Specs

Implementation-ready, in [specs/](specs/) — start at [specs/00-index.md](specs/00-index.md).

---

## Reference material

The backend contract lives in `apps/backend`
(`Content/Application/Interactions` submodule). The mobile app
(`apps/mobile`) is the closest reference for the full comment thread (reply, edit,
delete) that the web has only partially shipped. Articles are the reference
implementation the video surfaces mirror where the backend supports it.
