# Lyrics Page — Backend Contract

Everything below lives in `apps/backend/src/Modules/Content/Content/`.

## Domain

**`Domain/Entities/LyricsEntity.cs`** — an `Aggregate<Guid>`, sibling to `VideoEntity` /
`ArticleEntity`. Key fields:

| Field | Notes |
| --- | --- |
| `SongTitle`, `ArtistName` | Required; max 200 / 100 chars |
| `LyricsText` | Required, full body |
| `Language` | ISO 639-1 / BCP-47 (e.g. `"fr"`, `"ln"`, `"en"`), default `"fr"` — **content language, independent of the site's fr/en UI toggle** |
| `VideoId` | Optional link to a `VideoEntity` (lyric video / "Behind the Lyrics" episode); `null` for standalone |
| `MetaTitle`, `MetaDescription` | SEO overrides, for this exact standalone-page use case |
| `StructuredData` | Raw JSON-LD string, admin-providable override |
| **No status/publish field** | Every lyrics record is public the instant it's created — no draft/published workflow, unlike articles and videos |

Two factories: `CreateForVideo(...)` and `CreateStandalone(...)`. `Update(...)` changes content
fields (including re-linking/unlinking a video); `UpdateSeo(...)` changes the three SEO fields
independently.

## DTO

**`Application/Shared/DTOs/LyricsDto.cs`**:

```csharp
public record LyricsDto(
    Guid Id, string SongTitle, string ArtistName, string LyricsText, string Language,
    Guid? VideoId, string? MetaTitle, string? MetaDescription, string AuthorId,
    AuthorDto? Author = null
) : AuditableDto;
```

`AuditableDto` carries `CreatedAt`/`UpdatedAt`. `Author` (an `AuthorDto`: `UserName`, `Email`,
`AvatarUrl`, `Role`) is populated on admin listing/detail, `null` on the two existing public
lookups (they call `lyrics.ToLyricsDto(mapper)` directly, not the author-resolving async variant
`AdminGetAllLyricsHandler` uses). **This is not the songwriter or performer** — it's the
admin/staff account that entered the record into the CMS (same concept as `CreatedBy` on
`AuditableDto`, just resolved to a full profile). `ArtistName` is the only "who made this"
field a visitor should ever see; `Author` is internal editorial attribution and is never surfaced
by this feature (see [05-open-questions.md](05-open-questions.md), question 2).

## Existing endpoints

| Method | Route | Auth | Handler |
| --- | --- | --- | --- |
| GET | `/api/v1/admin/lyrics` | Admin | `AdminGetAllLyricsHandler` — paginated, `search` param, resolves `Author` |
| POST | `/api/v1/admin/lyrics` | Admin | `AdminCreateLyricsHandler` |
| PUT | `/api/v1/admin/lyrics/{id}` | Admin | `AdminUpdateLyricsHandler` |
| PUT | `/api/v1/admin/lyrics/{id}/seo` | Admin | `AdminUpdateLyricsSeoHandler` |
| DELETE | `/api/v1/admin/lyrics/{id}` | Admin | `AdminDeleteLyricsHandler` |
| GET | `/api/v1/public/lyrics/{songTitle}/{artistName}` | Anonymous | `PublicGetLyricsBySlugHandler` — exact-match, case-insensitive (`ILIKE`), no author |
| GET | `/api/v1/public/lyrics/by-video/{videoId}` | Anonymous | `PublicGetLyricsByVideoIdHandler` — backs `VideoDetailLyrics`, unchanged by this feature |

Both public lookups throw `i18n.Lyrics.NotFound(...)` → a 404 problem response when nothing
matches. Both are rate-limited under `RateLimitPolicies.ContentBrowsing`, same as every other
public content-browsing endpoint.

### The by-slug lookup's docstring is misleading — it does exact raw-string matching

`PublicGetLyricsBySlugMetaField`'s own summary text gives
`/api/v1/public/lyrics/eloko-oyo/fally-ipupa` as an example — a kebab-case, hyphenated slug. That
is **not what the code does**. `LyricsBySongAndArtistSpecification` runs
`EF.Functions.ILike(lyrics.SongTitle, songTitle)` — an exact (case-insensitive only) match against
the raw, as-stored `SongTitle`/`ArtistName` strings, with no hyphen/space/kebab-case normalization
anywhere in the path. The endpoint's own integration test confirms this: it creates a record with
`SongTitle = "UniqueSlugSong"` and requests
`{ApiRoutes.Public.Lyrics}/UniqueSlugSong/UniqueSlugArtist` — the literal string, not a slugified
form.

