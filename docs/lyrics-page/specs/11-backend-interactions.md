# Spec 11 — View, like, and share counts

Lyrics currently have **zero interaction tracking** — no views, likes, or shares. This spec adds
all three, mirroring the `ShortVideo` interaction system exactly (the closest existing precedent:
view + like + share, no comments, no bookmarks — matching what was asked for here). Same dedup
strategy for views, same like/unlike shape, same share-event shape.

---

## Domain — counters on `LyricsEntity`

```csharp
/// <summary>
/// Cached count of counted view events. Kept separate from the raw event log so reads
/// never join across the event table.
/// </summary>
public int ViewCount { get; private set; }

/// <summary>
/// Cached count of active likes.
/// </summary>
public int LikeCount { get; private set; }

/// <summary>
/// Cached count of share events.
/// </summary>
public int ShareCount { get; private set; }

/// <summary>
/// Increments the cached view count. Called only for events flagged as counted.
/// </summary>
public void IncrementViewCount() => ViewCount++;

/// <summary>
/// Increments the cached like count.
/// </summary>
public void IncrementLikeCount() => LikeCount++;

/// <summary>
/// Decrements the cached like count, never below zero.
/// </summary>
public void DecrementLikeCount() => LikeCount = Math.Max(0, LikeCount - 1);

/// <summary>
/// Increments the cached share count.
/// </summary>
public void IncrementShareCount() => ShareCount++;
```

## Domain — new aggregates

**`Domain/Entities/LyricsLikeEntity.cs`** and **`Domain/Entities/LyricsViewEventEntity.cs`** —
identical shape to `ShortVideoLikeEntity` / `ShortVideoViewEventEntity`, substituting `LyricsId`
for `ShortVideoId`. Not reproduced field-by-field here — copy those two files and rename.

**`Domain/Entities/LyricsShareEntity.cs`** — identical shape to `ShortVideoShareEntity`
(`UserId` (nullable — shares are anonymous-allowed), `LyricsId`, `ShareChannel`), same rename.

## EF configuration

Three new configuration classes (`LyricsLikeConfiguration`, `LyricsViewEventConfiguration`,
`LyricsShareConfiguration`), each a direct copy of the corresponding `ShortVideo*Configuration`
with `ShortVideoId` renamed to `LyricsId` and the FK pointed at `LyricsEntity`. `LyricsLikeEntity`
gets a unique index on `(UserId, LyricsId)` — same as `ShortVideoLikeEntity` — to make double-likes
a database-level impossibility, not just an application-level check.

## Migration

New `LyricsLikes`, `LyricsViewEvents`, `LyricsShares` tables (mirroring the `ShortVideo` equivalents
exactly) plus three new `int` columns on `Lyrics` (`ViewCount`, `LikeCount`, `ShareCount`, default
`0`).

## Repository

**`ILyricsRepository`** gains, mirroring `IShortVideoRepository`'s equivalents exactly:

```csharp
Task<bool> HasLikedAsync(Guid userId, Guid lyricsId, CancellationToken cancellationToken = default);
Task AddLikeAsync(LyricsLikeEntity like, CancellationToken cancellationToken = default);
Task RemoveLikeAsync(Guid userId, Guid lyricsId, CancellationToken cancellationToken = default);
Task AddShareAsync(LyricsShareEntity share, CancellationToken cancellationToken = default);
Task AddViewEventAsync(LyricsViewEventEntity viewEvent, CancellationToken cancellationToken = default);
Task<bool> HasCountedViewSinceAsync(
    Guid lyricsId,
    string dedupKey,
    DateTime since,
    CancellationToken cancellationToken = default
);
```

## Errors

