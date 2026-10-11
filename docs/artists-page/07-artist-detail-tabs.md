# 07 — Artist Detail Tabs

> **Scope history.** This doc first described three tabs (lyrics / videos / albums), was rewritten
> for an expanded scope that added merch and tour, and is now back to three tabs — `Musique`,
> `Vidéos`, `Actualités` — after merch and tour were cut ([01](01-overview.md)). The tab *count*
> coincidentally matches the first version; the model does not. `Musique` is now a stack of five
> sections rather than a single lyrics list.

## The problem this doc solves

The profile must surface six sections across five content types: popular songs, latest songs,
albums, mixtapes, videos, and news. Six flat tabs do not fit on a 360px
screen — at a realistic 11–14 characters per French label (`Populaires`, `Mixtapes`, `Actualités`)
a flat bar is roughly 600–800px of label text. Something has to give.

## Decision — three primary tabs, sections inside `Musique`

```
┌──────────────────────────────────────────────────────────────┐
│  Musique │ Vidéos │ Actualités                               │
├──────────────────────────────────────────────────────────────┤
│  panel                                                        │
└──────────────────────────────────────────────────────────────┘
```

| Tab | Key | Contains | Backend |
|---|---|---|---|
| **Musique** | `music` | Populaires → Récentes → Albums → Mixtapes | ✅ / Gap 3, 4 |
| **Vidéos** | `videos` | Videos where the artist is the primary credit | ✅ |
| **Actualités** | `news` | Articles tagged to the artist | ❌ Gap 5 |

Gap numbers refer to [16](16-backend-gaps-and-contracts.md). Section-by-section detail in
[08](08-catalog-sections.md).

### Why not six flat tabs

1. **Four of the six are the same content type.** Popular songs, latest songs, albums and mixtapes
   are all *songs by this artist, sliced differently*. A tab bar is a switch between **kinds** of
   things; using it to switch between **sorts** of one thing teaches the user nothing and makes
   them click four times to see one discography.
2. **The slices are individually thin.** A typical artist has 12 songs, 2 albums, 0 mixtapes and 1
   0 mixtapes. Three of those four tabs would be hidden by the empty-tab rule anyway, so the
   flat model collapses to a different shape for every artist — the page has no stable skeleton.
3. **The comparison is the value.** Seeing "popular" directly above "latest" is how a reader
   calibrates an artist they don't know. Tabs hide that comparison behind an interaction.
4. **Scroll beats click for related content.** A single scrollable `Musique` panel is one gesture;
   four tabs are four decisions.

### Why not nested tabs inside `Musique`

Rejected explicitly. A `tablist` inside a `tabpanel` is legal ARIA and a usability trap: arrow keys
become ambiguous, the roving tabindex nests, and `?tab=music&sub=albums` doubles the URL state for
no navigational gain. **The sub-slices are stacked sections, not sub-tabs.**

`Musique` renders as a vertical stack with `<h2>` per section:

```
Musique
  ├─ Chansons populaires        (top 10, then "Voir plus")
  ├─ Dernières chansons         (paginated, the main list)
  ├─ Albums                     (grid, no detail page)
  ├─ Mixtapes                   (same card, separate heading)
```

A **section jump-bar** sits at the top of the panel — a row of in-page anchor links
(`#populaires`, `#albums`, …), not tabs. It is `<nav aria-label="Sections">` with plain anchors,
scroll-linked highlighting is optional, and it is skipped entirely when the panel has ≤ 2 sections.
Anchors are stable English fragments (`#popular`, `#latest`, `#albums`, `#mixtapes`)
for the same reason tab keys are.

## Overflow behaviour on mobile

Three tabs fit at 360px in both `fr` and `en`, so the overflow path is **defensive, not routine**.
It still has to exist: labels are translated, and a longer locale or a future fourth tab would
overflow silently. The bar is a **horizontally scrollable tablist**, never wrapped, never
collapsed into a "More" menu.

- `overflow-x: auto`, `scroll-snap-type: x proximity`, snap-align on each tab.
- Hidden scrollbar; a **right-edge gradient fade** while more tabs remain, removed at the end — the
  affordance that tells the user there is more.
- The **active tab is scrolled into view on mount** (`scrollIntoView({ inline: 'center' })`), so
  deep-linking to `?tab=news` never lands on a bar that appears to show only `Musique`.
- Touch scrolling only; no arrow buttons. Two 44px hit targets to reveal two more tabs is a bad
  trade on the narrowest screens.
- Tabs never wrap to a second line. A two-line tab bar changes the page's vertical rhythm per
  artist and pushes content below the fold.

**A "More ▾" overflow menu was rejected.** It hides tabs behind a second interaction, breaks the
roving-tabindex arrow-key contract (an item can be in the tablist but not visible), and puts
whichever tab happens to be last permanently out of sight. Scrolling keeps every tab in one list,
in DOM order, reachable by arrow keys regardless of visibility.

At `md+` all three tabs fit comfortably; the bar is a normal flex row with no scroll affordance.

## Default tab

The first tab **with content**, not blindly `Musique`.

Resolution order: `music → videos → news`, first non-empty wins. Determined server-side from the
totals in the payload, so there is no flash of an empty tab.

Ordering rationale: music is why this feature exists, videos second, and news last because it is
the only tab whose content is *about* the artist rather than *by* them.

