# 02 — Product Model

“Favorites” is the umbrella for three content libraries. Each library contains interaction
collections with different persistence semantics.

| Side-menu destination | Inner collection | Persistence | Display unit |
|---|---|---|---|
| Favorite articles | Bookmarked | current state | article + bookmarked date |
| Favorite articles | Commented | history, grouped | article + latest own comment/count |
| Favorite articles | Liked | current state | article |
| Favorite articles | Shared | history, grouped | article + own share count |
| Favorite videos | Playlists | mutable collections | playlist collage |
| Favorite videos | Rated | current/upserted state | video + own stars |
| Favorite videos | Shared | history, grouped | video + own share count |
| Favorite short videos | Liked | current state | short video |
| Favorite short videos | Saved | current state | short + saved date |
| Favorite short videos | Shared | history, grouped | short + own share count |

## Route discriminants

```text
/favorites/articles?collection=bookmarked|commented|liked|shared
/favorites/videos?collection=playlists|rated|shared
/favorites/shorts?collection=liked|saved|shared
```

Missing or invalid collection values resolve to the first collection for that content route.
User-facing short-video copy says **Saved**; backend/domain storage may retain “bookmark”.

## Current state versus history

- Removing an article bookmark, article like, short save, or short like removes the item.
- Re-rating updates the same rated-video item and its “Your rating” value.
- Comment/share histories collapse repeated events into one content card.
- Deleting the last remaining user comment removes that article from Commented.
- Only published articles/videos and active shorts remain visible.

