# 24 — Implementation Plan

> **Rebuilt for the expanded scope.** The previous version of this doc was built on one claim:
> that the profile page is *"~90% ready"* and *"ships first, frontend-only, no backend work
> required"*, with everything else deferred to an optional Phase 4. **That claim is now false and
> is corrected here.** It was true when the profile meant *hero + lyrics + videos*. The profile now
> spans **five surfaces** ([01](01-overview.md)) touching **eight gaps**
> ([16](16-backend-gaps-and-contracts.md)), and only two of those surfaces have a query path today.
> The phase graph below replaces the old one entirely. A later pass added merch, tour and
> featured-on phases; all three were cut with their surfaces and are gone rather than deferred.
>
> Two specific errors are corrected rather than quietly dropped:
>
> - The old Phase 4a said albums need *"the `AlbumEntity.ArtistId` migration + backfill"*.
>   **`AlbumEntity.ArtistId` already exists** ([15](15-backend-current-state.md)). Gap 3 is a
>   repository method and an endpoint — **no migration**.
> - The old Phase 4b numbered the video→artist field as "Gap 4". It is **Gap 6**; Gap 4 is the
>   release-type discriminator.

## The shape of this plan

The old plan had one asymmetry to organise around. This one has three facts.

**1. The profile is no longer frontend-only.** Of the five surfaces, exactly two are servable
today:

| Surface | Servable today | Gap | What kind of work |
|---|:---:|:---:|---|
| Hero (name, bio, avatar, totals) | ✅ | — | none |
| Verified badge | ❌ | 2 | DTO + mapper |
| **Popular songs** | ✅ | **none** | `sort=views` already ships |
| **Latest songs** | ✅ | — | already in the profile payload |
| **Videos** | ✅ | — | already in the profile payload |
| Albums | ❌ | 3 | repository + endpoint, **no migration** |
| Mixtapes | ❌ | 3 + 4 | one column + admin surface + backfill decision |
| News | ❌ | 6 | join table + tagging + **editorial** backfill |
| Identity block | ❌ | 10 | four nullable columns + admin fields |
| Social links | ❌ | 11 | child table + enum |
| Video → artist link | ❌ | 9 | DTO field |

**2. Every surface hides independently.** A tab with no data is not rendered; a section whose gap
has not shipped does not exist — no placeholder, no "coming soon", no disabled control
([07](07-artist-detail-tabs.md), [08](08-catalog-sections.md)). This is the single property that
makes the plan survivable: **slipping a phase never blocks the page, it only makes the page
smaller.**

**3. The index is still fully blocked.** Unchanged from the old plan and the one thing it got
right: `/artistes` has no endpoint, and no amount of frontend work creates one.

### Phase graph

```
Phase 0 ─┬─> Phase 1  hero + songs + videos ─┬─> Phase 2  albums + mixtapes
         │      (Gap 2, degradable)          │
         │                                   ├─> Phase 4  identity + socials
         │                                   └─> Phase 5  news
         │
         └─────────────────────────> Phase 3  the index page
                                        ▲
                             Gap 1 + 1a–1c (backend, start now)
```

Read it as: **Phase 1 is the only hard prerequisite.** Phases 2, 4 and 5 all hang off it, are
independent of each other, and can land in any order or not at all. Phase 3 depends on Phase 1 for
the module and on the backend for the endpoint.

The order 2 → 3 → 4 → 5 below is a **recommendation ranked by value per unit of cost**, not a
dependency chain. The only sequencing rules that are real:

- Nothing starts before Phase 0 exits.
- Nothing starts before Phase 1 exits.
- Phase 3 additionally waits on the backend endpoint.

### What "done" does not mean

**There is no single ship date for "the artist page".** Phase 5 is a separate project that happens
to render on this route — its cost is editorial, not engineering. Treating the whole plan as one
ticket is how this feature becomes a blocked epic instead of a page that gets better every few
weeks.

---

## Phase 0 — Prerequisites

