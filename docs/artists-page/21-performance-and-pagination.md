# 21 — Performance & Pagination

> **Corrected.** An earlier version claimed the profile route serves everything in one request —
> *"profile + default tab's first page in one payload"*. Across five surfaces that is **not true**
> and is corrected below. The 🔴 `contentCount` N+1 warning is unchanged and still the headline
> risk.

## The headline risk

**`contentCount` is the single biggest performance risk in this feature.** Flagged 🔴 in
[16](16-backend-gaps-and-contracts.md) Gap 1a, restated here because it is a frontend-visible
failure even though the fix is entirely backend.

The index renders 30 artists, each showing "12 chansons". That count is
`COUNT(published lyrics) + COUNT(published videos)` **per artist**. Written naively — a count query
per row, or a lazy navigation property in a projection loop — one page of `/artistes` issues
**61 queries**: one for the page, sixty for the counts. Load-more makes it 61 more, every press.

The same join also decides *which* artists appear at all (the "≥1 published item" filter,
[04](04-artists-index-page.md)), so it is not optional and cannot be dropped to make the page fast.

### What "good" looks like

- **One statement.** The page query, the published-content filter, and the per-row count are the
  same `GROUP BY`/lateral join. No second round trip, ever.
- **Query count independent of page size.** Doubling `pageSize` to 60 must not change the number
  of queries. This is the acceptance test — it is objectively checkable and it is in
  [26](26-acceptance-criteria.md).
- **Indexed.** `LyricsEntity.ArtistId` and `VideoEntity.ArtistId` are nullable FKs; both need an
  index covering `(ArtistId, Status/PublishedAt)` or the join scans two content tables per request.
- **Budget: p95 under 300ms server-side** for `GET /public/artists` at page 1 with no filter.
  Beyond that the directory is the slowest route on the site, which for a page with 30 names and
  30 avatars is indefensible.

### What "bad" looks like, and how it will present

If it ships N+1, the symptom is not a broken page — it is a page that takes 2–4 seconds to respond
and gets slower as the artist catalog grows. It will be blamed on the frontend, on Next.js, on the
image pipeline. It will be none of those.

**Frontend mitigation available: none.** The count is per row and the client holds one page. There
is no batching, caching, or deferral the frontend can apply that does not either show wrong numbers
or hide the count entirely — and the count is the card's primary signal
([04](04-artists-index-page.md)). This must be right on the server.

### The one adjacent risk

`availableLetters` (Gap 1b) is a `SELECT DISTINCT` over the *same filtered set*. Computed carelessly
it repeats the entire published-content join a second time on every page request. It returns at
most 27 values and changes only when an artist gains their first published item — cache it
server-side and return it from cache, or return it only for `pageIndex === 0` and let the client
hold it ([20](20-state-management-and-query-keys.md) reads it from the first page only).

## Page sizes

Locked upstream; restated because they are performance parameters as well as layout ones.

| Surface | Size | Locked in | Rationale |
|---|:---:|---|---|
| `/artistes` grid | **30** | [04](04-artists-index-page.md) | divisible by 2/3/5/6 — the grid's column counts — so the last row is rarely ragged |
| Chansons populaires | **10**, fixed | [08](08-catalog-sections.md) | not a page size — the section never pages, and is hidden entirely below 11 songs |
| Dernières chansons | **20** | [08](08-catalog-sections.md) | cards are small and dense |
| Albums / Mixtapes | **12** | [08](08-catalog-sections.md) | realistically one page per artist; the parameter exists so a large discography is not truncated |
| Vidéos | **12** | [08](08-catalog-sections.md) | 16:9 thumbnails are visually and byte-wise heavier |
| Actualités | **12** | [08](08-catalog-sections.md) | article cards carry an excerpt and a cover |

