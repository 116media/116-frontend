# 05 — Generated API Client

Regenerate only after backend/OpenAPI changes. Never hand-edit `116.api.ts`.

## Expected new operations

```text
publicGetMyCommentedArticles
publicGetMyLikedArticles
publicGetMySharedArticles
publicGetMyCommentsForArticle
publicGetMyRatedVideos
publicGetMySharedVideos
publicGetMyBookmarkedShortVideos
publicGetMyLikedShortVideos
publicGetMySharedShortVideos
```

The existing article bookmark operation now returns bookmark wrappers. Existing playlist summary
and detail operations generate the added thumbnail/card fields.

## Verification

- [ ] Confirm nine new methods accept correct pagination and authentication configuration.
- [ ] Confirm bookmark/comment/activity wrapper nullability and nested DTOs.
- [ ] Confirm playlist summary thumbnail array and detail route fields.
- [ ] Confirm rated stars are numeric and short saved timestamp is required.
- [ ] Search generated diffs for unrelated breaking changes.
- [ ] Type-check before writing handwritten repository mappings.