Neither item is artist-page work. Both are discovered late if they are not confronted first.

**Dependencies:** none.

1. **There is no `lyrics` frontend module.** `src/modules/lyrics/` is not in the repo — it is
   specified in [`../lyrics-page/specs/02`](../lyrics-page/specs/02-domain-entities-and-mapper.md)
   and [`03`](../lyrics-page/specs/03-repository-usecases-and-di.md) and unbuilt. The profile's song
   sections need `ILyricsPage`, `LyricsMapper`, and above all `LyricsCard`
   ([18](18-domain-entities-and-mappers.md), [08](08-catalog-sections.md)). **This is a hard blocker
   on Phase 1** and the single most likely thing to be discovered late.

   Two acceptable resolutions, one unacceptable: either the lyrics feature ships first, or this
   feature builds `LyricsCard` **inside the lyrics module** so that module stays its owner.
   Building an artist-page-local song card is not an option — it forks a component two features
   need ([10](10-components-and-reuse.md)).

2. **There is no test runner.** No runner in `package.json`, no test script, zero `*.test.ts*`
   files ([23](23-testing-strategy.md)). Decide before Phase 1, not during: Vitest for the unit
   tier, or an explicit, recorded decision to verify manually against
   [26](26-acceptance-criteria.md). The recommendation is the unit tier only — it is the cheapest
   to stand up and it covers the two things that break silently, the mapper's derived fields and
   the query-key factory.

**Exit criteria**

- [ ] The lyrics module is merged and `LyricsCard` accepts `showArtist` and a compact/row variant.
- [ ] The testing decision is recorded, either way.

**If it slips:** everything slips. This is the only phase with no degraded mode — there is no
version of the profile that renders songs without a song card.

---

## Phase 1 — Profile skeleton: hero + songs + videos

The page exists after this phase. Not the whole page — the page.

**Dependencies:** Phase 0.

**Backend needed: Gap 2 only, and it is degradable.** Popular songs needs **nothing** —
`LyricsEntity` already carries `ViewCount`, and `GET /public/lyrics` already supports
`sort=views|likes|shares` ([16](16-backend-gaps-and-contracts.md)). This is the correction that
matters most to the schedule: the ranked section, the one that makes the profile feel alive rather
than archival, is free.

### Work

| # | Item | Doc |
|---|---|---|
| 1.1 | Domain entities — `IArtistSummaryEntity`, `IArtistDetailEntity`, `IArtistPage` | [18](18-domain-entities-and-mappers.md) |
| 1.2 | `ArtistsMapper` including `visibleTabs` / `defaultTab` over the **five-tab** model | [18](18-domain-entities-and-mappers.md), [07](07-artist-detail-tabs.md) |
| 1.3 | Port + impl: `getArtistBySlug`, `getArtistSongs` (both sorts), `getArtistVideos` | [19](19-repository-usecases-and-di.md) |
| 1.4 | Use cases + `artists.dependencies.ts` + `service.locator.ts` registration | [19](19-repository-usecases-and-di.md) |
| 1.5 | `artistKeys.ts` — **sort is part of the songs key**, or popular and latest collide | [20](20-state-management-and-query-keys.md), [23](23-testing-strategy.md) |
| 1.6 | Hooks: `useArtistProfile`, `useArtistPopularSongs`, `useArtistLatestSongs`, `useArtistVideos` | [20](20-state-management-and-query-keys.md) |
| 1.7 | `ArtistHero`, `ArtistBio`, `ArtistTabBar` (5 keys), `ArtistCatalogSection` | [06](06-artist-detail-hero.md), [07](07-artist-detail-tabs.md) |
| 1.8 | `Musique` panel as a **stacked section list** with the jump-bar `<nav>` (not sub-tabs) | [07](07-artist-detail-tabs.md) |
| 1.9 | `ArtistProfileContainer` + one panel container per visible tab | [17](17-frontend-module.md) |
| 1.10 | Route `app/(public)/artistes/[slug]/{page,loading,not-found}.tsx`, `initialData` seeding | [20](20-state-management-and-query-keys.md) |
| 1.11 | **The corrected 404 predicate** — zero across *all* surfaces, not just songs and videos | [01](01-overview.md) |
| 1.12 | Loading / empty / error states, **per section** — one failed section must not blank the panel | [09](09-loading-empty-error.md) |
| 1.13 | i18n bundle + registration in `resources.ts` | [12](12-i18n.md) |
| 1.14 | Metadata, `MusicGroup` JSON-LD, canonical | [13](13-seo-and-metadata.md) |
| 1.15 | Entry point: link the artist name on the lyrics detail page — `artistSlug` already returned | [03](03-information-architecture.md) |