They live in `artistKeys.ts` as constants ([20](20-state-management-and-query-keys.md)) so the
server-rendered first page and every client page use the same value. A mismatch there produces
duplicate or skipped items at the page boundary — a bug that only appears on page 2 and is
miserable to find.

## Paging mechanics

"Load more" button, appending — not infinite scroll ([04](04-artists-index-page.md), and the same
control inside every **paginated** section per [08](08-catalog-sections.md)). Populaires is the one
section with no control at all — it is a fixed top-10. Albums and Mixtapes keep the control but
will almost never render it: one page of 12 is the whole set for nearly every artist.

Note this **diverges from the existing article and video feeds**, which auto-fetch via an
`IntersectionObserver` sentinel (`useIntersectionObserver` + `INFINITE_SCROLL_SENTINEL_OPTIONS`).
The design docs chose an explicit control for a directory; honour that. The substrate is unchanged
— still `useInfiniteQuery`, still `InfiniteScrollFooter` for the exhausted/loading footer, just
driven by a click instead of a sentinel.

Consequences worth budgeting for:

- Deep paging is bounded by patience. Nobody presses "load more" 40 times, so the DOM stays small
  and no list virtualisation is needed at any realistic catalog size.
- The button is the loading indicator: disabled + spinner while fetching, replaced by the
  end-of-list message when exhausted ([09](09-loading-empty-error.md)). No layout shift on either
  transition — reserve its height.
- Appended pages must not shift the scroll position. New rows render below the fold; the button
  stays where the finger was.

## Images

`next/image` everywhere. Avatars are the whole visual payload of this feature.

| Surface | Size | `priority` | `sizes` |
|---|---|:---:|---|
| Hero avatar | 160px desktop / 112px mobile | ✅ **yes** | `(max-width: 768px) 112px, 160px` |
| Index card avatar | fills the card's square | ❌ | `(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw` |
| Song cards | existing `LyricsCard` | ❌ | unchanged — the card owns its `sizes` |
| Video cards | existing `VideoCard` | ❌ | unchanged |
| Article cards | existing `ArticleCard` | ❌ | unchanged |
| Album / mixtape cover | square tile | ❌ | `(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw` |
| Article cover | existing `ArticleCard` | ❌ | unchanged |

- **`priority` appears exactly once per page, on the hero avatar**, because it is the LCP element
  on the profile route ([06](06-artist-detail-hero.md)). Never on a card. Thirty prioritised images
  is thirty un-prioritised images.
- **Release covers are the only new image budget line**, and a modest one. Every other image on
  this page is either an avatar (small, often a zero-byte initials fallback) or an existing card's
  thumbnail sized by a component we already ship. Covers are `loading="lazy"`, never `priority`,
  and `object-cover` on a fixed square doubles as a bandwidth rule: `next/image` never has to serve
  an arbitrary aspect ratio at full width.
- The index `sizes` string tracks [04](04-artists-index-page.md)'s 2/3/4/5/6 column breakpoints
  exactly. If the column counts change, this string changes with them — a stale `sizes` silently
  downloads 4× the necessary pixels.
- Avatars are `1:1` and `rounded-full`; declare width/height so the grid never shifts.
- **The initials fallback is not an image.** `AvatarFallback` renders text on a token-derived
  background, so a missing `avatarUrl` costs zero bytes and zero requests. Given most staff-curated
  artists have no avatar, the median index page will be very light — the fallback is a performance
  feature as much as a design one.
- No LQIP/blur placeholders: avatars are small and the fallback already covers the empty case.

## LCP and route budgets

| Route | LCP element | Target (p75, mobile) |
|---|---|---|
| `/artistes` | first row of avatars (or text, when they are all fallbacks) | **< 2.5s** |
| `/artistes/{slug}` | hero avatar | **< 2.5s** |

Supporting budgets:

- **CLS < 0.1.** The three shifting risks are: the alphabet rail changing length as data arrives —
  prevented, letters are disabled not hidden ([05](05-alphabet-search-and-filters.md)); the
  load-more button swapping to an end-of-list message — prevented by reserving its height; and the
  bio expand toggle — user-initiated, so excluded.
