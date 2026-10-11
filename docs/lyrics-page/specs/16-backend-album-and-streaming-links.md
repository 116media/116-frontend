# Spec 16 — Backend: Album Tracks & Streaming Links

Design: [../06-musixmatch-scale-expansion.md](../06-musixmatch-scale-expansion.md) §2e/§2f. Schema:
[../08-db-schema.md](../08-db-schema.md) (`StreamingLinks`).

## `StreamingLinkEntity`

```csharp
public sealed class StreamingLinkEntity : Aggregate<Guid>
{
    public Guid AlbumId { get; private set; }
    public StreamingPlatform Platform { get; private set; } // Spotify | AppleMusic | YouTubeMusic | Tidal
    public string Url { get; private set; }

    public static StreamingLinkEntity Create(Guid albumId, StreamingPlatform platform, string url) { ... }
    public void UpdateUrl(string url) => Url = url;
}
```

`UNIQUE(AlbumId, Platform)` — `AdminUpsertStreamingLinkCommand` does a create-or-update against
that constraint (a single upsert statement, not a check-then-branch, matching the ACID posture in
08-db-schema.md).

## "More from this album" query

`ILyricsRepository.GetByAlbumAsync(Guid albumId, Guid excludeLyricsId, CancellationToken ct)` —
`WHERE AlbumId = @albumId AND Id != @excludeLyricsId ORDER BY CreatedAt`, no pagination (an album
has a bounded, small track count).

## Streaming-link resolution (with fallback)

`GET /api/v1/public/lyrics/{slug}` (already extended twice — spec 13's artist slug, spec 01's
video slug) is extended once more: when `AlbumId` is set, the response includes
`AlbumTracks: LyricsSummaryDto[]` and `StreamingLinks: { platform: string; url: string }[]` — one
entry per platform, **always all four**, resolved as:

```csharp
string ResolveUrl(StreamingPlatform platform, StreamingLinkEntity? stored, AlbumEntity album, ArtistEntity? artist)
{
    if (stored is not null) return stored.Url;

    var query = Uri.EscapeDataString($"{artist?.Name ?? lyrics.ArtistName} {album.Name}");
    return platform switch
    {
        StreamingPlatform.Spotify => $"https://open.spotify.com/search/{query}",
        StreamingPlatform.AppleMusic => $"https://music.apple.com/search?term={query}",
        StreamingPlatform.YouTubeMusic => $"https://music.youtube.com/search?q={query}",
        StreamingPlatform.Tidal => $"https://listen.tidal.com/search?q={query}",
    };
}
```

The frontend's "Go to album" modal (06f) never has to special-case a missing link — it always
receives four usable URLs, curated or generated.

## Endpoints

| Method | Route | Auth |
| --- | --- | --- |
| PUT | `/api/v1/admin/albums/{id}/streaming-links/{platform}` | Admin — upsert |
| DELETE | `/api/v1/admin/albums/{id}/streaming-links/{platform}` | Admin — remove the stored override, reverting that platform to the generated fallback |

## Task checklist

- [ ] `StreamingLinkEntity` + EF configuration + migration
- [ ] `AdminUpsertStreamingLinkCommand`/`Handler`, delete endpoint
- [ ] `ILyricsRepository.GetByAlbumAsync`
- [ ] `PublicGetLyricsBySlugHandler` resolves `AlbumTracks` + all-four `StreamingLinks` (stored or
  generated) in the same call
- [ ] Integration tests: stored link takes precedence, missing link falls back to a valid
  generated URL for all four platforms, `AlbumTracks` excludes the current song and is empty when
  `AlbumId` is null
