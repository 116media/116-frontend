# Lyrics Page — Open Questions

Questions 1, 2, 4, 5, and 6 are resolved below. Only question 3 (JSON-LD schema type) is still
genuinely open and needs a go-ahead before spec 05 is implemented.

## 1. URL shape — resolved: a real stored `Slug` column

**Decision: add a stored, unique `Slug` column to `LyricsEntity`**, mirroring
`ArticleEntity.Slug` / `VideoEntity.Slug` exactly — same type, same `ContentConstants.MaxSlugLength`
(220), same uniqueness-check-before-insert pattern. URLs become a single segment,
`/lyrics/{slug}` (e.g. `/lyrics/fally-ipupa-mayday-lyrics`), matching the Genius-style URL this was
modeled on (`genius.com/Fally-ipupa-mayday-lyrics`) — see the slug-formula note below for the exact
`{artist}-{title}-lyrics` generation rule. Full backend spec:
[specs/01-backend-public-list-endpoint.md](specs/01-backend-public-list-endpoint.md).

This reverses the original recommendation in this doc, which proposed reusing the existing
two-segment `{songTitle}/{artistName}` route to avoid any backend schema change. That was the
wrong tradeoff: duplicate song titles are routine in music (remixes, live versions, re-releases,
generically-named tracks like "Intro"/"Outro" reused across an artist's own catalog) —
`songTitle + artistName` is not a safe uniqueness key, and `%20`-encoded, two-segment URLs are a
worse fit for a page whose entire purpose (per the entity's own doc comment) is SEO keyword
targeting.

### Slug formula — `{artist}-{song-title}-lyrics`, Genius-style

**Correction — this section previously proposed a special "clean slug, suffix only on collision"
carve-out for lyrics, deliberately breaking from the platform's usual slug convention. That
carve-out is dropped.** Lyrics slugs are generated **exactly the same way** every other slugged
content type in this codebase already works: client-side in the dashboard, via the shared
`generateSlug(text, { unique: true })` util
(`apps/dashboard/src/shared/presentation/utils/slug/slug.utils.ts`) — no special-cased behavior,
no bespoke collision handling.

The only lyrics-specific piece is **what text gets slugified**: the artist's main name and the
song title, combined, with a literal `lyrics` suffix — the same shape Genius uses for its own
URLs (e.g. `genius.com/Fally-ipupa-mayday-lyrics`):

```text
slugify(`${artistName} ${songTitle} lyrics`, { unique: true })
// "Fally Ipupa" + "Mayday" → "fally-ipupa-mayday-lyrics-a3x9k2m7"
```

One visible difference from Genius's own display: this platform's slug format is **all lowercase**
(`^[a-z0-9]+(?:-[a-z0-9]+)*$`, enforced by the backend's `SlugRegex` — see
[specs/01-backend-public-list-endpoint.md](specs/01-backend-public-list-endpoint.md)), matching
every other slug in this app, where Genius keeps capitalized words. Only the casing differs from
the Genius example above — the `{artist}-{title}-lyrics` shape and the trailing random-suffix
uniqueness mechanism are identical to how articles/videos/tags/categories/shorts already work.

This is dashboard + backend work, not covered by the frontend specs in this folder in full detail
— see [specs/01-backend-public-list-endpoint.md](specs/01-backend-public-list-endpoint.md) for the
backend side (schema, commands, validators, the new by-slug endpoint, and the exact slug-generation
formula). The dashboard's `UseCreateLyrics.ts` / `UseUpdateLyrics.ts` and `ICreateLyricsCredentials`
/ `IUpdateLyricsCredentials` need a `slug` field added, mirroring `UseCreateArticle.ts`'s shape —
tracked here as required but not spec'd file-by-file, since `apps/dashboard` is a separate app from
this docs folder's home.

## 2. ~~Author on the standalone detail page~~ — resolved, not applicable

**Corrected below — the original framing of this question was wrong.**

`LyricsDto.Author` / `AuthorId` is **not** the songwriter or performer — it's the admin/staff
account that entered the record into the CMS, exactly like an article's `AuthorId` is the
journalist who wrote that article. The difference is that for an article, the author *is* the
content creator, so surfacing it as a public byline is correct. For lyrics, the admin who
transcribed the text into the CMS did not write the song — `ArtistName` already identifies who
did. A public "by {admin username}" byline on a lyrics page would misrepresent authorship, not add
useful attribution.

**Decision: do not surface `Author`/`AuthorId` anywhere in the public lyrics feature.**
`ILyricsDetailEntity` drops the `author` field entirely (see the correction in
[../03-frontend-module.md](../03-frontend-module.md) and
[specs/02-domain-entities-and-mapper.md](specs/02-domain-entities-and-mapper.md)) — it is CMS
attribution the public page never renders. No backend change needed; both existing public lookups
staying on the sync `ToLyricsDto` (no author resolution) was already correct, for the right reason
this time.

## 3. JSON-LD schema type

Recommended: `MusicComposition` with a nested `lyrics: CreativeWork`
([04-routes-and-artist-placeholder.md](04-routes-and-artist-placeholder.md)) — the schema.org type
built for exactly this. `article-json-ld.utils.ts` uses `NewsArticle`; there's no equivalent
lyrics-specific precedent in this codebase yet, so this is a fresh choice, not a reuse of an
existing pattern. Confirm before spec 05 is implemented.

## 4. Cross-link from the detail page to a linked video — resolved

**Decision: resolve the video's slug server-side, in the same backend call — no second
frontend fetch.**

`IVideoRepository.GetByIdAsync(Guid id, ...)` already exists and is already used internally
(`AdminCreateLyricsHandler` calls `videoRepository.GetByIdOrThrowAsync` to mark
`video.MarkHasLyrics()` when a lyrics page is linked on create). `VideoEntity.Slug` already
exists. So `PublicGetLyricsBySlugHandler` (spec 01) is extended: when `lyrics.VideoId.HasValue`,
it also calls `videoRepository.GetByIdAsync(lyrics.VideoId.Value, ct)` and adds the resolved
`video.Slug` to the endpoint's own response type (`PublicGetLyricsBySlugResponse`, **not** the
shared `LyricsDto`, since this is a detail-page-specific concern) as `VideoSlug: string?`.

The frontend then has `videoSlug` on `ILyricsDetailEntity` directly from the one lookup it already
makes, and renders `/videos/{videoSlug}` when present — no second network round-trip, no new
repository method, no client-side lookup logic.

## 5. Should `VideoDetailLyrics` link out to the new standalone page? — resolved, in scope

**Decision: yes, implement this now** — reversing the original "out of scope, unchanged" framing.
`VideoDetailLyrics` gains a "View full lyrics" link to `/lyrics/{slug}` (the slug-based URL from
question 1).

This requires `IVideoLyricsEntity` (`src/modules/videos/domain/entities/IVideoLyricsEntity.ts`) to
gain a `slug: string` field, and `VideosMapper.videoLyricsFromDto`
(`src/modules/videos/infrastructure/mappers/videos.mapper.ts`) to map it from `dto.slug` — once
spec 01 adds `Slug` to `LyricsDto`, `GetLyricsByVideoIdHandler`'s response already carries it with
no further backend change. `VideoDetailLyrics.tsx` renders the link below the lyrics text. This is
now tracked as **in-scope, required work touching the `videos` module** — not the "unchanged"
claim in [01-overview.md](01-overview.md), which is corrected accordingly.

## 6. Search / filter scope on `/lyrics` — resolved: add a language filter

**Decision: add the `Language` filter**, reversing the original "search only" recommendation.
`LyricsEntity.Language` is stored on every record and otherwise sits unused end-to-end: nothing
lets a visitor act on it. A field nobody can filter on is dead data.

**Correction**: an earlier draft of this decision assumed lyrics content is limited to French,
Lingala, and English (`ContentConstants.DefaultLyricsLanguage`'s doc comment names those three as
the *default/most common* case, not an exhaustive set). That assumption was wrong — the
**dashboard's** own lyrics form proves it: `LyricsForm`'s language field is a `LanguageSelect`
bound to the full ISO 639-1 list (~180 languages,
`apps/dashboard/src/shared/infrastructure/constants/languages.ts`), so an admin can tag a lyrics
record with *any* of them. The public filter has to search the same space, or a real record could
be untargetable by its own language.

**Backend**: a new `LyricsQueryBuilder.WithLanguage(string? language)` specification —
exact-match (`lyrics.Language == language`, not `ILIKE` — language codes aren't free text), combined
with the existing search spec the same way `WithSearch` already combines. `PublicGetPublishedLyricsQuery`
gains a `Language` param; the endpoint gains a `?language=` query param. No change needed here for
the correction — an exact-match string filter already supports any code, fixed set or not. Full
code in [specs/01-backend-public-list-endpoint.md](specs/01-backend-public-list-endpoint.md).

**Frontend**: `IPublishedLyricsQuery` gains `language?: string`; `LyricsFeedContainer` gains a
**searchable** language filter (`LyricsLanguageSelect`) over a new `CONTENT_LANGUAGE_LIST` constant
— the dashboard's full ISO 639-1 list, ported into the frontend app — mirroring the existing
`CountrySelect` component's searchable-popover pattern (a plain `DropdownMenu` doesn't scale to
~180 items). Full code in [specs/04-lyrics-list-page.md](specs/04-lyrics-list-page.md).
