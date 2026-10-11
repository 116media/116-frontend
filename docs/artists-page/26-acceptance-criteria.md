# 26 — Acceptance Criteria

Done means this. Every criterion is objectively verifiable — by clicking, by reading the URL bar,
by counting requests in the network panel, or by a test. Nothing here is satisfied by a document.

Criteria are grouped by area, not by phase. [24](24-implementation-plan.md) says which phase each
belongs to; a criterion referring to an unshipped gap is checked when that gap ships, not waived.

---

## Locked decisions ([01](01-overview.md))

These are non-negotiable and are listed first because they are the ones most likely to erode
quietly during implementation.

- [ ] The index route is `/artistes` and the profile route is `/artistes/{slug}`. Neither is
  renamed to `/artists`.
- [ ] Both routes use the existing `ARTISTES_PATH` / `ARTISTE_DETAIL_PATH` constants. No third
  path constant was added.
- [ ] Profiles are addressed by **slug**. No artist id appears in any URL, and no artist id is
  present in any response the client consumes.
- [ ] An artist with zero items across **all five surfaces** — songs, videos, albums, mixtapes,
  news — **404s** on `/artistes/{slug}`.

  > **Corrected.** This criterion previously read "zero published lyrics pages and zero published
  > videos". That is too narrow ([01](01-overview.md), decision 4): an artist whose only presence
  > is one mixtape is a real destination and must render.

- [ ] An artist with **only news**, or only one album, or only one mixtape, **renders** — 200, with
  that section or tab as the default. It does not 404.
- [ ] A profile with a bio and an avatar but zero items on every surface **still 404s**. A bio is
  not content.
- [ ] A 404ing artist is **absent from `/artistes`** at every letter and every search term, and
  **absent from the sitemap**.
- [ ] `contentCount` on the index and the profile's 404 predicate use the **same definition**. No
  listed artist 404s when clicked, and no rendering artist is unlisted.
- [ ] Tabs are URL-addressable: `?tab=videos` renders the videos tab on a cold server load.
- [ ] The **index** is ordered alphabetically ascending, always. No control anywhere sorts the
  directory by popularity, recency, or content count.
- [ ] Ranking exists on the **profile** and only there: `Chansons populaires` sorts by `ViewCount`.
  It does not leak to the directory, and `isVerified` is not an input to any ordering anywhere
  ([22](22-verified-artists-and-claiming.md)).
- [ ] The profile ships before the index — verified by the fact that Phase 1 shipped with
  `/artistes` still showing the coming-soon placeholder.
- [ ] A claimed and verified artist gets a badge and **no** editing capability. No profile-edit
  affordance exists anywhere in the public app.

---

## Index page ([04](04-artists-index-page.md), [05](05-alphabet-search-and-filters.md))

### Grid and cards

- [ ] The grid renders 2 / 3 / 4 / 5 / 6 columns at `<640` / `640–768` / `768–1024` / `1024–1280` /
  `≥1280`.
- [ ] Page size is 30.
- [ ] Each card is a **single link** with exactly one tab stop. No inner button, no second
  focusable element.
- [ ] The name truncates to one line; rows stay uniform height with mixed name lengths.
- [ ] The content count renders under the name, pluralised and translated.
- [ ] An artist with no avatar shows the initials fallback — no broken image, no repeated generic
  silhouette, no network request.
- [ ] No information is hover-only.

### Alphabet rail

- [ ] The rail renders `Tous`, `#`, and A–Z — 28 controls, always, regardless of data.
- [ ] The rail's length never changes as data loads.
- [ ] The active letter is visually distinct **and** carries `aria-current="true"`.
- [ ] With `availableLetters` present, letters with no artists are **disabled, not hidden**.
- [ ] With `availableLetters` absent, all letters are enabled and clicking an empty one shows the
  filtered-empty state rather than an error ([25](25-open-questions.md) Q4).
- [ ] `#` returns artists whose name starts with a digit or symbol.
- [ ] `Élodie` appears under `E`, not after `Z`, and not under a separate bucket.

### Search

- [ ] Search matches artist **name** only; a bio-only match does not appear.
- [ ] No request fires below 2 characters.
- [ ] Requests are debounced at 300ms — typing "fally" fires one request, not five.
- [ ] `gola` matches `Ferré Gola` (substring, accent- and case-insensitive).
- [ ] Clearing the input returns to the unfiltered directory.

### URL state

- [ ] `?letter=F`, `?q=gola`, and `?page=2` each render correctly on a cold server load.
- [ ] `letter` and `q` are never both active: typing clears the letter, picking a letter clears the
  query.
- [ ] Changing `letter` or `q` resets `page` to 1.
- [ ] Filter and page changes use `router.replace` — after ten keystrokes, one Back press leaves the
  page.
- [ ] Unknown or malformed param values are ignored, never error.

