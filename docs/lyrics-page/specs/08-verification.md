# Spec 08 — Verification

Full sweep across both new routes, both locales, after specs 01–07 and 09–12 land.

---

## Backend

- [ ] `GET /api/v1/admin/lyrics` (existing) still works; create/update now require a `Slug` and
  reject duplicates with a conflict error.
- [ ] `GET /api/v1/public/lyrics` (new) returns `200` with a paginated list; `search` filters
  correctly across song title, artist name, and lyrics text; `language` filters to an exact match;
  the two combine correctly; no auth required.
- [ ] `GET /api/v1/public/lyrics/{slug}` (replaces the old two-segment route) returns `200` with
  the matching lyrics page and, when linked to a video, the correct `videoSlug`; a stale/deleted
  linked video degrades to `videoSlug: null` rather than 404ing; a missing slug returns `404`.
- [ ] `GET /api/v1/public/lyrics/by-video/{videoId}` (existing) still works unaffected —
  `VideoDetailLyrics` on the video detail page renders correctly, unregressed, and its response now
  also carries `slug`.
- [ ] Creating two lyrics records with the same slug is rejected with a conflict error
  (`SlugAlreadyExists`); updating a record to a slug already used by another record is rejected the
  same way; updating a record to keep its own current slug succeeds.
- [ ] `116.api.ts` regenerated; `getPublishedLyrics`, the single-param `getLyricsBySlug(slug)`, and
  `LyricsDto.slug` are all present.
- [ ] `POST /api/v1/public/lyrics/{id}/likes` / `DELETE .../likes` / `POST .../shares` /
  `POST .../views` (new) all work: like requires auth, double-like conflicts, unlike-without-a-like
  rejects, share and view-record are anonymous-allowed, repeat views within 24h don't double-count.
- [ ] `GET /api/v1/public/lyrics/{id}/similar` (new) returns same-category matches for a
  video-linked record, the 10 latest standalone records for a standalone one, excludes the record
  itself in both cases, and returns an empty list (not an error) when nothing matches.
- [ ] `LyricsDto` carries `coverImageUrl`, `album`, `releaseYear`, `label`, `songwriter`, `producer`,
  `viewCount`, `likeCount`, `shareCount`, `isLiked` — all present and correctly resolved (cover URL
  from `CoverImageFileId`, counts from the cached columns, `isLiked` true only for the
  authenticated liker).
- [ ] Admin metadata update (`PUT /api/v1/admin/lyrics/{id}/metadata` or equivalent) persists all
  six new fields; each is independently optional (omitting one doesn't clear the others).

## Manual checklist — routes and titles

| Route | Expect (fr) | Expect (en) |
| --- | --- | --- |
| `/lyrics` | `116 - Paroles` | `116 - Lyrics` |
| `/lyrics/{slug}` (existing record) | `116 - <metaTitle or songTitle — artistName>` | same |
| `/lyrics/{slug}` (no match) | `116 - Paroles introuvables` | `116 - Lyrics not found` |
| `/artistes` | `116 - Artistes` | `116 - Artists` |

(Title format per the `page-titles` feature's locked `116 - <Page>` convention — confirm this
feature didn't accidentally reintroduce a `| 116` suffix anywhere.)

## Manual checklist — behavior

- [ ] `/lyrics`: grid loads, infinite scroll fetches further pages, search (debounced) filters the
  list, the language filter's search box finds a language by name/native name/code and narrows the
  list to an exact match (test at least one language outside fr/ln/en, e.g. Swahili or Portuguese,
  to confirm the filter isn't secretly limited to a fixed set), both filters combine correctly,
  clearing restores the full list, empty/error states render correctly.
- [ ] Every lyrics card links to `/lyrics/{slug}` (clean, no `%20`-encoded spaces) and resolves to
  the matching detail page.
- [ ] Detail page: song title, artist name, full lyrics text (line breaks preserved) render
  correctly; JSON-LD (view page source) matches the chosen schema type
  (`../05-open-questions.md` question 3).
- [ ] Detail page for a video-linked lyrics record: "watch the video" link renders and points to
  the correct `/videos/{slug}`. Detail page for a standalone record: no such link renders.
- [ ] `VideoDetailLyrics` (the embedded video-tab view): still renders inline lyrics exactly as
  before, **plus** a "View full lyrics" link that navigates to the correct `/lyrics/{slug}`.
- [ ] Detail page cover hero: renders the cover image when present; renders the muted
  `MusicIcon` fallback when absent — never a broken image or empty space.
- [ ] Detail page credits card: shows only the fields actually present on the record (spot-check a
  record with all five, one with none — no card renders at all — and one with a partial set).
- [ ] Detail page engagement bar: view count visibly increments on a fresh page load (not on every
  re-render/navigation-back); the like button toggles instantly (optimistic) and the liked state
  survives a reload; sharing bumps the share count.
- [ ] Detail page similar-lyrics section: a video-linked record shows only same-category lyrics; a
  standalone record shows the 10 latest standalone lyrics; a record with zero matches shows no
  section at all (confirm no stray heading or empty-state box).
- [ ] Header nav: "LYRICS" and "ARTISTES" both resolve to real pages, no 404s.
- [ ] `/artistes` shows the "coming soon" `EmptyState`, correctly localized.

## Dashboard (separate app — spot check, not a full test pass)

- [ ] Creating a lyrics record with a new, non-colliding song+artist produces a clean slug with no
  random suffix (e.g. `nipsey-hussle-checc-me-out`).
- [ ] Creating a lyrics record whose generated slug collides with an existing one succeeds anyway
  (the retry-with-suffix path), not a hard failure surfaced to the admin.
- [ ] The metadata form (cover upload, album, release year, label, songwriter, producer) saves
  correctly and each field can be cleared independently.

## Automated checks

- [ ] Backend: `dotnet test` — new integration + unit tests for the slug uniqueness checks, the
  language filter, `PublicGetPublishedLyricsEndpointV1`/`Handler`, the video-slug resolution
  (present / absent / stale-id cases), the like/unlike/share/view-dedup interaction flows, and the
  similar-lyrics query (both branches, plus the zero-matches case) all pass; existing lyrics tests
  updated for the `Slug` requirement and unregressed otherwise.
- [ ] Frontend: `yarn lint:types` (`tsc --noEmit`) clean.
- [ ] Frontend: `yarn lint:code` (biome) clean.
- [ ] Frontend: `yarn build` succeeds.

## Regression watch

- [ ] `ARTISTE_DETAIL_PATH` (`/artistes/:slug`) remains unrouted — no broken link expects it to
  resolve; nothing links to it yet.
- [ ] No other module's DI registration or i18n composition broke from adding
  `registerLyricsDependencies` / `lyricsMessages` — spot check `/articles`, `/videos`, `/shorts`
  still load correctly after this feature's changes to `service.locator.ts` and `resources.ts`.
- [ ] The `videos` module's existing dashboard create/update flows (if they also submit lyrics
  linkage) are unaffected by the backend's `Slug` requirement on lyrics commands.
