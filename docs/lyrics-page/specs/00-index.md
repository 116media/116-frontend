# Lyrics Page — Implementation Specs

Implementation-ready specs for the public lyrics feature (`/lyrics`, `/lyrics/{slug}`) — cover art,
song credits, view/like/share counts, similar lyrics — the small `videos`-module cross-link this
enables, and the `/artistes` coming-soon placeholder. Each spec contains **full, JSDoc'd code
snippets** and a task checklist whose boxes are ticked `- [x]` only **after** the work is
implemented and verified (`tsc` + biome clean for frontend; the backend's own test suite for the
backend specs; behavior confirmed in the browser).

Read the design docs first ([../README.md](../README.md)) for the *why*; these specs are the
*how*. Questions 1, 2, 4, 5, and 6 are resolved in
[../05-open-questions.md](../05-open-questions.md). Only question 3 (JSON-LD schema type) is still
pending sign-off — it affects spec 05 only.

---

## Specs

| File | What it covers |
| --- | --- |
| [01-backend-public-list-endpoint.md](01-backend-public-list-endpoint.md) | Summary only — points to the authoritative backend spec 01: `Slug` column, required `CategoryId` (full free/paid parity with articles/videos), the editorial status workflow, and the public list endpoint with a language filter |
| [02-domain-entities-and-mapper.md](02-domain-entities-and-mapper.md) | `ILyricsSummaryEntity`, `ILyricsDetailEntity` (+ `ILyricsCredits`), `ILyricsPage`, `LyricsMapper` |
| [03-repository-usecases-and-di.md](03-repository-usecases-and-di.md) | Port, impl, all seven use cases (reads + interactions + similar), DI registration, generated-client regen |
| [04-lyrics-list-page.md](04-lyrics-list-page.md) | `/lyrics` route, `LyricsFeedContainer`, `LyricsGrid`, `LyricsCard` (with cover art), the language filter |
| [05-lyrics-detail-page.md](05-lyrics-detail-page.md) | `/lyrics/[slug]` route, cover hero, credits card, engagement bar, similar-lyrics section, JSON-LD, not-found boundary |
| [06-artist-coming-soon-page.md](06-artist-coming-soon-page.md) | `/artistes` route, reusing `EmptyState` |
| [07-i18n-strings.md](07-i18n-strings.md) | `lyrics` + `lyrics-detail` module namespaces (credits, engagement, similar, language filter labels), `artistes` shared namespace |
| [08-verification.md](08-verification.md) | End-to-end checklist across both locales |
| [09-video-cross-link.md](09-video-cross-link.md) | `videos` module: `IVideoLyricsEntity.slug` + the "View full lyrics" link from the embedded lyrics tab |
| [10-backend-song-metadata-and-cover.md](10-backend-song-metadata-and-cover.md) | Backend: cover image + album/release year/label/songwriter/producer |
| [11-backend-interactions.md](11-backend-interactions.md) | Backend: view/like/share counts — a full interaction system, mirroring `ShortVideo` |
| [12-backend-similar-lyrics.md](12-backend-similar-lyrics.md) | Backend: the similar-lyrics query (video category, or latest standalone) |

### Musixmatch-scale expansion (specs 13–18)

Cover the homepage sections, artist/album entities, tags, AI translation + community review,
community submissions/corrections, and monetization described in
[../06-musixmatch-scale-expansion.md](../06-musixmatch-scale-expansion.md) and
[../07-community-and-monetization.md](../07-community-and-monetization.md). Full DB schema:
[../08-db-schema.md](../08-db-schema.md). Read-time view algorithm:
[../09-view-count-algorithm.md](../09-view-count-algorithm.md).

| File | What it covers |
| --- | --- |
| [13-backend-artist-and-album-entities.md](13-backend-artist-and-album-entities.md) | `ArtistEntity`, `AlbumEntity`, claiming/verification, artist-slug resolution on the detail lookup |
| [14-backend-tags-and-similar-lyrics-v2.md](14-backend-tags-and-similar-lyrics-v2.md) | `TagEntity`, admin tagging, the shared-tags similar-lyrics fallback |
| [15-backend-translations-and-review.md](15-backend-translations-and-review.md) | AI-generated translations, Wikipedia-style revision/vote review workflow |
| [16-backend-album-and-streaming-links.md](16-backend-album-and-streaming-links.md) | "More from this album," curated + generated-fallback streaming platform links |
| [17-backend-community-submissions-and-monetization.md](17-backend-community-submissions-and-monetization.md) | Summary only — points to the authoritative backend specs (11, 12): submissions/corrections, identity-gated verified-artist fast path, and monetization scoped to advertising + streaming affiliate + promoted placement (reusing the existing Commerce module, no subscriptions/revenue-share ledger) |
| [18-frontend-homepage-and-detail-redesign.md](18-frontend-homepage-and-detail-redesign.md) | Homepage rails, two-column detail layout, translation UI, new `artists` module |

