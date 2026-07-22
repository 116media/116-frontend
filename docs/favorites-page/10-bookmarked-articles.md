# 10 — Bookmarked Articles

Bookmarked is the default inner collection at
`/favorites/articles?collection=bookmarked`.

## Required row data

The current endpoint already orders bookmark rows by `CreatedAt DESC`, but throws that timestamp
away when projecting `ArticleSummaryDto`. Upgrade its result to:

```text
UserBookmarkedArticleDto { article; bookmarkedAt }
```

Do not use the article publication/creation date as the bookmark date.

## Card behavior

Reuse the existing article card anatomy, then add collection context outside the generic content
entity:

- locale-formatted “Bookmarked on {date}”;
- a visible `Remove` action with bookmark icon and accessible article-specific label;
- normal card/title navigation to `/articles/[slug]`.

Remove uses the existing unbookmark command. Optimistically remove the wrapper from the infinite
query, preserve a rollback snapshot, and show the existing mapped failure notification if the
mutation fails. Also synchronize detail/feed interaction caches without refetching unrelated
Favorites collections.

`/bookmarks` redirects to this route/collection.

