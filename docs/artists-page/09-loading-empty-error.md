# 09 — Loading, Empty & Error States

Every state that isn't "content rendered". Both routes.

> **Scope history.** Written against three tabs (lyrics / videos / albums), rewritten for an
> expanded scope that added merch, tour and featured credits, and now back to **three tabs over
> five content surfaces** after all three were cut ([07](07-artist-detail-tabs.md),
> [08](08-catalog-sections.md)). The skeletons, the empty-state inventory and — most importantly —
> the 404 rule are all stated below against the current scope.

## Principles

1. **A failure is scoped to the region that failed.** A tab that errors does not blank the hero.
   A letter that returns nothing does not replace the alphabet rail with an error page.
2. **Skeletons match the real layout.** Same grid columns, same card aspect, same count as the
   page size — a skeleton that resolves into a differently-shaped grid is a layout shift with
   extra steps.
3. **Empty is not an error.** Empty states explain and offer an escape; error states offer a retry.
   They never share copy.
4. **`EmptyState` is the shell for all of them.** `shared/presentation/components/ui/EmptyState`
   already backs every "nothing here" surface in the app (including today's `/artistes`
   coming-soon page). `FeedError` is the retry-shaped wrapper around it. Neither is re-implemented
   here.

`EmptyState` defaults to `min-h-[70vh]`, which is right for a whole route and wrong inside a tab
panel. Region-scoped uses pass `className="min-h-[40vh]"`.

---

## Index route — `/artistes`

| State | Component | Copy key |
|---|---|---|
| First load | `ArtistGrid.Loading` — 30 card skeletons in the real grid | — |
| Load-more pending | `LoadMoreFooter` button: spinner + `disabled`, grid untouched | `artists.actions.loadingMore` |
| End of list | `LoadMoreFooter` terminus line, replaces the button | `artists.states.endOfList` |
| Directory empty (no filter) | `EmptyState` | `artists.states.emptyDirectory.title` / `.body` |
| Letter empty | `EmptyState` + "see all artists" action | `artists.states.emptyLetter.title` / `.body` |
| Search empty | `EmptyState` + "clear search" action | `artists.states.emptySearch.title` / `.body` |
| First-page error | `FeedError` with retry | `artists.states.error.title` / `artists.actions.retry` |
| Load-more error | inline retry under the grid; loaded cards stay | `artists.states.pageError` / `artists.actions.retry` |

### Skeleton

30 skeleton cards — one full page ([04](04-artists-index-page.md)) — in the *same* grid
(2/3/4/5/6 columns). Each is a circle + two bars, matching the card's avatar / name / count stack.

Rendering fewer (say 8) and letting the grid grow on resolve produces a visible jump on desktop,
where 8 cards fill barely one row of a six-column grid. The cost of 30 pulsing divs is nil; the
cost of the jump is a CLS hit on the page's largest region.

The alphabet rail and search input render immediately, **not** as skeletons — the rail is a fixed
27-item set that needs no data to draw, and disabling letters is a later refinement on top of
`availableLetters` ([16](16-backend-gaps-and-contracts.md)). A skeletonised rail flickers on every
filter change for no informational gain.

### Load-more pending — the button *is* the indicator

Per [04](04-artists-index-page.md), the paging control doubles as the loading indicator: spinner
inside the button, `disabled` while in flight, `aria-busy="true"`.

This deliberately differs from the favorites surface
([`../favorites-page/21-loading-empty-error.md`](../favorites-page/21-loading-empty-error.md)),
which appends skeleton rows. Appending skeletons is right for an auto-loading sentinel, where
nothing else signals the fetch. Here the user pressed a button and is looking at it; the feedback
belongs where the attention already is, and appended skeletons would push that button off-screen
mid-press.

### Empty directory vs filtered-to-empty

Three distinct states, never one generic "no results":

- **Empty directory** — no artists at all. Only reachable before any artist has published content.
  Copy states the directory is being built, no action button (there is nowhere useful to send them).
- **Letter empty** — copy names the letter, action returns to `Tous`.
- **Search empty** — copy names the query, action clears the input.