Build 1.11 as a predicate over the full surface set from day one, even though four of those
surfaces are always zero in Phase 1. Written as "lyrics or videos" it is correct today and silently
wrong the week Phase 2 lands — an album-only artist would 404 with a full Albums section behind it.

Likewise build 1.2's `visibleTabs` over all three keys from day one. Tabs whose totals are absent
resolve to zero and are hidden; nothing needs to change when a gap lands.

### Running in parallel: Gap 2 (badge)

`isVerified` on `ArtistDto`, derived from `UserId != null && VerifiedAt != null`. DTO plus mapper.
Not a blocker: until it lands the mapper coalesces to `false` and no badge renders anywhere. A
profile with no badges is complete and honest; a badge the backend cannot substantiate is not
([22](22-verified-artists-and-claiming.md)). Regenerate `116.api.ts` when it lands and drop the
`?? false`.

### Exit criteria

- [ ] `/artistes/{slug}` server-renders hero + the default tab's first page in one request.
- [ ] `Musique` renders `Chansons populaires` above `Dernières chansons`, in **different orders**
  for an artist whose view counts and dates diverge.
- [ ] `Populaires` is hidden for an artist with ≤ 10 songs; rank numbers are `aria-hidden`.
- [ ] `Vidéos` renders; a tab with zero items is hidden; one visible tab renders no tab bar.
- [ ] Tab keys are `music` | `videos` | `news`; `lyrics`, `albums`, `merch` and `tour` appear
  nowhere as tab values.
- [ ] `?tab=videos&page=2` is deep-linkable and survives refresh; switching tabs uses `replace`.
- [ ] `?tab=music#albums` resolves the tab and the anchor without error even while Albums is unbuilt.
- [ ] A cached tab re-renders with **zero** requests; popular and latest occupy distinct cache
  entries.
- [ ] An artist with zero content on **every** surface 404s; an artist with any content does not.
- [ ] Lyrics detail → profile → another song works in both languages.
- [ ] `tsc --noEmit` and `biome check` clean.

**If it slips:** there is no artist page. This is the phase to protect.

### Explicitly not in Phase 1

`/artistes` still shows the coming-soon placeholder. Profiles are reachable by direct link, from
lyrics pages, and from the sitemap. A deliberate, temporary asymmetry — not a half-finished feature.

---

## Phase 2 — Albums + mixtapes

**Dependencies:** Phase 1. Backend Gaps 3 and 4.

Recommended first after Phase 1 because **Gap 3 is the cheapest outstanding gap in the feature**:
`AlbumEntity.ArtistId` already exists, so it is a repository method plus an endpoint, with **no
migration and no backfill**. The old plan's claim that this needed a migration was wrong and is
corrected here and in [16](16-backend-gaps-and-contracts.md) Gap 3.

Gap 4 — the `EnumReleaseType { Album, Mixtape, EP, Single }` discriminator — is a real migration,
but a small one: one column with a default, plus the admin create/update surface, plus a decision to
default existing rows to `Album` and let editors correct rather than blocking on a full audit.

