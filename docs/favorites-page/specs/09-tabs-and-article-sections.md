# 09 — Article Collections & Comment Drawer

## URL contract

```text
/favorites/articles?collection=bookmarked|commented|liked|shared
```

Bookmarked is the default. Validate values and enable only the selected query.

## Bookmarked

Render the actual locale-formatted `bookmarkedAt` and a visible Remove action. Use optimistic
unbookmark with rollback and normal article navigation.

## Commented

Use `CommentedArticleCard` to show the latest own comment body, own count/latest date, View
comments, and View article. View comments opens `MyArticleCommentsDrawer`, which lazily paginates
only the user's comments/replies and reuses edit/delete behavior.

The drawer is a right sheet on desktop and full-height mobile surface. It labels reply rows, traps
and restores focus, confirms deletion, and retains View article. Edit/delete update the drawer and
grouped card; last-comment deletion removes the card.

## Liked/shared

Reuse article cards. Unlike removes the current-state item. Shared context displays the user's
event count/latest date/channel separately from global share totals.

## Tasks

- [ ] Implement collection URL normalization and cached switching.
- [ ] Add bookmark date/removal with rollback.
- [ ] Build commented wrapper card and lazy accessible drawer.
- [ ] Reuse edit/delete hooks with Favorites invalidation and confirmation.
- [ ] Build liked/shared panels and test all loading/empty/error/pagination states.

