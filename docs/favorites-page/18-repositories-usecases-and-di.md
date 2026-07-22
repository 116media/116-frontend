# 18 — Repositories, Use Cases & DI

## Article module

```text
getMyArticleBookmarks(query): Result<IArticleBookmarkPage>       // upgraded mapping
getMyCommentedArticles(query): Result<ICommentedArticlePage>
getMyLikedArticles(query): Result<IArticleActivityPage>
getMySharedArticles(query): Result<IArticleActivityPage>
getMyCommentsForArticle(articleId, query): Result<IMyArticleCommentsPage>
```

Add corresponding use cases. Reuse existing edit/delete comment and unbookmark use cases; update
their cache consumers rather than duplicating commands in Favorites.

## Video module

```text
getMyRatedVideos(query): Result<IVideoActivityPage>
getMySharedVideos(query): Result<IVideoActivityPage>
getPlaylistById(id): Result<IPlaylistDetailEntity>
renamePlaylist(input): Result<boolean>
deletePlaylist(id): Result<boolean>
removeVideoFromPlaylist(input): Result<boolean>
```

Upgrade the existing playlist summary mapping with ordered `thumbnailUrls`. Reuse `RateVideoUseCase`.

## Shorts module

```text
getMyLikedShorts(query): Result<IShortVideoActivityPage>
getMySavedShorts(query): Result<IShortVideoActivityPage>
getMySharedShorts(query): Result<IShortVideoActivityPage>
```

Frontend naming may use Saved while repository implementation maps the backend bookmarked route.
Reuse existing like/unlike, bookmark/unbookmark, and share use cases.

## Rules

- Only repository implementations import the generated client.
- Map problem details through the established failure mapper.
- Use cases remain thin `Result` pass-through boundaries.
- Register additions in dependencies and all required client/server cradle types.
- Never introduce a cross-domain `FavoritesRepository`.
- Regenerate `116.api.ts`; never hand-edit it.