| # | Item | Doc |
|---|---|---|
| 2.1 | Backend: artist-scoped album query + endpoint (Gap 3) | [16](16-backend-gaps-and-contracts.md) |
| 2.2 | Backend: release-type column + admin field + default-to-`Album` backfill (Gap 4) | [16](16-backend-gaps-and-contracts.md) |
| 2.3 | `IArtistAlbumEntity`, `artistAlbumFromDto` / `artistAlbumListFromDto` | [18](18-domain-entities-and-mappers.md) |
| 2.4 | `getArtistReleases` on the port/impl, use case, `useArtistReleases` keyed **by type** | [19](19-repository-usecases-and-di.md), [20](20-state-management-and-query-keys.md) |
| 2.5 | `ReleaseCard` — a **tile, not a link**: no hover-lift, no pointer cursor, not in the tab order | [08](08-catalog-sections.md) |
| 2.6 | Two sections under `Musique`, two headings, no filter chip | [08](08-catalog-sections.md) |

### Exit criteria

- [ ] Albums and mixtapes render as two separate headings, `ReleaseYear` desc then `Name` asc.
- [ ] `EP` and `Single` rows render in **neither** section — an EP under "Mixtapes" is a factual error.
- [ ] Album and mixtape queries occupy distinct cache entries.
- [ ] Album cards have no focus ring and add no tab stop.
- [ ] An artist with albums but no mixtapes shows one heading, not an empty second one.

**If it slips:** the `Musique` panel shows popular and latest only. Nothing else changes; no other
phase is blocked. This is the lowest-consequence slip on the board, which is
precisely why it is worth doing early — it is cheap and it proves the section-hiding machinery.

---

## Phase 3 — The artists index page

**Dependencies:** Phase 1 (module, mapper, keys, DI all exist) **and** the backend endpoint shipped
and `116.api.ts` regenerated. Still **fully blocked** — this is unchanged from the old plan.

The backend half (Gaps 1, 1a, 1b, 1c) has **no dependencies and should start immediately**, in
parallel with Phase 1. It is specified in `apps/backend/docs/`, not here.

| # | Item | Severity |
|---|---|:---:|
| 3.1 | `GET /api/v1/public/artists` — paged, `letter`, `search`, published-content filter | 🔴 |
| 3.2 | `contentCount` as a single-statement aggregate, **not N+1** (Gap 1a) | 🔴 |
| 3.3 | Indexes covering the published-content join | 🔴 |
| 3.4 | Accent-insensitive collation shared by sort **and** bucketing (Gap 1c) | 🟠 |
| 3.5 | `availableLetters` over the same filtered set, cached (Gap 1b) | 🟠 |
| 3.6 | Frontend: `getArtists` on port/impl, use case, `useArtistsDirectory` infinite query | — |
| 3.7 | `ArtistCard`, `ArtistsGrid` + its four state files | — |
| 3.8 | `AlphabetRail`, `ArtistSearchField`, mutual exclusion, `page` reset | — |
| 3.9 | `ArtistsDirectoryContainer` — URL state via `router.replace`, load-more | — |
| 3.10 | **Replace** the coming-soon body; remove the two `artistes.comingSoon.*` keys | — |
| 3.11 | Sitemap entries for every listed profile | — |

**`contentCount` must use the corrected definition.** It counts the same five surfaces the 404
predicate uses ([01](01-overview.md), decision 4). If the endpoint counts only lyrics and videos
while the profile renders on any surface, an album-only artist is unlisted — or worse, a listed
artist 404s when clicked. **One definition, both sides**, and both must move together when a phase
lands. This is the most likely cross-team defect in the whole feature.

That coupling has a scheduling consequence: the index's definition of "has content" **widens** every
time a later phase ships. Write it as one shared predicate at the source, not as a hand-maintained
`OR` chain in a query.

### Exit criteria

- [ ] The endpoint returns only artists with ≥ 1 item on **any** surface.
- [ ] **Query count is independent of `pageSize`** — the N+1 acceptance test
  ([21](21-performance-and-pagination.md)).
