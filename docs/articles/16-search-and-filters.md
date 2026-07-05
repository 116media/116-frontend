# Search & Filters

Between the promoted feed and the grid sits a **filter region** that scopes the
infinite feed by full-text search, category, and tag. All three are **server-side**
filters on `GET /api/v1/public/articles` — the frontend never filters in memory.

---

## What the backend supports

| Filter | Param | Cardinality | Source of options |
| --- | --- | --- | --- |
| Search | `search` | free text | — |
| Category | `categoryId` | **single** | `GET /categories?contentTypeId=<Article>` (active categories) |
| Tag | `tagSlug` | **single** | `GET /tags` (all) + `GET /tags/popular` (strip) |

Constraints (see [15-open-questions.md](15-open-questions.md)):
- **One category and one tag at a time** — the list endpoint takes a single `categoryId`
  and a single `tagSlug`. Multi-select would need a backend change.
- **No per-tag article count** — `TagDto` is `{ id, name, slug }`; no "(42)" badge
  without a backend addition.
- No sort / date-range / author filter on this endpoint.

All three combine (AND) and feed `useArticlesFeed({ search, categoryId, tagSlug })`;
the query key includes the filters, so **any change resets the infinite feed to page 0**
and re-pages the filtered results.

---

## Layout

```text
┌─ promoted feed (reused) ────────────────────────────────────────────┐
└─────────────────────────────────────────────────────────────────────┘

┌─ ArticlesToolbar ───────────────────────────────────────────────────┐
│  [ Category ▾ ]                        [ 🔍  Search articles…    ✕ ] │   ← row 1
│  #music  #culture  #interviews  #film   →          [ All tags ▾ ]    │   ← row 2 (tag strip)
└─────────────────────────────────────────────────────────────────────┘

┌─ ArticlesGrid (infinite) ───────────────────────────────────────────┐
│  card   card   card   card                                          │
└─────────────────────────────────────────────────────────────────────┘
```

- **Row 1** — category dropdown on the **left**, search on the **right**
  (`justify-between`).
- **Row 2** — the **tag pill strip**: a horizontally scrollable row of popular tags,
  ending in an **"All tags"** trigger that opens a searchable popover with every tag.
- A **"Clear filters"** control appears in the toolbar whenever any filter is active.

### Responsive

- **Desktop / tablet (`sm`+):** as above — dropdown left, search right, tag strip below.
- **Mobile:** search goes **full-width on top**; the category dropdown sits below it;
  the tag strip stays horizontally scrollable underneath. (No layout that hides filters
  behind a modal for the first cut — everything stays inline and thumb-reachable.)

---

## Category dropdown (left)

- A compact **select** (built on the shared dropdown/`Select` pattern) labelled
  `Category` with a default **"All categories"** option, then every **active** category
  from `useArticleCategories()` (which wraps the existing `getArticleCategories`).
- Selecting a category sets `categoryId`; "All categories" clears it.
- Single-select (radio semantics) — matches the backend.

## Search input (right)

- The shared `Input` with a leading `SearchIcon` and a trailing **clear (✕)** button
  when non-empty.
- **Debounced ~300ms** before it updates the `search` filter, so paging doesn't refire
  on every keystroke. (Alternative: search-on-Enter — see the open choice in the spec.)
- Shows a **"Results for '…'"** affordance and, when a filtered feed is empty, the
  filtered empty state (see [13-loading-empty-error.md](13-loading-empty-error.md)).

## Tag strip + "All tags" popover (row 2)

The chosen pattern (**pill strip + searchable popover**), because there can be many
tags and the filter is single-select:

- **Inline strip** — the popular tags (`useArticlePopularTags`, the existing use case)
  rendered as **`Tag` pills** in a horizontally scrollable row (with edge fade on
  overflow). Quick access to the tags people actually use.
- **"All tags" trigger** — opens a **popover** listing **every** tag, with a search box
  at the top wired to `GET /tags?search=` (`useAllTags(search)`, a new use case) so a
  visitor can find any tag by typing. Selecting one closes the popover and applies it.
- **Selection is single** — the active tag is highlighted (`Tag variant="primary"`),
  others are `variant="outline"`. Clicking the active tag (or its ✕) clears it. Only one
  tag is ever active, mirroring `tagSlug`.
- The active tag, if it isn't in the popular strip, is **pinned to the front** of the
  strip so the current filter is always visible.

---

## Filter state & flow

A single client-side filter object drives everything:

```text
ArticlesFeedContainer
├── search      (debounced)     ─┐
├── categoryId  (dropdown)       ├─► filters ─► useArticlesFeed(filters)
└── tagSlug     (tag strip)     ─┘                 │
                                                    └─ articleKeys.feed(filters)  → resets to page 0
```

- The container owns `filters` state; the toolbar is controlled (value + onChange per
  filter).
- Changing any filter updates the key → TanStack starts a fresh infinite query; the
  observer/sentinel keeps working unchanged.
- **Clear filters** resets all three to empty → the full feed.

Data sources, all already present or a thin addition:

| Need | Hook / use case | Status |
| --- | --- | --- |
| Active categories | `useArticleCategories` → `getArticleCategories` | exists |
| Popular tags (strip) | `useArticlePopularTags` → `getArticlePopularTags` | exists |
| All tags (popover, searchable) | `useAllTags` → **`getAllTags`** | **new** (thin) |
| Filtered feed | `useArticlesFeed(filters)` | exists |

Implementation is specced in
[specs/08-search-and-filters.md](specs/08-search-and-filters.md).
