# 16 — Shared Videos

The semantics mirror [15 — Shared Articles](15-shared-articles.md), using
`VideoShareEntity` and `VideoSummaryDto`.

## Rules

- Authenticated events only.
- One card per distinct published video.
- Newest user share first.
- `interactionCount` is the number of that user's recorded events for the video.
- `lastShareChannel` is optional.
- Public `shareCount` on the card remains the global aggregate, not the user's count.

## UI

Reuse `VideosGrid` / `VideoCard.Vertical` with an explicit personal context row such as
“You shared this 4 times · Last shared 2 days ago”. `interactionCount` is the user's count,
not the video's global share counter. The count remains visible even when channel is absent.
Do not show YouTube views/likes/comments here; those are external statistics fetched on
the video detail scoreboard.

## Current blocker

The write endpoint exists and stores the necessary data, but there is no by-user list
endpoint or optimized `(UserId, CreatedAt, VideoId)` index.
