# 23 — Testing Strategy

## The prerequisite nobody has paid for yet

**The frontend package has no test infrastructure.** No runner in `package.json` (dev deps are
Biome, Tailwind, TypeScript, lint-staged, and types — nothing else), no test script, and zero
`*.test.ts*` files anywhere in `src/` or `app/`. The only automated gates today are
`yarn lint:types` (`tsc --noEmit`) and `yarn lint:code` (Biome).

So this document has two audiences:

1. **If a runner is introduced** — this is what to cover and how.
2. **If it is not** — everything below marked ⚠️ becomes a manual verification checklist, run
   against [26](26-acceptance-criteria.md). Do not pretend it is automated.

Standing up a runner is a real cost (Vitest + Testing Library + jsdom, plus a Playwright project
for the e2e loop) and it is not this feature's job to decide it. It *is* this feature's job to say
what would be tested, so the cost of not testing is visible.

The recommendation: introduce Vitest for the **unit tier only** as part of Phase 1
([24](24-implementation-plan.md)). It is the cheapest tier to set up, it has no DOM or browser
dependency, and it covers the two things most likely to break silently — the mapper's derived
fields and the query-key factory.

## Unit — pure functions, no DOM

Highest value per unit of effort. All of these are pure and synchronous.

### `ArtistsMapper` ([18](18-domain-entities-and-mappers.md))

| Case | Assertion |
|---|---|
| `artistSummaryFromDto` full DTO | every field mapped, no field dropped |
| `avatarUrl` absent | maps to `null`, never `undefined` or `""` |
| `isVerified` absent (pre-Gap-2) | coalesces to `false`, never `undefined` |
| `contentCount` absent | coalesces to `0` |
| `artistSummaryListFromDto` | empty list → `[]`; order preserved |
| `artistPageFromDto` `hasNextPage` | true mid-list, **false on the exact last page** — the off-by-one that ships broken load-more |
| `availableLetters` absent | `null` |
| `availableLetters` empty array | `null` — the two collapse deliberately, and the rail treats it as "all enabled" |
| `artistDetailFromDto` totals | read from the pagination envelopes, **not** `items.length` |
| `visibleTabs` — every total non-zero | `["music", "videos", "news"]` in that fixed order |
| `visibleTabs` — music zero, videos non-zero | `["videos", …]`, and `defaultTab === "videos"` |
| `visibleTabs` — **only articles** | `["news"]`, `defaultTab === "news"` — **must not** be empty |
| `visibleTabs` — all zero | `[]` and `defaultTab === null` (the 404 condition) |
| `defaultTab` | always `visibleTabs[0]` |
| `bio` absent | `null`, not `""` — the hero omits the block entirely on `null` |
| `artistAlbumFromDto` | no id or slug on the output, `releaseYear` null-safe |

> **Corrected.** An earlier version of this table asserted a literal three-element array
> `["lyrics", "videos", "albums"]`. Those keys are retired ([07](07-artist-detail-tabs.md)); the
> model is **three tabs** — `music`, `videos`, `news` — and `albums` is a *section* inside `music`,
> not a tab. Any test still asserting the old array is asserting a rule that no longer
> exists.

The `visibleTabs` / `defaultTab` cases are the ones worth writing first: they encode two locked
product rules ([07](07-artist-detail-tabs.md), [01](01-overview.md)) in a place where a regression
is invisible in review.

### Tab visibility — assert the rule, not the array

Write these against **derivation**, not against a hardcoded list. Tab and section visibility is
spread across several gaps ([16](16-backend-gaps-and-contracts.md)); a test that pins the exact
array breaks every time a gap ships, which trains people to update the expectation without reading
it.

| Case | Assertion |
|---|---|
| Any tab with a zero total | absent from `visibleTabs` — hidden, never disabled |
| A tab whose gap has not shipped (total absent) | treated as zero, not as `undefined` — no tab, no crash |
| Exactly one non-zero total | `visibleTabs.length === 1`; the bar is not rendered at all |
| Order | always the fixed `music → videos → news`, never data-dependent |
| `isVerified` | has **no** effect on `visibleTabs` or `defaultTab` ([22](22-verified-artists-and-claiming.md)) |

### The 404 rule — an artist with only one surface