This expansion is a distinct, larger phase from specs 01–12 — land 01–12 (the MVP) first; 13–18
build on top of it and are not required for the MVP to ship.

---

## Implementation order

1. **Backend changes** (01, 10, 11, 12 — can land as one combined PR or four sequenced ones; all
   are additive schema changes with no interdependency requiring a specific order among
   themselves) — everything else depends on these existing; regenerate `116.api.ts` once they
   ship.
2. **Domain & mapper** (02) — no callers yet, verifiable in isolation.
3. **Repository, use cases, DI** (03) — wires the module into the container.
4. **List page** (04) and **detail page** (05) — no ordering dependency on each other, can be built
   in parallel once 03 lands.
5. **Artist placeholder** (06) — fully independent of everything else; can be done any time.
6. **i18n** (07) — new keys are needed by 04/05/06/09 as they're built, not a separate phase in
   practice; listed on its own for reviewability, but land the keys alongside the component that
   consumes them.
7. **Video cross-link** (09) — depends only on spec 01's `LyricsDto.Slug` shipping; independent of
   04/05/06 otherwise.
8. **Verification** (08) — full sweep, both locales, once everything above lands.

Also required, tracked but not spec'd file-by-file since it's a separate app: the **dashboard**
gains a `slug` field on lyrics create/update (spec 01) and a metadata form for the new cover/credit
fields (spec 10).

---

## Conventions for all snippets

- **JSDoc only — no inline comments.** Block `/** … */` above every export (multi-line, `@param` /
  `@returns` / `@property`, neutral team-to-team voice, ≤ 3 description lines). No `//` narration,
  no decorative separators.
- **Mappers own list-mapping** (`lyricsPageFromDto`) — call sites never `.map(Mapper.x)`.
- **`Result<T>`** out of the repository impl; the existing `ProblemMapper.toFailure` in catches.
- **One component per folder, 2–3 files** (`AGENTS.md`'s component-folder rules) — kind buckets
  (`cards/`, `sections/`, `pages/`, `navigation/`), dotted state-file siblings (`.Loading.tsx`,
  `.Empty.tsx`, `.Error.tsx`, `.EndOfFeed.tsx`, `.NotFound.tsx`, `.Credits.tsx`).
- **Reuse the `page-titles` server-translation util** (`getServerTranslation()` from
  `@/shared/presentation/utils/i18n/i18n.server.utils`) for every route's `generateMetadata` — do
  not reinvent a server-side translation accessor for this feature.
- **No generic `Select` component exists** in this codebase's UI library — single-select filters
  use `DropdownMenu` + `Button` (see `ArticlesToolbar.CategorySelect.tsx`, the precedent
  `LyricsLanguageSelect` mirrors).
- **Interactions mirror `shorts`, not `articles`** — `useToggle`/`runInteraction` for the optimistic
  like, fire-and-forget hooks for share/view, no feed-cache bump needed (the detail page shows one
  record, not a list).
- **`fr` and `en` must hold the exact same keys** — every new key gets both mirrors in the same
  commit (`../../../../docs/i18n/frontend/11-type-safety.md`).
- **Next 16 is customized** — recheck
  `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md` if a spec
  needs a metadata field not already covered by the `page-titles` specs.
- **Backend (specs 01, 10, 11, 12)**: `Result<T>`-free — the backend uses exceptions +
  `ContentI18n` facade errors, not the frontend's `Result<T>` pattern; follow the existing handler
  style in `PublicGetPublishedArticlesHandler` / `AdminCreateArticleHandler` /
  `PublicLikeShortVideoHandler`, not any frontend convention.

---

## Global progress

- [x] 01 — Backend: slug, admin commands, detail + list endpoints, language filter
- [ ] 02 — Domain entities & mapper
- [ ] 03 — Repository, use cases, DI
- [ ] 04 — Lyrics list page
- [ ] 05 — Lyrics detail page
- [ ] 06 — Artist coming-soon page
- [ ] 07 — i18n strings
- [ ] 08 — Verification
- [ ] 09 — Video cross-link (`videos` module)
- [x] 10 — Backend: song metadata & cover image
- [x] 11 — Backend: view/like/share interactions
- [x] 12 — Backend: similar lyrics query
- [x] 13 — Backend: artist & album entities
- [x] 14 — Backend: tags & similar-lyrics v2
- [x] 15 — Backend: AI translations & community review
- [x] 16 — Backend: album tracks & streaming links
- [x] 17 — Backend: community submissions & monetization
- [ ] 18 — Frontend: homepage sections & detail-page redesign

Mark a box `- [x]` only when that spec's own task list is fully verified.