- [ ] p95 under 300ms for page 1 unfiltered.
- [ ] Ordering is alphabetical, accent- and case-insensitive; `Élodie` sorts under `E` and buckets
  under `E`, using the **same** folding.
- [ ] `?letter=F`, `?q=gola`, `?page=2` all render server-side and survive refresh; `letter` and `q`
  are never both active.
- [ ] Letters with no artists are disabled, not hidden — or all enabled if 3.5 did not ship.
- [ ] No artist is listed that 404s, and none 404s that is listed.
- [ ] The coming-soon placeholder and its i18n keys are gone.

3.5 is degradable — all 27 letters enabled is the documented fallback ([25](25-open-questions.md)
Q4) and must never delay 3.1.

**If it slips:** profiles remain reachable by direct link, from lyrics pages and from the sitemap,
and the coming-soon placeholder stays live. Discoverability is worse; nothing is broken. The phase
split exists precisely so this is survivable — that reasoning was right in the old plan and is
carried forward unchanged.

---

## Phase 4 — Identity block + social links

**Dependencies:** Phase 1. Backend Gaps 7 and 8.

Cheap in schema terms and high in perceived completeness: four nullable columns
(`RealName`, `Aliases`, `Birthdate` as **`DateOnly`**, `Hometown`) and a child table
`ArtistSocialLink { ArtistId, Platform, Url }` mirroring the existing `StreamingLinkEntity` pattern.
No backfill is required to ship — the block renders whatever exists and hides what does not.

| # | Item | Doc |
|---|---|---|
| 4.1 | Backend: four nullable identity columns + admin fields + max-length validation (Gap 7) | [16](16-backend-gaps-and-contracts.md) |
| 4.2 | Backend: `ArtistSocialLink` child table + `EnumSocialPlatform` + admin surface (Gap 8) | [16](16-backend-gaps-and-contracts.md) |
| 4.3 | Entity + mapper: `aliases` empty-array and `null` collapse to one output | [18](18-domain-entities-and-mappers.md) |
| 4.4 | `ArtistIdentityBlock` — every field hidden when null, real name suppressed when it equals the stage name | [06](06-artist-detail-hero.md) |
| 4.5 | Date-only birthdate handling: parse the parts, never `new Date(...)` + local getters | [06](06-artist-detail-hero.md) |
| 4.6 | Social row: icon-only, per-platform accessible label, **unknown platforms skipped** | [06](06-artist-detail-hero.md) |

**This phase carries a non-engineering blocker.** Birthdate and hometown are factual claims about
real people, published on mostly-unclaimed profiles and fed to search engines through the JSON-LD.
Two policy answers are required before the block ships, not after:

1. **Editorial sourcing** — where do these values come from and who checks them?
2. **A correction path** — a verified artist must be able to get their own data fixed
   ([22](22-verified-artists-and-claiming.md)).

Both are recorded in [25](25-open-questions.md). The schema does not solve either, and shipping the
columns without them is the one place in this plan where a technically-clean release creates a
liability. **A `null` field costs nothing; a wrong one costs a correspondence.**

### Exit criteria

- [ ] An artist with no identity data renders **no block** — not an empty container.
- [ ] Each field is individually absent from the DOM when null; no label ever sits beside an em-dash.
- [ ] `1986-10-24` renders as 24 October in every timezone the test matrix covers.
- [ ] Age is derived at render, never stored.
- [ ] Real name is suppressed when it matches the stage name.
- [ ] An unknown `Platform` value renders nothing rather than a generic link.
- [ ] Social links carry `rel="noopener noreferrer"` — **not** `sponsored`; these are not commercial.
- [ ] The sourcing and correction-path decisions are recorded before release, not after.

**If it slips:** the hero shows name, badge, bio and stats — exactly the Phase 1 hero. Nothing else
degrades, and the liability question stays closed. **Slipping this phase is strictly safer than
shipping it unresolved**, which is not true of any other phase here.

---

## Phase 5 — News

**Dependencies:** Phase 1. Backend Gap 5 — an `ArticleArtist` join table.

