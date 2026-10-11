# Spec 10 — Song metadata & cover image

New `LyricsEntity` fields: a cover/poster image, and the song credit fields requested — album,
release year, label, songwriter, and producer. All optional (a lot of catalog lyrics won't have full
metadata), all editable via the existing admin update flow.

---

## Naming collision to avoid: "author"

`LyricsDto.Author` / `AuthorId` already means **CMS attribution** — the admin who entered the
record (see [../05-open-questions.md](../05-open-questions.md), question 2). The requested
"author" song-credit field is a different thing entirely: the **songwriter** (the person who wrote
the words — the actual music-industry term, not the classical/PRO-style "lyricist" this doc set
used in an earlier draft), distinct from the **producer** (who produced the instrumental/recording
— the dominant credited role in this genre, e.g. "Prod. by X," not "composer"), and from
`ArtistName`, the performer. Naming the songwriter credit `Author` on the entity would collide with
the existing CMS field and reintroduce the exact confusion already resolved once in this doc set.
**This spec names it `Songwriter`**, and names the other credit `Producer`.

## Domain

**`Domain/Entities/LyricsEntity.cs`** (relevant excerpt — new properties)

```csharp
/// <summary>
/// Optional cover artwork for the song — a dedicated cover if one exists, otherwise the
/// parent album's cover. Resolved to a URL via IFileRepository, same pattern as
/// ArticleEntity.CoverImageFileId.
/// </summary>
public Guid? CoverImageFileId { get; private set; }

/// <summary>
/// The album or project this song appears on, if known.
/// </summary>
[MaxLength(length: ContentConstants.MaxAlbumNameLength)]
public string? Album { get; private set; }

/// <summary>
/// The four-digit year the song was released, if known.
/// </summary>
public int? ReleaseYear { get; private set; }

/// <summary>
/// The record label that released the song, if known.
/// </summary>
[MaxLength(length: ContentConstants.MaxLabelNameLength)]
public string? Label { get; private set; }

/// <summary>
/// The person credited with writing the lyrics, if known and distinct from the
/// performing artist. Not to be confused with AuthorId, which is CMS attribution
/// (the admin who entered this record), not a music credit.
/// </summary>
[MaxLength(length: ContentConstants.MaxCreditNameLength)]
public string? Songwriter { get; private set; }

/// <summary>
/// The person credited with composing the melody, if known and distinct from the
/// performing artist.
/// </summary>
[MaxLength(length: ContentConstants.MaxCreditNameLength)]
public string? Producer { get; private set; }
```

**`Domain/Constants/ContentConstants.cs`** (new constants, alongside the existing lyrics ones)

```csharp
public const int MaxAlbumNameLength = 200;
public const int MaxLabelNameLength = 100;
public const int MaxCreditNameLength = 100;
```

**New method** — these fields are metadata, not core content, so they get their own update method
rather than overloading `Update(...)` (which already has six parameters) or `UpdateSeo(...)` (which
is specifically the three SEO fields):

```csharp
/// <summary>
/// Updates the song credit metadata and cover image. All fields optional — a lot of
/// catalog lyrics won't have complete metadata.
/// </summary>
public void UpdateMetadata(
    Guid? coverImageFileId,
    string? album,
    int? releaseYear,
    string? label,
    string? songwriter,
    string? producer
)
{
    CoverImageFileId = coverImageFileId;
    Album = album;
    ReleaseYear = releaseYear;
    Label = label;
    Songwriter = songwriter;
    Producer = producer;
}
```

## EF configuration

**`Infrastructure/Persistence/Configurations/LyricsConfiguration.cs`** (add alongside the existing
property configurations)

```csharp
builder.Property(x => x.Album).HasMaxLength(ContentConstants.MaxAlbumNameLength).IsRequired(false);

builder.Property(x => x.Label).HasMaxLength(ContentConstants.MaxLabelNameLength).IsRequired(false);

builder.Property(x => x.Songwriter).HasMaxLength(ContentConstants.MaxCreditNameLength).IsRequired(false);

builder.Property(x => x.Producer).HasMaxLength(ContentConstants.MaxCreditNameLength).IsRequired(false);
```

(`ReleaseYear` and `CoverImageFileId` need no explicit configuration — a plain nullable `int`/`Guid`
column, same as every other optional scalar in this file.)

## Migration

One migration adding six nullable columns (`CoverImageFileId`, `Album`, `ReleaseYear`, `Label`,
`Songwriter`, `Producer`) to the `Lyrics` table. Combine with spec 01's `Slug` migration if they land
in the same PR — both are additive, nullable-or-defaulted columns with no data backfill required.