### Paging and counts

- [ ] Paging is an explicit "load more" button that appends. There is no auto-fetch on scroll.
- [ ] The button shows a spinner and is disabled while fetching, and is replaced by an end-of-list
  message when exhausted — with no layout shift on either transition.
- [ ] Appending a page does not move the scroll position.
- [ ] The header count reflects the **currently filtered** set and comes from the response total,
  not from the loaded item count.

---

## Profile page ([06](06-artist-detail-hero.md))

- [ ] The hero renders avatar, name, optional bio, and the stat row.
- [ ] Exactly one `<h1>` exists on the page, containing the artist name.
- [ ] The name wraps; it never truncates.
- [ ] The avatar is 160px at `md+` and 112px below, `1:1`, `rounded-full`, with the same initials
  fallback as the index card (the same component).
- [ ] A null bio renders **nothing** — no heading, no "no bio available" placeholder.
- [ ] The bio clamps to 2 lines on mobile / 3 on desktop with a real `<button>` toggle carrying a
  correct `aria-expanded`.
- [ ] Bio content renders as plain text; HTML in the field is displayed, not executed.
- [ ] The stat row omits zero-count entries rather than showing `0`.
- [ ] Each stat is a link that activates the matching tab.
- [ ] Numbers are locale-formatted (`1 234` in `fr`).
- [ ] The hero is not sticky.
- [ ] No cover/banner image and no share button appears ([06](06-artist-detail-hero.md)).

  > **Corrected.** This criterion previously also forbade real name, aliases, hometown and social
  > links. Those are now **in scope** ([01](01-overview.md), [16](16-backend-gaps-and-contracts.md)
  > Gaps 7 and 8) and are covered by the two blocks below. Only the cover image and the share
  > button remain deliberate omissions.

### Identity block ([06](06-artist-detail-hero.md), Gap 7)

- [ ] An artist with no identity data renders **no block at all** — not an empty container, not a
  heading.
- [ ] Each of real name, aliases, birthdate and hometown is **absent from the DOM** when null —
  never a label beside an em-dash, a `—`, or a "Non renseigné".
- [ ] An empty `aliases` array renders exactly what `null` renders: nothing.
- [ ] Aliases are middot-joined, wrap, and carry no trailing separator.
- [ ] The real name is **suppressed** when it equals the stage name.
- [ ] A birthdate of `1986-10-24` renders as 24 October in **every** timezone — verified with the
  browser TZ set east and west of UTC.
- [ ] The age is derived at render, never read from a stored field.
- [ ] No value is inferred from a bio, a label, or a name to fill an empty field.
- [ ] No public source attribution or "last verified" date is rendered
  ([22](22-verified-artists-and-claiming.md)).

### Social links ([06](06-artist-detail-hero.md), Gap 8)

- [ ] The row renders only when at least one link exists; one icon is a legitimate row.
- [ ] Each link is icon-only with a per-platform accessible label ("Instagram de Fally Ipupa") —
  never a bare glyph.
- [ ] An unknown `platform` value is **skipped**, not rendered as a generic link.
- [ ] Links carry `target="_blank"` + `rel="noopener noreferrer"` and an external affordance.
  They do **not** carry `sponsored` — these are not commercial links.
- [ ] A non-`https` URL is not rendered as a link.

---

## Tabs and catalog ([07](07-artist-detail-tabs.md), [08](08-catalog-sections.md))

> **Corrected.** The criteria in this section previously asserted the tab keys
> `lyrics` | `videos` | `albums` and a "never Top or Popular" rule. Both are wrong: the model is
> **three tabs with four sections inside `Musique`** ([07](07-artist-detail-tabs.md)), and
> popularity ranking is real and honest ([08](08-catalog-sections.md)).

### Tab model

- [ ] Tab keys in the URL are `music` | `videos` | `news`, identical in both
  languages. The retired keys `lyrics` and `albums` appear nowhere as tab values.
- [ ] The default tab is the first **non-empty** tab in `music → videos → news`
  order, resolved server-side — there is no flash of an empty panel.
- [ ] A tab with zero items is **hidden**, not disabled.
- [ ] With exactly one visible tab, no tab bar renders at all.
- [ ] An unknown or empty-for-this-artist `?tab=` value falls back to the default tab without an
  error.
- [ ] Switching tabs resets `page` to 1, drops any section anchor, and uses `replace` — Back leaves
  the page rather than cycling tabs.
- [ ] The tab bar is sticky at `md+` and not sticky below.
- [ ] Below `md` the bar scrolls horizontally, never wraps to a second line, never collapses into a
  "More" menu, and shows a right-edge fade while more tabs remain.
- [ ] Deep-linking to `?tab=tour` scrolls the active tab into view on mount.
- [ ] Each tab paginates independently: paging songs to page 3 leaves the videos tab at page 1.
- [ ] Returning to an already-loaded tab issues **zero** network requests.

