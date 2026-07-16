# 10 — Playlist Collage & Management

## 2×2 card collage

Always render four equal cells. Populate up to four thumbnail URLs in order. For one video, only
top-left is populated; remaining cells are muted placeholders so available space is visible. Zero,
two, three, and four-plus states follow [13](../13-video-playlists.md). Missing URLs do not collapse
cells.

The card displays playlist name/count plus Open, Rename, and Delete actions. No card may fetch
playlist detail just to obtain thumbnails.

## Detail/mutations

Open lazy detail in a sheet/panel and render every ordered video with valid detail navigation.
Rename uses established form validation. Delete and remove-video confirm. Disable only the active
mutation, prevent duplicates, preserve confirmed data on failure, and restore focus.

## Tasks

- [ ] Build deterministic collage for 0/1/2/3/4+ and missing-image cases.
- [ ] Build lazy playlist detail and ordered video cards.
- [ ] Wire open/rename/delete/remove with video-owned hooks.
- [ ] Synchronize name/count/collage/detail/membership caches with rollback.
- [ ] Test keyboard menus/sheets/dialogs, ownership errors, and mobile layout.

