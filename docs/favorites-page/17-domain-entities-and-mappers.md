# 17 — Domain Entities & Mappers

Resource entities remain in articles, videos, and shorts. Interaction wrappers carry Favorites
context without polluting generic content summaries.

## Articles

```ts
IArticleBookmarkEntity { article; bookmarkedAt }

ICommentedArticleEntity {
  article;
  latestComment;
  commentCount;
  lastCommentedAt;
}

IArticleActivityEntity {
  article;
  lastInteractedAt;
  interactionCount;
  lastShareChannel?;
}

IMyArticleCommentsPage { items: IArticleCommentEntity[]; pagination fields }
```

`latestComment` uses the existing comment entity/mapper so id, body, timestamps, parent id, and
ownership behavior remain consistent with the drawer edit/delete flows.

## Videos and playlists

```ts
IVideoActivityEntity {
  video;
  lastInteractedAt;
  interactionCount;
  ratedStars?;
  lastShareChannel?;
}

IPlaylistEntity { id; name; videoCount; thumbnailUrls: Array<string | null> }
IPlaylistDetailEntity { id; name; videos: IPlaylistVideoEntity[] }
IPlaylistVideoEntity { videoId; slug; title; thumbnailUrl; ratingAverage; ratingCount;
                       sortOrder; categoryName; publishedAt }
```

Validate rated endpoint stars to 1–5. Preserve playlist thumbnail slot order/nulls and cap summary mapping
at four even if a malformed response contains more.

## Short videos

```ts
IShortVideoActivityEntity { shortVideo; lastInteractedAt; interactionCount }
IShortVideoActivityPage { items; pageIndex; pageSize; count; hasNextPage }
```

Saved cards interpret `lastInteractedAt` as the bookmark creation time. Shared cards interpret it
as latest authenticated share time.

## Mapper rules

- Reuse article summary, comment, video summary, and short mappers.
- Reject missing required activity timestamps rather than substituting content publication dates.
- Normalize optional channels/parent context to `undefined`, not empty strings.
- Derive `hasNextPage` from the standard envelope.
- Generated DTOs never enter presentation components.
