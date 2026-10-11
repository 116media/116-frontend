# 15 — Backend Current State

What exists today, verified against `apps/backend` source. Written so the gap analysis in
[16](16-backend-gaps-and-contracts.md) is grounded in fact rather than assumption.

## `ArtistEntity`

`src/Modules/Content/Content/Domain/Entities/ArtistEntity.cs`

| Property | Type | Notes |
|---|---|---|
| `Name` | `string` | required |
| `Slug` | `string` | required, unique |
| `Bio` | `string?` | nullable |
| `AvatarFileId` | `Guid?` | resolved to a URL via the Core file module |
| `UserId` | `Guid?` | set when a verified artist account claims the profile; `null` is the common case |
| `VerifiedAt` | `DateTimeOffset?` | set on admin verification |

Plus `Aggregate<Guid>` audit fields.

**There is no `IsVerified` property** — verification is expressed by `UserId` + `VerifiedAt` being
non-null. The frontend needs a single derived boolean ([14](14-data-requirements.md)).

## `ArtistDto`

```csharp
public record ArtistDto(Guid Id, string Name, string Slug, string? Bio, string? AvatarUrl);
```

Exposes no verification state.

## Public endpoints

| Endpoint | Returns |
|---|---|
| `GET /api/v1/public/artists/{slug}` | `ArtistDto` + `PaginatedResult<LyricsSummaryDto>` + `PaginatedResult<VideoSummaryDto>` |
| `POST /api/v1/artists/{id}/claim` | records a claim request; does not grant ownership |

`PublicGetArtistBySlugQuery(string Slug, PaginatedRequest LyricsPage, PaginatedRequest VideosPage)`
— both catalogs independently paginated in one round trip.

**This covers the entire profile page except the verified badge and the albums tab.**

## Admin endpoints

| Endpoint | Notes |
|---|---|
| `GET /api/v1/admin/artists` | paginated, `search` param — **admin-scoped, not usable by the public page** |
| `POST /api/v1/admin/artists` | create |
| `PUT /api/v1/admin/artists/{id}` | update |
| `POST /api/v1/admin/artists/{id}/avatar` | avatar upload |
| `POST /api/v1/admin/artists/{id}/verify-owner` | confirms a claim, sets `UserId`/`VerifiedAt` |

`AdminGetAllArtistsQuery` already implements paginated search over artists. The public list
endpoint is a near-sibling of it — with different filters and a different projection, but the
query shape is proven.

## Linkage from content

| Entity | Artist link |
|---|---|
| `LyricsEntity` | ✅ `ArtistId` (nullable) |
| `VideoEntity` | ✅ `ArtistId` (nullable) |
| `AlbumEntity` | ✅ **`ArtistId` (nullable)** |
| `ArticleEntity` | ❌ none |
| `ShortVideoEntity` | ❌ none |

`AlbumEntity` has `Name`, `ArtistId` (nullable), `CoverImageFileId`, `ReleaseYear`, `Label`, and
`LyricsEntity.AlbumId` links a song to an album.

**The artist→album link therefore already exists.** What is missing is only the *query path*: no
`IAlbumRepository` method is artist-scoped and no endpoint returns an artist's albums. That is a
repository + endpoint change, not a migration.

What `AlbumEntity` does **not** have is a **release-type discriminator**, so album vs mixtape
cannot be distinguished — see [16](16-backend-gaps-and-contracts.md).

## Specifications & repository

`ArtistSpecifications` provides by-id, by-slug, by-user-id, and search. `IArtistRepository` has
`GetBySlugAsync`, `GetByIdAsync`, `GetByUserIdAsync`, `GetAllAsync`, `AddAsync`, `Update`.

`IVideoRepository.GetPublishedByArtistAsync` and `ILyricsRepository.GetPublishedByArtistAsync`
already exist and already filter to published — these are what the profile endpoint uses.

## Summary

| Page | Backend readiness |
|---|---|
| **Profile** `/artistes/{slug}` | **~90%** — needs `isVerified` on the DTO; albums tab optional |
| **Index** `/artistes` | **0%** — no public endpoint exists |

This asymmetry is why [24](24-implementation-plan.md) ships the profile first.