If every tab is empty the profile 404s ([01](01-overview.md)) and no tab bar renders at all.

## Empty and hidden tabs

**A tab with zero items is hidden, not disabled.** Load-bearing: `Actualités` is behind an unbuilt
gap and most artists have no tagged articles, so a great many profiles render one or two tabs.

This differs deliberately from the alphabet rail ([05](05-alphabet-search-and-filters.md)), where
letters are disabled-not-hidden:

- The alphabet is a **fixed, known set** — a missing letter reads as a bug, and its absence is
  information ("no artists start with Q").
- Tabs are a **variable set per artist** — an artist with no tagged articles simply has no news
  section, and a permanently dead tab is clutter that never resolves.

The same rule applies one level down: an **empty section inside `Musique` is not rendered**, and
if `Musique` has exactly one non-empty section the jump-bar is omitted.

With exactly one tab, **render no tab bar at all** — a single tab is not a choice, and the bar
would be pure chrome.

## URL addressing

```
/artistes/fally-ipupa                     default tab
/artistes/fally-ipupa?tab=videos          explicit tab
/artistes/fally-ipupa?tab=videos&page=2   paged within a tab
/artistes/fally-ipupa?tab=music#albums    tab + section anchor
```

Rules:

- `tab` accepts `music` | `videos` | `news`. These are **stable English keys**, never localised —
  a URL must not change meaning with the user's language.
- The keys `lyrics`, `albums`, `merch` and `tour` are **retired** — the first two from the original
  three-tab model, the last two with the merch/tour scope cut. Nothing shipped any of them, so no
  redirect is owed; they fall through to the unknown-tab rule below. If they ever appeared in a
  share, `lyrics → music`, `albums → music#albums`, and `merch`/`tour` → the default tab.
- An unknown or empty-for-this-artist `tab` falls back to the default tab rather than erroring.
- Switching tabs **resets `page` to 1**. It also drops any section anchor.
- Tab switches use `router.replace`. Tab switching is view state, not navigation; `push` would make
  Back cycle tabs instead of leaving the page — a well-known trap.
- Section anchors within `Musique` are plain fragment links and *do* enter history, because they are
  in-page navigation the user expects Back to undo.

## Interaction & accessibility

Follow the ARIA tabs pattern:

- `role="tablist"` on the bar, `role="tab"` per control, `role="tabpanel"` on the panel.
- `aria-selected` on the active tab; `aria-controls` / `aria-labelledby` pairing.
- Arrow keys move between tabs, `Home`/`End` jump to first/last; only the active tab is in the tab
  order (roving tabindex). When arrowing to a tab that is scrolled out of view horizontally, the
  bar scrolls it into view — a focused-but-invisible tab is a WCAG 2.4.11 failure.
- On switch, focus stays on the tab. Do not move focus into the panel — it strands screen-reader
  users mid-list.
- The `Musique` jump-bar is **not** part of the tabs pattern: it is a `<nav>` of anchors, each a
  normal link in the tab order. Do not give it `role="tab"`.
- Section headings inside a panel are `<h2>`; the artist name in the hero is the only `<h1>`
  ([06](06-artist-detail-hero.md)).

The tab bar is **sticky at `md+`** so the user can switch after scrolling a long catalog. Not
sticky on mobile, where it would consume scarce vertical space — and where the bar is already
horizontally scrollable, so a sticky version would pin a scrollable strip to the viewport edge.

## Rendering & data

Each tab is **independently paginated and independently fetched**.

- The initial tab's first page is server-rendered with the profile — it is in the same payload for
  `music` (latest songs) and `videos`.
- Switching to a not-yet-loaded tab fetches on demand.
- Loaded tabs stay cached; switching back is instant and does not refetch.
- Each tab owns its own query key and its own accumulated pages — see
  [20](20-state-management-and-query-keys.md).

Inside `Musique`, each section is its **own request with its own key**, not one mega-payload:

| Section | Request |
|---|---|
| Populaires | `sort=views`, page size 10, no paging |
| Récentes | `sort=publishedAt`, paginated — comes free in the profile payload |
| Albums | artist-scoped album query, `type=Album` — Gap 3 + 4 |
| Mixtapes | same query, `type=Mixtape` — Gap 3 + 4 |

They are separate because they land at different times: `Récentes` ships today, `Populaires` ships
as soon as the sort param is wired, and the rest wait on migrations. A single combined endpoint
would make the whole panel block on the slowest gap.

Consequently each section renders its own loading and error state and **degrades to not rendering**
([09](09-loading-empty-error.md)). One failed section must never blank the panel.

## Section composition inside a panel

Every panel follows: optional preview → titled full list with count → load-more. Detail, ordering,
grids and page sizes in [08](08-catalog-sections.md).

**Correction:** an earlier version of this doc said preview grids must be named
"Dernières/Latest, never Top or Populaires" because we had no ranking. That constraint is lifted —
`LyricsEntity` carries `ViewCount`/`LikeCount`/`ShareCount` and `GET /public/lyrics` already
supports `sort=views|likes|shares`, so "Chansons populaires" is an honest label backed by real
data ([02](02-inspiration-benchmark.md)). The underlying rule survives in stricter form: **a
section's label must match its actual sort key.**

The `> 10 items` preview threshold still applies to paginated sections — below it, the preview *is*
the list, duplicated.