The highest-value single test in this document, because it guards a rule whose narrow form is still
the intuitive one ([01](01-overview.md), decision 4).

"Zero content" means zero across **all five surfaces** — songs, videos, albums, mixtapes, news. Not
"zero lyrics and zero videos".

| Fixture | Expected |
|---|---|
| News only, everything else empty | renders; `defaultTab === "news"`; **no 404** |
| One mixtape only | renders; `music` tab visible with only the Mixtapes section |
| One album only | renders; `music` tab visible with only the Albums section |
| Every surface empty | 404 |
| Bio and avatar present, all five surfaces empty | **still 404** — a bio is not content |

The last two rows are the pair that matters: an editorial stub with a nice bio and nothing else must
not become a crawlable dead page, while an artist whose only presence is a single mixtape must not
vanish.

**The same predicate must be tested on both sides.** The index's `contentCount` and the profile's
404 condition are the same definition ([16](16-backend-gaps-and-contracts.md) Gap 1). A test that
proves a tour-only artist renders, without also proving it is *listed*, allows the failure mode
where a listed artist 404s when clicked.

### Music sections — four sections, one tab

`music` is a panel of four stacked sections, so section visibility needs its own coverage
([08](08-catalog-sections.md)):

| Case | Assertion |
|---|---|
| Section with zero items | not rendered — no heading, no placeholder |
| `Populaires` with ≤ 10 songs total | **hidden**, even though songs exist — it would duplicate the list |
| `Populaires` with 11+ songs | rendered, capped at 10, no paging control |
| Albums vs mixtapes | split on the release type, never merged; `EP`/`Single` render in neither |
| Exactly one non-empty section | jump-bar omitted |
| Two or more non-empty sections | jump-bar rendered as `<nav>` of anchors, **not** `role="tab"` |
| Section anchors | stable English fragments (`#popular`, `#latest`, `#albums`, `#mixtapes`) |
| A section whose gap has not shipped | absent entirely — never "coming soon", never a disabled heading |

### Entities

Nothing to test directly — they are interfaces with no behaviour, which is the point of the
interface-only rule. They are covered transitively by the mapper tests, and structurally by `tsc`.

### `artistKeys` ([20](20-state-management-and-query-keys.md))

| Case | Assertion |
|---|---|
| `directory({})` vs `directory({ letter: "F" })` | different keys |
| `directory({ letter: "F" })` vs `directory({ letter: "F", search: undefined })` | **same** hash — undefined-vs-absent must not fork the cache |
| One key per surface — songs, albums, mixtapes, videos, news | mutually distinct, all prefixed by `detail(slug)` |
| `detail(slug)` as a prefix | `removeQueries({ queryKey: detail(slug) })` matches **every** surface key, not just the three original ones |
| page number | never appears in any key |

**Popular vs latest must be two cache entries.** Both are "this artist's songs"; they differ only
by sort, and a key factory that drops the sort makes them collide — the second one to load
overwrites the first, and the page renders the same list under two headings that claim different
orderings. That is a silent, plausible-looking wrong render, which is the worst kind.

| Case | Assertion |
|---|---|
| `songs(slug, { sort: "views" })` vs `songs(slug, { sort: "publishedAt" })` | **different** keys |
| Both | prefixed by `detail(slug)`, so one invalidation clears both |
| Fetching popular then latest | two requests, two cache entries, neither evicts the other |
| Rendering both sections | `Populaires` order ≠ `Récentes` order given a fixture where they diverge |
| `albums(slug, { type: "Album" })` vs `{ type: "Mixtape" }` | same rule — different keys, same prefix |

The album/mixtape pair is the identical trap one level down: one endpoint, one artist, two filters.

### Utils

Whatever lands in `presentation/utils/artist/artist.utils.ts` — count pluralisation inputs, the
initials derivation for the avatar fallback (multi-word names, single-word names, leading
punctuation, non-Latin scripts), and the URL-param parsers (unknown `tab`, `letter` out of range,
`page` non-numeric — all must degrade to the default, never throw, per
[05](05-alphabet-search-and-filters.md)).

## Component — ⚠️ needs a DOM runner

### `ArtistCard`