Given a song titled "Eloko Oyo", the *docstring's own example URL* (`/lyrics/eloko-oyo/...`) would
**not** match it — only `/lyrics/Eloko%20Oyo/...` (URL-encoded, exact) would. This directly shapes
the frontend URL-shape decision in
[04-routes-and-artist-placeholder.md](04-routes-and-artist-placeholder.md): whatever the frontend
route captures for `songTitle`/`artistName` must be passed straight through, `encodeURIComponent`'d
but otherwise untouched — never slugified — or every lookup will 404.

## The gap: no public list endpoint

There is no way for an anonymous visitor to *browse* lyrics today — only look one up by exact
song+artist, or by a video's id. `/lyrics` needs a list. The fix mirrors
`PublicGetPublishedArticlesEndpointV1` almost exactly, simplified because lyrics have no
publish-status and no category/tag:

- **New query**: `PublicGetPublishedLyricsQuery(PaginatedRequest, string? Search, string? Language)`
  — reuses `LyricsQueryBuilder.WithSearch` (already searches `SongTitle`, `ArtistName`, `LyricsText`
  via `ILIKE`) plus a new `WithLanguage(...)` specification (question 6), combined with
  `ILyricsRepository.GetAllAsync` (already paginated).
- **New route**: `GET /api/v1/public/lyrics` (the group root — the existing
  `PublicGetLyricsBySlugEndpointV1` group is already mounted at
  `{Public}/{EditorialRouteConstants.Lyrics}`, i.e. `/api/v1/public/lyrics`, with its own
  `/{songTitle}/{artistName}` sub-route — the new endpoint adds a sibling `MapGet("/", ...)` in
  the same route group, same pattern `PublicGetPublishedArticlesEndpointV1` uses for `/articles`).
- **Response**: `PaginatedResult<LyricsDto>` — the DTO the admin endpoint already returns; the
  frontend mapper drops `Author` client-side for the list view (only the detail page needs it) the
  same way `IVideoLyricsEntity` already drops fields it doesn't need.

Full spec with code: [specs/01-backend-public-list-endpoint.md](specs/01-backend-public-list-endpoint.md).

## Why the two existing public lookups skip author resolution — correctly

`PublicGetLyricsBySlugHandler` and `PublicGetLyricsByVideoIdHandler` both call the *synchronous*
`lyrics.ToLyricsDto(mapper)` mapper extension — not the async, `IUserLookupService`-backed
`ToLyricsDtosAsync` the admin handler uses — so `Author` is always `null` on both. This is the
right behavior, not a gap: `Author` is CMS attribution (who entered the record), not the
songwriter/performer, and a public lyrics page has no reason to render it. No change is needed
here (see [05-open-questions.md](05-open-questions.md), question 2, corrected).

## Planned changes to everything above

Everything in this document up to here describes the backend **as it exists today**. Three
decisions in [05-open-questions.md](05-open-questions.md) change it:

- **Question 1**: `LyricsEntity` gains a stored, unique `Slug` column. The misleading two-segment
  `{songTitle}/{artistName}` route above is **replaced** by a single-segment `{slug}` route — it
  does not stay alongside the new one.
- **Question 4**: that same by-slug handler is extended to resolve the linked video's slug
  server-side (`IVideoRepository.GetByIdAsync` already exists and is already used elsewhere in this
  handler's neighborhood) and return it alongside the lyrics DTO.
- **Question 6**: the new public list endpoint (below) gains a `Language` query param, backed by a
  new `LyricsQueryBuilder.WithLanguage(...)` specification.

Full code for all three: [specs/01-backend-public-list-endpoint.md](specs/01-backend-public-list-endpoint.md).

## Further additions: song metadata, engagement, similar lyrics

Beyond the decisions above, three more backend additions cover the full detail-page design:

- **Cover image + song credits** — `CoverImageFileId` (resolved to `CoverImageUrl`, same pattern as
  `ArticleEntity.CoverImageFileId`), `Album`, `ReleaseYear`, `Label`, `Songwriter`, `Producer`. Named
  `Songwriter`, not `Author` — that name is already taken by CMS attribution (see the naming
  collision called out in [specs/10-backend-song-metadata-and-cover.md](specs/10-backend-song-metadata-and-cover.md)).
- **View, like, and share counts** — `LyricsEntity` currently tracks none of the three. Added by
  mirroring the `ShortVideo` interaction system exactly (view-dedup window, like/unlike,
  share-event logging). Full spec: [specs/11-backend-interactions.md](specs/11-backend-interactions.md).
- **Similar lyrics** — a new endpoint: same video category when the record is video-linked,
  otherwise the 10 latest standalone lyrics. Full spec:
  [specs/12-backend-similar-lyrics.md](specs/12-backend-similar-lyrics.md).
