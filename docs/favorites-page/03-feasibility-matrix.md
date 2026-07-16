# 03 — Feasibility Matrix

Audit updated: **2026-07-19**. Sources: current frontend, generated `116.api.ts`, and the
.NET Content module.

| Collection | Table/entity | Backend query | Generated client | Frontend data stack | Work |
|---|---|---|---|---|---|
| Bookmarked articles | `ArticleBookmarkEntity` | implemented with date | regeneration pending | list/toggle | generated client + frontend migration |
| Commented articles | `ArticleCommentEntity` | implemented by user | regeneration pending | none | generated client + frontend |
| Liked articles | `ArticleLikeEntity` | implemented by user | regeneration pending | toggle only | generated client + frontend |
| Playlists | playlist entities | collage list/detail + CRUD implemented | regeneration pending | list/create/add only | generated client + UI/data |
| Rated videos | `VideoRatingEntity` | implemented list | regeneration pending | rate/detail only | generated client + frontend |
| Shared articles | `ArticleShareEntity` | implemented grouped list | regeneration pending | record only | generated client + frontend |
| Shared videos | `VideoShareEntity` | implemented grouped list | regeneration pending | record only | generated client + frontend |
| Bookmarked shorts | `ShortVideoBookmarkEntity` | implemented list/date | regeneration pending | toggle only | generated client + frontend |
| Liked shorts | `ShortVideoLikeEntity` | implemented list | regeneration pending | toggle only | generated client + frontend |
| Shared shorts | `ShortVideoShareEntity` | implemented grouped list | regeneration pending | record only | generated client + frontend |

## Requested interaction feasibility

| Requirement | Data exists | Mutation exists | Read exposes it | Conclusion |
|---|:---:|:---:|:---:|---|
| Article bookmark date + remove | yes | yes | yes | backend complete; wire regenerated client |
| Latest own comment on card | yes | n/a | yes | backend complete; build card/drawer UI |
| All own comments for article | yes | n/a | yes | backend complete; lazy-load drawer |
| Edit/delete own comment | yes | yes | generated/client hooks yes | reuse; extend Favorites invalidation |
| Playlist four-thumbnail collage | yes | n/a | yes | backend complete; build collage UI |
| Open/rename/delete playlist | yes | yes | backend/generated yes | frontend domain/use-case/UI wiring required |
| Re-rate from rated card | yes | yes, upsert | yes | wire rated read to existing rating flow |
| User's video share count | yes | share write yes | yes | render current-user count |
| Saved-short date + remove | yes | yes | yes | wire saved-short read and reuse remove |

## What can ship against today's backend API

All ten collections can now be implemented against the backend API. Nothing should ship until the
generated client reflects the new schemas and operations. A feature flag may expose the shell during
phased frontend delivery, but unimplemented frontend collections must not show fabricated empty states.

## Data sufficiency

No new interaction write entity is required:

- likes/bookmarks/ratings have `UserId`, content id, and audit timestamps;
- comments have `UserId`, `ArticleId`, deletion state, body, parent, timestamps;
- article/video shares have nullable `UserId`, content id, optional channel, and `CreatedAt`;
- short likes/bookmarks have unique user/content rows; short shares have nullable `UserId`
  and event timestamps but no channel;
- playlists already include ownership and ordered video junctions.

## Database work completed

Migration `20260718225835_AddFavoriteCollectionReadIndexes` adds the user-first comment/share
indexes. Existing unique indexes continue to cover likes, bookmarks, and ratings.

Recommended additions:

```text
ArticleComments  (UserId, IsDeleted, CreatedAt DESC, ArticleId)
ArticleShares    (UserId, CreatedAt DESC, ArticleId) WHERE UserId IS NOT NULL
VideoShares      (UserId, CreatedAt DESC, VideoId)   WHERE UserId IS NOT NULL
ShortVideoShares (UserId, CreatedAt DESC, ShortVideoId) WHERE UserId IS NOT NULL
```

The share indexes are filtered to authenticated rows and all interaction feeds order timestamps
descending. Repository and HTTP integration coverage is present; production-volume `EXPLAIN`
inspection remains an operational rollout task.