- Renders name, count, and avatar; the **whole card is one link** with exactly one tab stop.
- `avatarUrl: null` → initials fallback, no `<img>` request.
- `isVerified: false` → no badge in the DOM at all (not hidden with CSS).
- `isVerified: true` → badge present with an accessible label, and **not** a second tab stop.
- Long name truncates to one line while the badge stays visible.

### `AlphabetRail` ([05](05-alphabet-search-and-filters.md))

- Renders `Tous`, `#`, and 26 letters — 28 controls, always, regardless of data.
- Active letter carries `aria-current="true"`.
- `availableLetters: null` → every letter enabled (the documented degradation).
- `availableLetters: ["A","F"]` → the other 24 are **disabled, not removed**.
- Selecting a letter clears the search field and resets page to 1.

### `ArtistSearchField`

- No request under 2 characters.
- One request per 300ms debounce window, not per keystroke.
- Typing clears the active letter.
- Clearing returns to the unfiltered directory.

### `ArtistTabBar` — keyboard navigation ([07](07-artist-detail-tabs.md))

The highest-risk component in the feature, because ARIA tab patterns are subtly wrong by default.

| Input | Expected |
|---|---|
| `→` / `←` | move between tabs, wrapping |
| `Home` / `End` | first / last tab |
| `Tab` key | leaves the tablist entirely — roving tabindex, only the active tab is tabbable |
| tab activation | focus **stays on the tab**, never moves into the panel |
| one visible tab | no tab bar rendered at all |
| zero visible tabs | not reachable — the route 404s first |
| unknown `?tab=` value | falls back to the default tab, no error |
| tab switch | `router.replace`, never `push`; `page` resets to 1 |

Assert `role="tablist"` / `role="tab"` / `role="tabpanel"`, `aria-selected`, and the
`aria-controls` ↔ `aria-labelledby` pairing.

### `ArtistHero`

- Exactly one `<h1>` on the page.
- `bio: null` → no bio block, no placeholder copy.
- Zero-count stat omitted, not rendered as `0`.
- Bio toggle is a `<button>` with a correct `aria-expanded`.
- Stat-row entries activate the matching tab.

### `ArtistIdentityBlock` ([06](06-artist-detail-hero.md), Gap 7)

Every field is nullable and this block is the one place the page makes factual claims about a real
person, so **absence is the behaviour under test**. A label rendered beside an em-dash is the
failure mode, and it looks fine in a screenshot.

| Fixture | Expected |
|---|---|
| All four fields null / `aliases: []` | **no block at all** — not an empty container, not a heading |
| `realName` present, rest null | one row; no `Aussi connu`, `Né le`, or `Origine` label anywhere in the DOM |
| `aliases: []` | renders nothing — the empty array and `null` collapse to the same output |
| `aliases: ["Drizzy", "Champagne Papi"]` | middot-joined, wraps, no trailing separator |
| `realName` equal to the stage name | **suppressed** — the dedupe rule, case- and whitespace-insensitive |
| `birthdate` present | locale-formatted; the age is derived at render, never read from a field |
| `birthdate: "1986-10-24"` | renders 24 October in **every** timezone — assert with the runner's TZ forced to `Pacific/Auckland` **and** `America/Los_Angeles` |
| Any field null | no `—`, no "Non renseigné", no `aria-hidden` placeholder occupying the row |

The null cases are asserted with `queryBy…` returning `null` — assert the label is **absent from
the DOM**, not merely hidden with CSS.

### Social links row ([06](06-artist-detail-hero.md), Gap 8)

| Case | Expected |
|---|---|
| Zero links | the row is not rendered |
| One link | rendered; a one-icon row is legitimate |
| Unknown `platform` enum value | **skipped**, not rendered as a generic link — this is what makes adding a platform backend-first safe |
| Every link | icon-only with a per-platform accessible label (*"Instagram de Fally Ipupa"*), never a bare glyph |
| `rel` | `noopener noreferrer` — **no** `sponsored`, these are not commercial links |
| Non-`https` scheme in the data | refused at render, not passed through |


### States ([09](09-loading-empty-error.md))

Loading, error, empty-directory, filtered-to-empty-by-letter, and filtered-to-empty-by-search are
five different renders. The two filtered-empties must name the active filter and offer the escape
action.

## Integration / e2e — ⚠️ needs a browser runner

