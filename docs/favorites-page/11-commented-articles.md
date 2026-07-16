# 11 — Commented Articles & Comment Management

## Collection card

Show each published article on which the current user has at least one non-deleted top-level
comment or reply. Multiple comments collapse into one card. The card displays:

- the normal article summary;
- the user's latest remaining comment body (multi-line clamped, never HTML-injected);
- “{count} comments · Last commented {date}”;
- `View comments`;
- `View article` linking to `/articles/[slug]`.

The latest comment is actual current-user content, not a generated excerpt string. The API wrapper
therefore returns `latestComment: ArticleCommentDto` plus count/date.

## My comments drawer

`View comments` opens an accessible responsive detail surface:

- desktop: side drawer/sheet;
- mobile: full-height bottom sheet or full-screen dialog;
- title identifies the article;
- lazy paginated list of **all non-deleted comments and replies by the current user on that
  article**, newest first;
- reply rows indicate that they are replies and may show a compact parent-comment context;
- each row shows created/edited time, body, Edit, and Delete;
- header/footer includes `View article`.

This is not the entire public discussion thread. Loading every user's comments would be noisy and
would not match the ownership-management purpose.

## Edit/delete

Existing backend endpoints, generated methods, article repository methods, use cases, and hooks
already edit and soft-delete an owned comment. Reuse them, but extend cache effects:

- edit updates/invalidate the drawer and commented-card latest preview;
- delete confirms, removes the row from the private drawer, and refreshes count/latest preview;
- deleting the last remaining own comment removes the article card;
- deleting a non-latest comment keeps the existing latest preview;
- failures preserve the body/list and restore focus appropriately.

## Implemented backend reads

`GET /articles/{articleId}/comments/mine` now provides the private drawer, and
`GET /articles/commented` provides the grouped collection described in
[06](06-backend-required-contracts.md). Frontend data and presentation wiring remain.
