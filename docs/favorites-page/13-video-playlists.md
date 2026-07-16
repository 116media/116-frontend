# 13 — Video Playlists

Playlists is the default inner collection at `/favorites/videos?collection=playlists`.

## Playlist collage card

Each summary card contains a fixed 2×2 thumbnail grid using the first four videos in playlist
`SortOrder`, plus name and video count.

| Videos | Collage behavior |
|---:|---|
| 0 | four muted placeholder cells with an add/browse affordance |
| 1 | thumbnail in the top-left cell only; three placeholders communicate available space |
| 2 | top-left and top-right populated |
| 3 | first three cells populated |
| 4+ | all four cells populated; count communicates additional videos |

Never stretch one thumbnail across the whole card: the intentionally empty cells satisfy the
requirement that a one-video playlist visibly has room for more. Missing thumbnail URLs render the
same stable placeholder without changing grid geometry.

Playlist summaries need ordered nullable `thumbnailUrls` slots (maximum four). The backend must batch project/resolve
them; the frontend must not fetch every playlist detail to build collages.

## Card actions

- `Open playlist` loads the owned playlist detail.
- `Rename` opens the existing form/dialog pattern and updates summary/detail names.
- `Delete` opens `ConfirmDialog`, deletes the playlist, removes its caches, and closes detail.

Actions belong in a clear button/menu arrangement with accessible playlist-specific labels.

## Playlist detail

Open as a route-local drawer/sheet or focused detail panel. Display all videos in server
`SortOrder`, using normal video cards/links. Include playlist name/count, rename, delete, and
remove-video controls. Removing a video confirms where appropriate and updates the collage/count.

The current `VideoInPlaylistDto` needs slug/category/publication fields before it can reuse normal
video navigation. The existing backend already supports list/detail/create/rename/delete/add/remove;
the frontend currently wires only list/create/add.