One flow matters more than all the others. From [08](08-catalog-sections.md):

```
lyrics detail ──artist name──> artist profile ──card──> another lyrics detail
```

That loop is the core value of the feature. Test it end to end, in both languages:

1. Open a lyrics detail page for an artist with a linked `ArtistEntity`.
2. Click the artist name → lands on `/artistes/{slug}`, correct `<h1>`, hero visible.
3. The default tab is the first non-empty one.
4. Click a lyrics card → a different lyrics detail page for the same artist.
5. Back → returns to the profile **on the same tab**, catalog still loaded, no refetch.

Secondary flows:

- `/artistes` → letter `F` → load-more → open a card → back → the accumulated list and letter
  survive (URL state, [05](05-alphabet-search-and-filters.md)).
- Deep link `/artistes/{slug}?tab=videos&page=2` renders the videos tab directly, server-side.
- Deep link `/artistes/{slug}?tab=music#albums` opens the music tab scrolled to the Albums section.
- A slug with **zero content across all five surfaces** returns 404 and is absent from `/artistes`
  ([01](01-overview.md), locked — and note this rule is not "no lyrics and no videos"). An
  album-only artist is the counter-case and must return 200 **and** be listed.
- An artist name on a lyrics page with **no** linked `ArtistEntity` renders as plain text with no
  link — the common case at launch.

## What to mock, and what not to

| Layer under test | Mock | Do not mock |
|---|---|---|
| Mapper | nothing — feed it DTO literals | — |
| Key factory | nothing | — |
| Repository impl | the generated `Api` client (assert the params it receives, and that a thrown error becomes `err(ProblemMapper.toFailure(...))`) | `ProblemMapper`, the mapper |
| Use cases | the repository port | — (they are one-line pass-throughs; a test here mostly asserts wiring) |
| Hooks | the cradle use case | TanStack Query itself — use a real `QueryClient` |
| Components | the hooks | Radix `Tabs`, `Avatar`, or any shared UI primitive |
| e2e | nothing in the app | — seed real backend fixtures |

Hard rules:

- **Never mock TanStack Query.** Caching, `getNextPageParam`, and `enabled` gating are exactly what
  the hook tests exist to verify. A mocked query client tests the mock.
- **Never mock Radix primitives.** The tab keyboard behaviour largely *comes from* Radix; mocking
  it deletes the thing under test.
- **Never mock the mapper in repository tests.** The repository's job is to call the client with
  the right params and hand the response to the mapper; asserting against real mapped entities
  catches DTO-shape drift after a regeneration.
- **Do not write tests against the generated client's shape.** It is regenerated; `tsc` is the
  correct gate for that drift.
- **No dummy-data fallbacks in the artists module.** `useArticlesFeed` falls back to dummy articles
  on an empty feed; the artists hooks deliberately do not ([20](20-state-management-and-query-keys.md)).
  Empty is a real, tested state.

## i18n and a11y checks

- The `en` and `fr` catalogs must have identical key shapes — a cheap structural test, worth
  writing even in a unit-only setup.
- Count labels pluralise correctly in both languages (`1 chanson` / `12 chansons`).
- No English string reaches a French render, and no tab key (`music`/`videos`/`news`) is ever
  localised — they are URL values ([07](07-artist-detail-tabs.md)). The same applies to the
  music-section anchors (`#popular`/`#latest`/`#albums`/`#mixtapes`). The retired keys `lyrics`,
  `albums`, `merch` and `tour` must not appear as tab values anywhere.
- A section's heading must match its actual sort key — `Populaires` only over a `sort=views`
  request, `Dernières` only over a date-ordered one ([08](08-catalog-sections.md)).
- Axe pass on both routes; specifically the tablist, the alphabet rail's disabled controls, and the
  badge's accessible name.

Detail lives in [11](11-accessibility-and-responsive.md) and [12](12-i18n.md).

## Backend

Out of scope for this document. The public artist list endpoint's coverage — the published-content
filter, accent-insensitive ordering and bucketing, and above all a query-count assertion proving
`contentCount` is not N+1 ([21](21-performance-and-pagination.md)) — belongs in the backend spec in
`apps/backend/docs/`, per [16](16-backend-gaps-and-contracts.md).