- **INP < 200ms.** Letter clicks and tab switches are cache reads plus a `router.replace`. The only
  interaction that can block is a search keystroke, which is debounced 300ms and gated at 2
  characters.
- **No JS needed for first paint.** Both routes are server components; the hero, the identity block,
  the socials row, the grid's first page and — *when the default tab is `music` or `videos`* — that
  tab's first list are all in the initial HTML.

  **Correction:** the earlier version said "the default tab's first page" without qualification.
  Only Récentes and Vidéos are in the profile payload. When the default tab resolves to `news` —
  which happens for an artist who has articles but no songs or videos — the first paint is hero
  plus a loading state, and the LCP element is the hero avatar rather than any content. That is
  acceptable because the hero is the LCP element on this route regardless, but it does mean the
  < 2.5s target is carried by the hero, not by the panel.

## Request budget per navigation

| Navigation | Requests |
|---|:---:|
| Land on `/artistes` | 1 (directory page 1; `availableLetters` rides along) |
| Press load-more | 1 |
| Click a letter | 1, or 0 if that letter's pages are still cached |
| Type a search | 1 per debounce window, never per keystroke |
| Land on `/artistes/{slug}` | **1 server-side**, then 0–1 on hydration — see below |
| Scroll `Musique` past Récentes | 1 per section as it enters view (Albums, Mixtapes) |
| Switch to an unloaded tab | 1 |
| Switch back to a loaded tab | **0** |
| Page within a tab or section | 1 |

### What is in the initial payload, and what is not

**Correction:** the earlier version of this table read *"Land on `/artistes/{slug}` — 1: profile +
default tab's first page in one payload"*. When songs, videos and albums were the whole profile
that was true. Across five surfaces it is not, and pretending otherwise would mean a single endpoint
that blocks on the slowest unbuilt gap ([07](07-artist-detail-tabs.md) rejects exactly that).

| In the initial `GET /public/artists/{slug}` payload | Fetched on demand |
|---|---|
| Identity: name, slug, bio, avatar, `isVerified` | Chansons populaires (`sort=views`) |
| Identity block: real name, aliases, birthdate, hometown | Albums, Mixtapes |
| Social links | Actualités |
| **Every surface total** — needed for the stat row, tab visibility and default-tab resolution ([14](14-data-requirements.md)) | |
| Dernières chansons, page 1 | |
| Vidéos, page 1 | |

The totals stay in the initial payload and are **not** deferred, even though they cover surfaces
whose data is not. A total is one `COUNT`; without it the server cannot resolve the default tab and
the user gets a flash of the wrong panel — which is a worse trade than the counts cost.

So the honest budget for a profile landing is **one server-side request, plus one client request
per section that is visible and not seeded**:

- Default tab `music`, artist with songs only → **0** extra. Récentes is seeded.
- Default tab `music`, artist with songs, albums and mixtapes → **1** immediately (Populaires),
  then one each for Albums and Mixtapes as they scroll into view. Sections below the fold are
  visibility-gated precisely so this is not three parallel requests on load
  ([20](20-state-management-and-query-keys.md)).
- Default tab `news` → **1** extra. Nothing about articles is in the payload.

The zero-request tab switch is still the design's payoff and is still worth protecting: it depends
on the tab queries staying cached ([20](20-state-management-and-query-keys.md)) and on the two
seeded lists not being refetched on mount.

One caveat carried over from [19](19-repository-usecases-and-di.md): paging Récentes or Vidéos
currently re-calls the profile endpoint with the other catalog's page size zeroed, so each of those
page-loads also re-reads the artist row. Bounded and acceptable for v1; the fix is dedicated
per-section endpoints, which the sections behind Gaps 3, 4 and 5 get from the start.
