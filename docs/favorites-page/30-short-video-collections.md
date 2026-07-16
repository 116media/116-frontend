# 30 — Favorite Short Videos

`/favorites/shorts` contains Liked, Saved, and Shared inner collections. UI copy says “Saved” even
though backend entities/commands use bookmark terminology.

## Feasibility

The backend persists unique `ShortVideoLikeEntity` and `ShortVideoBookmarkEntity` rows plus repeated
nullable-user `ShortVideoShareEntity` events. Like/unlike, bookmark/unbookmark, and share writes
exist end to end. No by-user list read exists for any collection.

## Collection behavior

| Collection | Semantics | Context |
|---|---|---|
| `liked` | current like state | liked date |
| `saved` | current bookmark state | “Saved on {date}” + Remove |
| `shared` | grouped authenticated history | own share count + latest date |

Saved wrappers must project `ShortVideoBookmarkEntity.CreatedAt`; the short's publication/audit
date is not the saved date. `Remove` calls the existing unbookmark mutation, optimistically removes
the card with rollback, and synchronizes detail/feed state.

Shared shorts group only authenticated events. The current entity has no channel, so display the
user's count and latest date without inventing one.

## Presentation

Use a responsive portrait grid based on `ShortCard` and open `/shorts/[slug]` through the existing
detail/player flow. Private collections never fall back to dummy feed content. Filter all reads to
active shorts.

## Required reads

```text
GET /api/v1/public/shorts/liked?pageIndex&pageSize
GET /api/v1/public/shorts/bookmarked?pageIndex&pageSize
GET /api/v1/public/shorts/shared?pageIndex&pageSize
```

