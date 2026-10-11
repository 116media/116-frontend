# Spec 12 — Similar lyrics

A new public endpoint backing the detail page's "similar lyrics" section, per the requested logic:

> View similar lyrics, might come from the category for the lyrics video if it exists, if not we
> will display 10 latest lyrics that doesn't have any video linked to it.

Two distinct sourcing rules, chosen per-record, not user-configurable:

1. **Linked to a video** → other published lyrics linked to a video in that **same category**
   (`VideoEntity.CategoryId` — the "show" a video belongs to; this field is required on every
   video, so this branch never has a "category missing" case to handle).
2. **Standalone** (no linked video) → the 10 most recently created lyrics that are **also
   standalone** (`VideoId IS NULL`), newest first.

Both branches exclude the record itself and cap at 10 results.

---

## Specification

**`Application/Editorial/Specifications/LyricsSpecifications.cs`** (add alongside the existing
ones)

```csharp
/// <summary>
/// Specification matching published lyrics linked to a video in the given category,
/// excluding one specific lyrics record (the one the caller is viewing).
/// </summary>
public class LyricsSimilarByVideoCategorySpecification(Guid categoryId, Guid excludeLyricsId)
    : Specification<LyricsEntity>
{
    public override Expression<Func<LyricsEntity, bool>> ToExpression()
    {
        return lyrics =>
            lyrics.Id != excludeLyricsId
            && lyrics.VideoId != null
            && lyrics.Video != null
            && lyrics.Video.CategoryId == categoryId;
    }
}

/// <summary>
/// Specification matching standalone lyrics (no linked video), excluding one specific
/// lyrics record.
/// </summary>
public class LyricsStandaloneSpecification(Guid excludeLyricsId) : Specification<LyricsEntity>
{
    public override Expression<Func<LyricsEntity, bool>> ToExpression()
    {
        return lyrics => lyrics.Id != excludeLyricsId && lyrics.VideoId == null;
    }
}
```

`lyrics.Video != null` in the first specification requires `LyricsEntity.Video` (the existing
navigation property already used elsewhere) to be eager-loaded (`.Include(l => l.Video)`) in the
repository method below, or EF's query translation will need the relationship expressed via a join
instead — confirm which approach compiles cleanly against the provider at implementation time.

## Repository

**`ILyricsRepository`** gains:

```csharp
/// <summary>
/// Retrieves up to 10 lyrics similar to the given record: other lyrics linked to a video
/// in the same category when the given record is video-linked, otherwise the 10 most
/// recent standalone lyrics. Always excludes the given record itself.
/// </summary>
Task<List<LyricsEntity>> GetSimilarAsync(Guid lyricsId, CancellationToken cancellationToken = default);
```

Implementation:

```csharp
public async Task<List<LyricsEntity>> GetSimilarAsync(Guid lyricsId, CancellationToken cancellationToken = default)
{
    LyricsEntity? lyrics = await context.Lyrics
        .Include(l => l.Video)
        .FirstOrDefaultAsync(l => l.Id == lyricsId, cancellationToken);

    if (lyrics is null)
    {
        return [];
    }

    IQueryable<LyricsEntity> query = context.Lyrics.Include(l => l.Video);

    query =
        lyrics.VideoId.HasValue && lyrics.Video is not null
            ? query.ApplySpecification(
                new LyricsSimilarByVideoCategorySpecification(lyrics.Video.CategoryId, lyrics.Id)
            )
            : query.ApplySpecification(new LyricsStandaloneSpecification(lyrics.Id));

    return await query.OrderByDescending(l => l.CreatedAt).Take(10).ToListAsync(cancellationToken);
}
```

## Query, handler, endpoint

**`Application/Editorial/UseCases/Public/Queries/GetSimilarLyrics/PublicGetSimilarLyricsQuery.cs`**

```csharp
/// <summary>
/// Query for retrieving lyrics similar to a given one — same video category when linked,
/// otherwise the latest standalone lyrics.
/// </summary>
/// <param name="LyricsId">The lyrics record to find similar entries for.</param>
public record PublicGetSimilarLyricsQuery(Guid LyricsId) : IQuery<PublicGetSimilarLyricsResult>;

/// <summary>
/// Result of the <see cref="PublicGetSimilarLyricsQuery" />.
/// </summary>
/// <param name="Lyrics">Up to 10 similar lyrics summaries.</param>
public record PublicGetSimilarLyricsResult(IReadOnlyList<LyricsDto> Lyrics);
```

**Handler** — reuses spec 10's cover-resolving, author-less mapper path (`ToLyricsDtosWithCoverAsync`),
same as the list endpoint:

```csharp
public class PublicGetSimilarLyricsHandler(ILyricsRepository lyricsRepository, IFileRepository fileRepository, IMapper mapper)
    : IQueryHandler<PublicGetSimilarLyricsQuery, PublicGetSimilarLyricsResult>
{
    public async Task<PublicGetSimilarLyricsResult> Handle(
        PublicGetSimilarLyricsQuery query,
        CancellationToken cancellationToken
    )
    {
        List<LyricsEntity> similar = await lyricsRepository.GetSimilarAsync(query.LyricsId, cancellationToken);
        IReadOnlyList<LyricsDto> dtoList = await similar
            .AsReadOnly()
            .ToLyricsDtosWithCoverAsync(mapper, fileRepository, cancellationToken);

        return new PublicGetSimilarLyricsResult(Lyrics: dtoList);
    }
}
```

**Endpoint**: `GET /api/v1/public/lyrics/{id}/similar` — a sibling route in the same group as the
by-slug and list endpoints, keyed by id (not slug) since the caller already has the full
`LyricsDto` (with its `Id`) from the by-slug response by the time it requests similar lyrics.

```text
GET /api/v1/public/lyrics/{id}/similar  -> PublicGetSimilarLyricsResponse { lyrics: LyricsDto[] }
```

`AllowAnonymous`, `RateLimitPolicies.ContentBrowsing`, same as every other public lyrics read.

## Task checklist

- [ ] Add `LyricsSimilarByVideoCategorySpecification`, `LyricsStandaloneSpecification`.
- [ ] Add `GetSimilarAsync` to `ILyricsRepository` + implementation.
- [ ] Add `PublicGetSimilarLyricsQuery`/`Handler`/`MetaField`/`EndpointV1`.
- [ ] Backend builds; add integration tests: video-linked record returns same-category matches
  only, excludes itself; standalone record returns the 10 latest standalone matches, excludes
  itself; a record with fewer than 10 available matches returns fewer than 10, not padded or
  errored; a video-linked record whose category has zero other lyrics returns an empty list (does
  **not** fall back to the standalone branch — the two rules are mutually exclusive by design, not
  a cascading fallback chain).
- [ ] Regenerate `116.api.ts`; confirm `getSimilarLyrics` (or equivalent generated name) is
  present.