## DTO

**`Application/Shared/DTOs/LyricsDto.cs`** (add six fields, positioned after the existing SEO
fields)

```csharp
public record LyricsDto(
    Guid Id, string Slug, string SongTitle, string ArtistName, string LyricsText, string Language,
    Guid? VideoId, string? MetaTitle, string? MetaDescription,
    string? CoverImageUrl, string? Album, int? ReleaseYear, string? Label,
    string? Songwriter, string? Producer,
    string AuthorId, AuthorDto? Author = null
) : AuditableDto;
```

`CoverImageUrl` is **computed**, not a stored column — resolved from `CoverImageFileId` the same
way `ArticleMapper.ResolveCoverImageUrlAsync` already resolves `ArticleEntity.CoverImageFileId`.

## Mapper

**`Application/Shared/Mappers/LyricsMapper.cs`** — `ToLyricsDtoAsync` (the author-resolving async
variant) gains cover-image resolution, mirroring `ArticleMapper.ResolveCoverImageUrlAsync` exactly:

```csharp
private static async Task<string?> ResolveCoverImageUrlAsync(
    LyricsEntity entity,
    IFileRepository fileRepository,
    CancellationToken ct
)
{
    if (!entity.CoverImageFileId.HasValue)
    {
        return null;
    }

    FileEntity? coverFile = await fileRepository.GetByIdAsync(entity.CoverImageFileId.Value, ct);
    return coverFile?.StorageUrl;
}
```

Both `ToLyricsDtoAsync` and the plain sync `ToLyricsDto` need `CoverImageUrl` populated — but the
sync path has no `IFileRepository` to call. Since the two existing public lookups
(`GetLyricsBySlug`, `GetLyricsByVideoId`) both need cover images and don't currently take a file
repository, **this spec adds `IFileRepository` to both handlers** and switches them to a new
`ToLyricsDtoWithCoverAsync` (resolves the cover only, no author lookup) rather than the full
author-resolving `ToLyricsDtoAsync` — keeping the "no author" decision from question 2 while still
getting the cover image everywhere it's needed. The list endpoint (spec 01) does the same for its
`ToLyricsDtos` → a new `ToLyricsDtosWithCoverAsync`.

## Admin commands

**`AdminUpdateLyricsCommand`** (or a new sibling `AdminUpdateLyricsMetadataCommand`, mirroring how
SEO already has its own dedicated command rather than overloading the main update) gains:
`CoverImageFileId`, `Album`, `ReleaseYear`, `Label`, `Songwriter`, `Producer` — all optional,
validated only for max length when present (`ReleaseYear` validated as a plausible year range,
e.g. 1900–current year + 1, via a simple `InclusiveBetween` FluentValidation rule).

**Recommended**: a new `AdminUpdateLyricsMetadataCommand`/`Handler`/`Validator`/`EndpointV1`
(`PUT /api/v1/admin/lyrics/{id}/metadata`), mirroring the existing
`AdminUpdateLyricsSeo` command's shape exactly — these are optional, secondary fields edited
separately from the core song content, same relationship `UpdateSeo` already has to `Update`.

## Task checklist

- [ ] Add the six new properties + `UpdateMetadata(...)` to `LyricsEntity`.
- [ ] Add `MaxAlbumNameLength`, `MaxLabelNameLength`, `MaxCreditNameLength` to `ContentConstants`.
- [ ] Update `LyricsConfiguration.cs`.
- [ ] Add the migration (combine with spec 01's `Slug` migration if convenient).
- [ ] Add the six fields to `LyricsDto`.
- [ ] Add `ResolveCoverImageUrlAsync` + `ToLyricsDtoWithCoverAsync` / `ToLyricsDtosWithCoverAsync`
  to `LyricsMapper`; wire both existing public handlers and the new list handler (spec 01) to use
  them instead of the plain sync mapper.
- [ ] Add `AdminUpdateLyricsMetadataCommand`/`Handler`/`Validator`/`EndpointV1`.
- [ ] Backend builds; add unit/integration tests for the new command and the cover-image
  resolution (present, absent, stale file id).
- [ ] Regenerate `116.api.ts`; confirm `LyricsDto` carries all six new fields and
  `adminUpdateLyricsMetadata` (or equivalent) is present.
- [ ] **Dashboard**: add a metadata form/section to the lyrics edit flow for these six fields —
  tracked here, not spec'd file-by-file (separate app).
