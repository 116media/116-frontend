# 19 — State Management & Query Keys

## URL state

Pathname owns content type; `collection` owns the inner view. Drawer/dialog state stays local and
does not enter a global store.

## Query keys

```text
articleKeys.favorites.bookmarked
articleKeys.favorites.commented
articleKeys.favorites.liked
articleKeys.favorites.shared
articleKeys.favorites.myComments(articleId)

videoKeys.favorites.rated
videoKeys.favorites.shared
videoKeys.favorites.playlists
videoKeys.favorites.playlist(id)

shortKeys.favorites.liked
shortKeys.favorites.saved
shortKeys.favorites.shared
```

Collections use infinite queries at page size 12. Playlist summaries remain a normal query if the
backend keeps its unpaginated list. Comment drawer and playlist detail enable only while open.

## Mutation coherence

| Mutation | Required cache effects |
|---|---|
| unbookmark article | optimistically remove bookmark wrapper; detail/feed interaction state |
| edit comment | my-comments drawer + commented latest preview/count ordering invalidation |
| delete comment | drawer + commented collection; remove card if last own comment |
| rate/re-rate video | rated list own stars/order + detail/feed aggregates |
| playlist rename/delete | summary + selected detail/open state |
| add/remove playlist video | summary count/collage + detail + membership |
| unsave short | optimistically remove saved wrapper + detail/feed state |
| share authenticated | grouped matching collection + detail aggregate |

Use optimistic removal only where the server result is deterministic and retain rollback snapshots.
Grouped comment/share ordering is server-derived and should converge through invalidation.

