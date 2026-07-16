# 06 — Frontend Article Data

## Surface

```text
IArticleBookmarkEntity / IArticleBookmarkPage
ICommentedArticleEntity / ICommentedArticlePage
IArticleActivityEntity / IArticleActivityPage
IMyArticleCommentsPage

GetMyArticleBookmarksUseCase (mapping upgrade)
GetMyCommentedArticlesUseCase
GetMyLikedArticlesUseCase
GetMySharedArticlesUseCase
GetMyCommentsForArticleUseCase

useMyArticleBookmarks
useMyCommentedArticles
useMyLikedArticles
useMySharedArticles
useMyCommentsForArticle
```

Reuse the existing article summary/comment mappers and edit/delete/unbookmark mutation paths.
Generated DTOs stay in infrastructure.

## Cache effects

- Unbookmark optimistically removes a bookmark wrapper with rollback.
- Edit/delete mutations invalidate/patch `myComments(articleId)` and the grouped Commented list.
- Deleting the last own comment removes the article after server convergence.
- Share/like mutations invalidate their matching collections only if already fetched.

## Tasks

- [ ] Add documented wrapper/page types and defensive mappers.
- [ ] Upgrade bookmark mapping and add four new read repository/use-case paths.
- [ ] Add DI/cradle registrations, keys, and enabled infinite/detail hooks.
- [ ] Extend existing comment mutation invalidation for Favorites caches.
- [ ] Test timestamp mapping, latest comment, pagination, errors, edit/delete, and rollback.