### `Musique` — four stacked sections

- [ ] `Musique` renders as a vertical stack in the order Populaires → Récentes → Albums →
  Mixtapes, each with its own `<h2>`. There are **no nested tabs**.
- [ ] The jump-bar is a `<nav aria-label="Sections">` of plain anchors — no `role="tab"` — and is
  omitted when the panel has ≤ 2 non-empty sections.
- [ ] Section anchors are the stable English fragments `#popular`, `#latest`, `#albums` and
  `#mixtapes`, and are never localised.
- [ ] `?tab=music#albums` resolves both the tab and the anchor.
- [ ] An empty section renders **nothing** — no heading, no placeholder, no "coming soon".
- [ ] A section whose backend gap has not shipped does not exist in the DOM.
- [ ] One failing section renders its own error and does **not** blank the panel.
- [ ] Each section is its own request with its own query key — there is no single mega-payload.

### Ordering and ranking

- [ ] `Chansons populaires` is ordered by `ViewCount` descending with `publishedAt` as the
  tie-break, and is capped at 10 with no paging control.
- [ ] `Populaires` and `Récentes` render in **different orders** for an artist whose view counts and
  publish dates diverge — and occupy **distinct cache entries**.
- [ ] `Populaires` is **hidden** when the artist has 10 or fewer songs.
- [ ] Rank numbers `1.`–`10.` are `aria-hidden`; the ordering is carried by an `<ol>`, and no
  accessible name contains "Number 1".
- [ ] `Dernières chansons`, `Vidéos` and `Actualités` are ordered by `publishedAt` descending.
- [ ] Albums and mixtapes are ordered by `releaseYear` descending, then `name` ascending.
- [ ] Every list on the page is descending; there is no ascending order anywhere.
- [ ] **A section's heading matches its actual sort key.** "Populaires" appears only over a
  view-ordered request; "Dernières" only over a date-ordered one.

  > **Corrected.** The old criterion read *"the preview heading reads 'Latest'/'Dernières' — never
  > 'Top' or 'Popular'"*, on the premise that we had no ranking signal. We do
  > ([08](08-catalog-sections.md)). The label-matches-sort rule replaces it and is stricter: it
  > forbids a *mismatched* label in either direction, not a particular word.

### Cards and sizes

- [ ] Song sections render the existing `LyricsCard` with `showArtist={false}`. No artist-specific
  card exists.
- [ ] Video sections render the existing `VideoCard`; `Actualités` renders the existing
  `ArticleCard`. Neither is rebuilt.
- [ ] Albums and mixtapes are **two headings using the same `ReleaseCard`** — not a filter chip, not a
  card variant. `EP` and `Single` render under neither.
- [ ] Album and mixtape cards are static tiles: no link, no pointer cursor, no hover-lift, no focus
  ring, not in the tab order.
- [ ] Article cards **do** link out to the article detail page.
- [ ] Page sizes: Populaires 10 fixed, Récentes 20, Albums 12, Mixtapes 12, Vidéos 12,
  Actualités 12.
- [ ] Grid columns match the per-section table in [08](08-catalog-sections.md) at all five
  breakpoints.
- [ ] Preview grids render only when a section has **more than 10** items, show 4 (songs, articles)
  or 3 (videos), and use the same card at the same size. Populaires, Albums and Mixtapes never get
  a preview.
- [ ] Every paginated section's heading count equals the pagination total, and matches the hero stat
  for that surface exactly. Non-paginated sections show no count.

---

## Accessibility ([11](11-accessibility-and-responsive.md))

- [ ] The tab bar implements the ARIA tabs pattern: `role="tablist"` / `role="tab"` /
  `role="tabpanel"`, `aria-selected`, and paired `aria-controls` / `aria-labelledby`.
- [ ] Arrow keys move between tabs; `Home`/`End` jump to first/last; only the active tab is in the
  tab order.
- [ ] Activating a tab leaves focus on the tab — focus never jumps into the panel.
- [ ] Arrowing to a horizontally scrolled-out tab scrolls it into view — a focused-but-invisible tab
  is a WCAG 2.4.11 failure.
- [ ] The `Musique` jump-bar is a `<nav>` of ordinary links in the tab order, and carries no
  `role="tab"`.
- [ ] Section headings inside a panel are `<h2>`; the artist name is the only `<h1>`.
- [ ] The verified badge has an accessible label ("Artiste vérifié"), is not a bare glyph, and adds
  no tab stop on the card.
- [ ] The badge's meaning is available without hover.
- [ ] Disabled alphabet letters are announced as disabled, not merely styled grey.
- [ ] Every interactive element has a visible focus ring.
- [ ] Colour is never the sole carrier of state (active letter, verified badge, disabled letter).
- [ ] Axe reports no violations on `/artistes` and `/artistes/{slug}`.
- [ ] The whole feature is operable by keyboard alone, including load-more and tab switching.

