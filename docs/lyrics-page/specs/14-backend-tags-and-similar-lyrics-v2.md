# Spec 14 — Backend: Tags & Similar-Lyrics v2

Extends [12-backend-similar-lyrics.md](12-backend-similar-lyrics.md) with the tag-based fallback
described in [../06-musixmatch-scale-expansion.md](../06-musixmatch-scale-expansion.md) §2d.

## `TagEntity` / `LyricsTagEntity`

```csharp
public sealed class TagEntity : Aggregate<Guid>
{
    public string Name { get; private set; }
    public string Slug { get; private set; }
    public static TagEntity Create(string name, string slug) { ... }
}
```

`LyricsTagEntity` is a plain join row (`LyricsId`, `TagId`, composite PK) — no independent
lifecycle, added/removed as a set via `LyricsEntity.SetTags(IReadOnlyCollection<Guid> tagIds)`,
mirroring however this codebase already models a many-to-many tag/category relationship elsewhere
(reuse that pattern directly if a `CategoryTag`-style precedent exists on videos; if none exists,
this is the first, and stays this simple).

## `ILyricsRepository.GetSimilarAsync` — updated branching

```csharp
public async Task<IReadOnlyList<LyricsEntity>> GetSimilarAsync(Guid lyricsId, CancellationToken ct)
{
    var lyrics = await GetByIdOrThrowAsync(lyricsId, ct);

    if (lyrics.VideoId.HasValue && lyrics.Video?.CategoryId is { } categoryId)
        return await ApplySpecification(new LyricsSimilarByVideoCategorySpecification(categoryId, excludeId: lyricsId))
            .Take(10).ToListAsync(ct);

    var tagIds = lyrics.Tags.Select(t => t.Id).ToList();
    if (tagIds.Count > 0)
    {
        var byTag = await ApplySpecification(new LyricsBySharedTagsSpecification(tagIds, excludeId: lyricsId))
            .Take(10).ToListAsync(ct);
        if (byTag.Count > 0) return byTag;
    }

    return await ApplySpecification(new LyricsStandaloneSpecification(excludeId: lyricsId))
        .Take(10).ToListAsync(ct);
}
```

`LyricsBySharedTagsSpecification` joins `LyricsTags` on the candidate's tag set, groups by
`LyricsId`, orders by `COUNT(shared tags) DESC, CreatedAt DESC` — more shared tags ranks higher,
recency breaks ties. The three-branch order (video-category → shared-tags → latest-standalone) is
a strict waterfall: the first branch with any results wins; branches don't merge.

## Admin tagging

`AdminUpdateLyricsCommand` (existing, spec 10 already extends it once for metadata) gains a
`TagIds: IReadOnlyCollection<Guid>?` field — omitted/null leaves tags unchanged, an empty array
clears them, matching the existing "each field independently optional" convention from spec 10.

`GET /api/v1/admin/tags` (simple list, for the dashboard's tag picker) and
`POST /api/v1/admin/tags` (create a new tag inline, same "create-on-the-fly" UX a category/label
picker elsewhere in the dashboard likely already has — reuse that component if it exists, don't
build a second one).

## Task checklist

- [ ] `TagEntity`, `LyricsTagEntity` + EF configuration + migration
- [ ] `LyricsEntity.Tags` navigation + `SetTags(...)`
- [ ] `LyricsBySharedTagsSpecification`
- [ ] `ILyricsRepository.GetSimilarAsync` updated to the three-branch waterfall
- [ ] `AdminUpdateLyricsCommand.TagIds` + validator
- [ ] `GET`/`POST /api/v1/admin/tags`
- [ ] `LyricsDto.Tags: string[]` (names, for display) added to the public detail response
- [ ] Integration tests: video-category branch unaffected (regression), shared-tags branch (2+
  songs sharing a tag rank above songs sharing none), zero-tags-and-no-video falls through to
  latest-standalone unchanged