The two filtered variants and their copy are specified in
[05](05-alphabet-search-and-filters.md#empty-results); this doc only assigns them components and
keys. With `availableLetters` shipped, *letter empty* becomes unreachable through the rail (the
letter is disabled) but stays reachable by hand-typed URL, so it is not deleted.

---

## Profile route — `/artistes/{slug}`

| State | Component | Copy key |
|---|---|---|
| Route load | `ArtistHero.Loading` + `ArtistTabs.Loading` | — |
| Tab panel first load | `<Tab>Section.Loading` — card skeletons in the tab's grid | — |
| `Musique` section first load | per-section `.Loading` — each of the four sections loads independently ([07](07-artist-detail-tabs.md)) | — |
| Tab load-more pending | `LoadMoreFooter`, as the index | `artists.actions.loadingMore` |
| Tab end of list | terminus line | `artists.states.endOfTab` |
| Tab empty | **never rendered** — the tab is hidden ([07](07-artist-detail-tabs.md)) | — |
| Section empty inside `Musique` | **never rendered** — no heading, no placeholder ([08](08-catalog-sections.md)) | — |
| Tab fetch error | region-scoped `FeedError`, hero intact | `artists.states.tabError` / `artists.actions.retry` |
| Section fetch error inside `Musique` | region-scoped `FeedError` **inside that section only** | `artists.states.sectionError` / `artists.actions.retry` |
| Unknown slug | `not-found.tsx` | `artists.states.notFound.title` / `.body` |
| Zero surfaceable content | `not-found.tsx` — same 404 | same |

### Hero skeleton

Mirrors [06](06-artist-detail-hero.md) exactly: a 160px (desktop) / 112px (mobile) circle, one
wide name bar, two bio bars, one short stat bar — laid out horizontally at `md+` and stacked below.

The hero grew two optional regions ([06](06-artist-detail-hero.md)), and **neither is skeletonised**:

- **Identity block** — real name, aliases, birthdate, hometown are each independently nullable, so
  the block's height is unknowable before the data arrives. A four-row skeleton that resolves into
  one row (or into nothing) is a bigger layout shift than no skeleton at all. Reserve nothing.
- **Social links row** — same argument, plus it is a single 32px row. Drawing six placeholder
  circles for an artist with one link, or with none, invents a shape the page will not have.

This is a deliberate exception to principle 2: skeletons match the real layout **when the layout is
knowable**. For a variable-height optional block, the honest skeleton is absence.

Because the hero and the initial tab arrive in **one payload** ([07](07-artist-detail-tabs.md)),
this skeleton is only ever seen on client-side navigation into the route; the server-rendered
entry paints content directly. It is still required — Next's `loading.tsx` boundary uses it, and
without it a soft navigation shows the previous page frozen.

### Tab panel skeleton

Owned by each tab section, not by the tab bar. Column counts and item counts come straight from the
grid table in [08](08-catalog-sections.md) — one skeleton shape per surface:

| Skeleton | Count | Grid | Card shape |
|---|---|---|---|
| Chansons populaires | 10 | 1/2/2/2/2 | compact row: rank slot + thumb + two bars |
| Dernières chansons | 20 | 2/3/4/5/5 | vertical song card |
| Albums / Mixtapes | 12 | 2/3/4/5/6 | square cover + name bar + year bar |
| Vidéos | 12 | 1/2/2/3/4 | 16:9 thumb + two bars |
| Actualités | 12 | 1/2/2/3/3 | reuses the articles module's own card skeleton ([10](10-components-and-reuse.md)) |

One note: **the rank slot in the Populaires skeleton is drawn.** It is a fixed-width numeral column
([08](08-catalog-sections.md)); omitting it shifts every row horizontally on resolve.

The tab **bar** never skeletonises on switch. It is already rendered and its labels are already
known — replacing it would make the control the user just pressed disappear.

### `Musique` loads section by section

Each of the four sections is its own request with its own key ([07](07-artist-detail-tabs.md)), so
the panel does **not** have a single loading state:

- Sections resolve independently and in any order; each renders its own skeleton in place.
- A section whose gap has not shipped is not requested at all and renders nothing.
- **A failed section degrades to a scoped `FeedError` inside its own `<h2>` block.** One failed
  section must never blank the panel or hide its four healthy siblings.
- **The jump-bar renders once the section set is known**, not per section — its entries are derived
  from which sections have content, and a jump-bar whose links appear one by one is a moving target.
  Until then it is absent, not skeletonised. It is omitted entirely at ≤ 2 sections.

### Empty tabs are hidden, not empty — with no carve-outs

[07](07-artist-detail-tabs.md) locks the rule: a tab with zero items is not rendered, and the same
applies one level down to each `Musique` section. This feature therefore has **no** section-level
empty state to design, and none should be built "just in case" — an unreachable empty state is dead
code that will drift.

> Two carve-outs used to live here, both belonging to merch (all items sold out) and tour
> (past dates but none upcoming). Both surfaces were cut from v1 ([01](01-overview.md)), and the
> rule is unconditional again. If either ever returns, the carve-outs return with them: a section
> with content that is *currently unavailable* is not an empty section.

The one edge that remains: a tab whose total is non-zero but whose first page comes back
empty (a stale total, or content unpublished between the count and the fetch). Treat it as the tab
error state, not as an empty state — the totals and the items disagree, which is a fault, not a
fact about the artist.

### The 404s

Two causes, one response — `notFound()` from **both** the page and `generateMetadata`:

| Cause | Detection |
|---|---|
| Slug matches no artist | endpoint 404 |
| Artist exists with zero content across **all five surfaces** | every total zero |

> **Corrected.** This doc previously said an artist "with zero published lyrics *and* videos"
> 404s. That was written when the profile held three content types.
> [01](01-overview.md) decision 4 governs: **"content" means *any* of the five surfaces** — songs,
> videos, albums, mixtapes, or news. An artist with only albums is a real
> destination and **must not 404**.

The rule the correction preserves is still locked in [01](01-overview.md): unclaimed staff-curated
stubs must not become crawlable dead pages. Only the definition of "stub" widened.

Two consequences that must not drift apart:

- **The index's `contentCount` and this 404 rule must use the same definition** ([01](01-overview.md)).
  If the endpoint counts lyrics + videos while the profile 404s on six totals — or vice versa —
  a listed artist 404s when clicked, which is the worst outcome available here.
- [16](16-backend-gaps-and-contracts.md) makes this one shared `HasSurfaceableContent` predicate
  precisely so the two cannot drift. It legitimately reduces to `COUNT(lyrics) + COUNT(videos)`
  today because Gaps 3, 4 and 5 have not shipped. **Each of those gaps owns extending the predicate**, in
  the same change that adds its section — not afterwards.

Enforcement is **client-adjacent, not client-only** — the endpoint should reject the request, and
the frontend re-checks the totals so a lagging backend never renders a tab-less, contentless
profile. The frontend check must sum *all* surface totals present in the payload, not a hardcoded
two, or it will re-introduce the bug this correction removes.

Calling `notFound()` inside `generateMetadata` as well matters: a 404 page that carries the
artist's real name in `<title>` tells a crawler the page exists. Same rule as the video route
([`../video-detail/16-seo-and-metadata.md`](../video-detail/16-seo-and-metadata.md)).

`not-found.tsx` renders an `EmptyState` with the not-found copy and a link to `/artistes`.

### Partial failure — hero up, tab down

The realistic partial-failure shape is **wide**, because only two of the five surfaces ride along
with the hero: `Récentes` and `Vidéos` are in the profile payload
([07](07-artist-detail-tabs.md)); everything else fetches separately. It occurs when:

- a **`Musique` section other than `Récentes`** loads — Populaires, Albums, Mixtapes and
  each fetch on their own key and can each fail alone, or
- the **`Actualités`** tab is opened — it is never in the profile payload, or
- a **second** tab is opened and its on-demand fetch fails, or
- a **load-more** inside any tab fails.

In all of them the hero, the tab bar, and every already-loaded tab stay interactive. A section
failure is scoped to its own `<h2>` block, so four healthy sections still render around it — the
`Musique` panel has no all-or-nothing state. The failure renders with a retry that re-runs only that
section's or tab's query. Switching away and back
must not clear the error silently — the retry is the only thing that resets it, otherwise a user
"fixes" it by tab-switching and gets a stale-looking empty panel.

The inverse — hero fails, tabs succeed — cannot happen: no hero means no artist means 404.

---

## Announcing changes

Appending results changes the page without moving focus, which is invisible to a screen-reader
user. A polite live region announces the new total after each append
(`artists.a11y.resultsAnnounce`), and the same region announces the filtered count when a letter
or query is applied. Focus rules are in [11](11-accessibility-and-responsive.md).

## Note — one copy dependency worth flagging

`artists.states.emptyDirectory.*` is the only state here with no useful action button. If product
later wants one, the honest target is the homepage, not a "browse artists" link back to the page
the user is already on.