**New `Application/Shared/Errors/LyricsInteractionErrors.cs`** — a separate error factory, not
additions to `LyricsErrors`, mirroring `ShortVideoInteractionErrors`'s own separation from
`ShortVideoErrors` exactly (interaction errors are a distinct concern from content-validation
errors in this codebase's convention):

```csharp
public class LyricsInteractionErrors(LyricsInteractionErrorMessage i18n)
{
    public LyricsInteractionErrorMessage Msg => i18n;

    /// <summary>
    /// Throws when a user attempts to like lyrics they have already liked.
    /// </summary>
    public ConflictException AlreadyLiked() => new(i18n.AlreadyLiked());

    /// <summary>
    /// Throws when a like is not found for the given lyrics and user.
    /// </summary>
    public BadRequestException LikeNotFound() => new(i18n.LikeNotFound());
}
```

Plus a new `LyricsInteractionErrorMessage` (en/fr `.resx`), mirroring
`ShortVideoInteractionErrorMessage`'s two entries (`AlreadyLiked`, `LikeNotFound`) — no bookmark
entries needed, lyrics have no bookmark feature.

## Commands + endpoints

Three new command/handler/endpoint triples, each a direct copy of the `ShortVideo` equivalent with
`ShortVideoId` → `LyricsId`:

| New file (under `Application/Interactions/UseCases/Public/Commands/`) | Mirrors |
| --- | --- |
| `LikeLyrics/PublicLikeLyricsCommand.cs` + `Handler` + `MetaField` + `V1/EndpointV1.cs` | `LikeShortVideo/*` |
| `UnlikeLyrics/PublicUnlikeLyricsCommand.cs` + `Handler` + `MetaField` + `V1/EndpointV1.cs` | `UnlikeShortVideo/*` |
| `ShareLyrics/PublicShareLyricsCommand.cs` + `Handler` + `MetaField` + `V1/EndpointV1.cs` | `ShareShortVideo/*` |
| `RecordLyricsView/PublicRecordLyricsViewCommand.cs` + `Handler` + `MetaField` + `V1/EndpointV1.cs` | `RecordShortVideoView/*` |

Routes, mirroring the `Shorts` interaction group exactly (`InteractionsRouteConstants` gains a
`Lyrics = "lyrics"` constant alongside the existing `Shorts`):

```text
POST /api/v1/public/lyrics/{id}/likes    -> like    (WithAuthorization(UserRolePolicies.RequireVisitorOnly))
DELETE /api/v1/public/lyrics/{id}/likes  -> unlike  (WithAuthorization(UserRolePolicies.RequireVisitorOnly))
POST /api/v1/public/lyrics/{id}/shares   -> share   (AllowAnonymous)
POST /api/v1/public/lyrics/{id}/views    -> record view (AllowAnonymous, same X-Device-Id/IP/User-Agent dedup signals as shorts)
```

The record-view endpoint copies `PublicRecordShortVideoViewEndpointV1`'s identity-signal collection
verbatim (`X-Device-Id` header, `HttpContext.Connection.RemoteIpAddress`, truncated `User-Agent`)
and the handler copies `PublicRecordShortVideoViewHandler`'s dedup logic verbatim
(`ViewCountingConstants.DedupWindow` — the existing 24-hour window, reused, not a new constant).

## DTO

**`LyricsDto`** (building on spec 10's version) gains, mirroring `ShortVideoDto`:

```csharp
public record LyricsDto(
    // ...spec 01 + spec 10 fields...
    int ViewCount, int LikeCount, int ShareCount,
    string AuthorId, AuthorDto? Author = null,
    bool IsLiked = false
) : AuditableDto;
```

`IsLiked` resolves per-viewer — populated on the by-slug detail lookup when the caller is
authenticated (mirroring how `PublicGetPublishedArticlesHandler` resolves `IsLiked`/`IsBookmarked`
via `GetLikedAndBookmarkedIdsAsync` for a batch, simplified here to a single-record
`HasLikedAsync` check since the detail lookup only ever resolves one record). `false` for
anonymous callers and on the list endpoint (a list card doesn't need per-viewer like state to
render a count — only the detail page's like button does).

## Task checklist

- [ ] Add `ViewCount`/`LikeCount`/`ShareCount` + increment/decrement methods to `LyricsEntity`.
- [ ] Add `LyricsLikeEntity`, `LyricsViewEventEntity`, `LyricsShareEntity` + their EF
  configurations.
- [ ] Migration: three new tables + three new counter columns.
- [ ] Add the six repository methods to `ILyricsRepository` + implementation.
- [ ] Add `LyricsInteractionErrors` + `LyricsInteractionErrorMessage` + `.resx` entries.
- [ ] Add the four command/handler/endpoint triples (like, unlike, share, record-view).
- [ ] Add `InteractionsRouteConstants.Lyrics`.
- [ ] Add `ViewCount`/`LikeCount`/`ShareCount`/`IsLiked` to `LyricsDto`; resolve `IsLiked` on the
  by-slug detail handler for authenticated callers.
- [ ] Backend builds; add unit + integration tests mirroring the existing `ShortVideo` interaction
  test suites (like/unlike/already-liked/not-liked, share, view-dedup-within-window,
  view-counts-again-after-window, anonymous vs authenticated view).
- [ ] Regenerate `116.api.ts`; confirm the four new client methods and the new `LyricsDto` fields
  are present.