---

## Internationalisation ([12](12-i18n.md))

- [ ] The `en` and `fr` catalogs have identical key shapes.
- [ ] No hardcoded user-facing string exists in any artists component.
- [ ] Content counts pluralise correctly in both languages (`1 chanson` / `12 chansons`).
- [ ] Numbers use locale formatting.
- [ ] Tab keys, section anchors, letter values, and query params are **not** translated.
- [ ] Currency renders with the seller's currency code and the active UI locale — `25 000 FC` in
  `fr`, `CDF 25,000` in `en`, the same amount in both.
- [ ] The two `artistes.comingSoon.*` keys are removed when the index ships.
- [ ] Both routes render fully in both languages with no English leaking into `fr`.

---

## SEO ([13](13-seo-and-metadata.md))

- [ ] Both routes are server-rendered and indexable; neither is auth-gated or `noindex`.
- [ ] `generateMetadata` and the page render share **one** backend call per request (React `cache`).
- [ ] The profile emits valid `MusicGroup` JSON-LD containing the artist name.
- [ ] The profile declares a canonical `/artistes/{slug}`.
- [ ] Open Graph and Twitter cards use the avatar when present and omit image entries when absent —
  never a broken share preview.
- [ ] Every listed artist appears in the sitemap; **no zero-content artist does**.
- [ ] Filtered index URLs (`?letter=`, `?q=`, `?page=`) do not generate duplicate indexable
  variants of the same content.

---

## Performance ([21](21-performance-and-pagination.md))

- [ ] **`contentCount` is not N+1**: the query count for `GET /public/artists` is unchanged when
  `pageSize` doubles from 30 to 60. This is the single most important criterion in the feature.
- [ ] `LyricsEntity.ArtistId` and `VideoEntity.ArtistId` are indexed for the published-content join.
- [ ] p95 server response for `GET /public/artists` page 1 unfiltered is under 300ms.
- [ ] `availableLetters` does not repeat the published-content join on every page request.
- [ ] LCP under 2.5s (p75, mobile) on both routes.
- [ ] CLS under 0.1 on both routes.
- [ ] `priority` is set on exactly one image per page — the hero avatar — and on no card image.
- [ ] Every `next/image` carries a `sizes` string matching that surface's column breakpoints.
- [ ] Landing on a profile issues one request; switching to a loaded tab issues zero.
- [ ] Page-size constants live in `artistKeys.ts` and the server-rendered first page uses the same
  values as client pages — no duplicated or skipped item at a page boundary.

---

## Architecture ([17](17-frontend-module.md)–[20](20-state-management-and-query-keys.md))

- [ ] `116.api.ts` is regenerated, never hand-edited.
- [ ] Only `artists.repository.impl.ts` imports the generated client. No DTO type appears in any
  component, hook, or container.
- [ ] Every repository method returns `Result<T>` and every catch returns
  `err(ProblemMapper.toFailure(error))`.
- [ ] Domain entities are interfaces with no methods. `isVerified`, `hasNextPage`, `visibleTabs`,
  and `defaultTab` are all mapper-computed properties.
- [ ] Every mapper function with a list form has an `xxxListFromDto` sibling, and no call site
  writes `.map(ArtistsMapper.x)`.
- [ ] `page` never appears in a query key.
- [ ] Containers live in `presentation/containers/`; components are bucketed by kind and every
  component folder holds one component with no nested folders.
- [ ] Use cases are registered in `artists.dependencies.ts` and typed in the `Cradle`.
- [ ] The i18n bundle is registered in `shared/presentation/i18n/resources.ts`.
- [ ] No dummy-data fallback exists in any artists hook — empty is a real, rendered state.
- [ ] `tsc --noEmit` and `biome check` are clean.

---

## States ([09](09-loading-empty-error.md))

- [ ] Loading, error, and empty are distinct renders on the index and inside every tab panel.
- [ ] An empty directory, a letter with no artists, and a search with no matches are **three
  different** renders.
- [ ] Filtered-empty copy names the active filter and offers the escape ("Voir tous les artistes" /
  "Effacer la recherche").
- [ ] An error state offers a retry and does not blank the already-loaded pages.

---

## End-to-end

- [ ] **The loop works**: lyrics detail → artist name → profile → lyrics card → another lyrics
  detail, in both languages.
- [ ] A lyrics page whose artist has no linked `ArtistEntity` renders the name as plain text with
  no link and no error.
- [ ] Back from a profile returns to the index with the accumulated pages and active letter intact.
- [ ] Back from a lyrics page returns to the profile on the same tab with the catalog still loaded.
- [ ] `/artistes/{slug}?tab=videos&page=2` opens directly to that state.

Checkboxes are completed after verification, not after implementation.