A join table, not a single FK: articles routinely cover several artists, and a single FK forces an
arbitrary choice for "news about Fally and Ferré".

| # | Item | Doc |
|---|---|---|
| 5.1 | Backend: `ArticleArtist` join table | [16](16-backend-gaps-and-contracts.md) |
| 5.2 | Backend: admin tagging UI on the article editor | — |
| 5.3 | Backend: backfill of the existing archive — **editorial work, not a script** | — |
| 5.4 | Frontend: `Actualités` tab reusing the existing `ArticleCard` — do not rebuild it | [08](08-catalog-sections.md) |

**The real cost here is editorial, not technical.** The technical half is a day. Tagging is then a
permanent extra step on every new article, plus a human pass over the archive. An untagged archive
means the tab is empty on artists who obviously have coverage — which reads as a bug in *our*
product, not as missing data.

That makes 6.3 a genuine gate: shipping 6.1 and 6.4 without it produces a tab that is correct and
useless.

### Exit criteria

- [ ] `Actualités` renders the existing `ArticleCard`; no artist-specific article card exists.
- [ ] Article cards **do** link out to the article detail page (unlike album tiles) — that page
  exists.
- [ ] An article tagged to two artists appears on both profiles.
- [ ] The tab is hidden entirely when the artist has no tagged articles.
- [ ] Someone owns tagging as an ongoing editorial step, in writing.

**If it slips:** no `Actualités` tab. Articles remain reachable through `/articles` exactly as
today. Zero regression.

---

## Unphased: Gap 6 — video → artist entry point

Not a phase. A DTO field and a link, doable any time after Phase 1.

`ArtistSlug` on the video detail response, mirroring what the lyrics detail response already does.
The video detail meta row then links the artist name to `/artistes/{slug}` when the slug is present,
plain text otherwise ([03](03-information-architecture.md)).

**If it slips:** the lyrics→artist half of the loop works and the video→artist half does not.
Cheap to add whenever the video module is next touched.

---

## Optional: per-tab endpoints

**Dependencies:** none. A pure optimisation.

Paging a tab currently re-calls the profile endpoint with the other catalogs zeroed
([19](19-repository-usecases-and-di.md)). Dedicated per-surface endpoints remove the redundancy.
Only worth doing if profiling says so; the change is confined to the repository impl.

Note this pressure grows with each phase — across five surfaces the profile payload is a poor paging
vehicle in a way it was not with two. Revisit after Phase 5.

---

## Sequencing risks

| Risk | Impact | Mitigation |
|---|---|---|
| **Lyrics module not built** | **Phase 1 cannot start** | Confirm in Phase 0, before any estimate is given |
| **The plan is scheduled as one ticket** | A blocked epic instead of an improving page | Phases 2, 4 and 5 are independent; schedule them as separate work |
| 404 predicate and `contentCount` drift apart | A listed artist 404s when clicked | One shared predicate; widen both together, every phase |
| The 404 predicate is written as "lyrics or videos" | Correct in Phase 1, silently wrong from Phase 2 | Build it over all five surfaces in 1.11, while three are always zero |
| Popular and latest share a cache key | The same list under two headings claiming different orders | Sort is part of the key; asserted in [23](23-testing-strategy.md) |
| Gap 1a ships N+1 | The directory becomes the slowest route on the site | Query-count assertion is a Phase 3 exit criterion, not a follow-up |
| Identity fields ship before the sourcing/correction policy | A factual claim about a real person with no route to fix it | Phase 4 exit criterion; slipping is safer than shipping |
| Generated client names differ from this design | Compile errors across the repository impl | Expected; [19](19-repository-usecases-and-di.md) says to confirm names post-regeneration |
| `PaginatedRequest` rejects `pageSize: 0` | Tab paging over-fetches | Fall back to `pageSize: 1` and discard; verify in Phase 1 |
| Any single phase slips | That surface does not render | **Every surface hides independently** — the page is smaller, never broken |
